import debug from 'debug'
import {
  type ChildProcess,
  type SpawnOptions,
  type SpawnOptionsWithStdioTuple,
  spawn,
} from 'node:child_process'
import {EventEmitter, once} from 'node:events'
import {Server} from 'node:net'
import {Stream} from 'node:stream'
import {finished} from 'node:stream/promises'

import {ConnectionDetails, TunnelConfig} from '../../types/pg/tunnel.js'
import {getConfigs, sshTunnel} from './bastion.js'

const pgDebug = debug('pg')

export function consumeStream(inputStream: Stream) {
  let result = ''
  const throughStream = new Stream.PassThrough()

  // eslint-disable-next-line no-async-promise-executor
  const promise = new Promise(async (resolve, reject) => {
    try {
      await finished(throughStream)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })

  // eslint-disable-next-line no-return-assign
  throughStream.on('data', chunk => result += chunk.toString())
  inputStream.pipe(throughStream)
  return promise
}

export async function exec(db: ConnectionDetails, query: string, cmdArgs: string[] = []) {
  const configs = getConfigs(db)
  const options = psqlQueryOptions(query, configs.dbEnv, cmdArgs)
  return runWithTunnel(db, configs.dbTunnelConfig, options)
}

export function psqlQueryOptions(query:string, dbEnv: NodeJS.ProcessEnv, cmdArgs: string[] = []) {
  pgDebug('Running query: %s', query.trim())

  const psqlArgs = ['-c', query, '--set', 'sslmode=require', ...cmdArgs]

  const childProcessOptions: SpawnOptionsWithStdioTuple<'ignore', 'pipe', 'inherit'> = {
    stdio: ['ignore', 'pipe', 'inherit'],
  }

  return {
    childProcessOptions,
    dbEnv,
    psqlArgs,
  }
}

export function execPSQL({childProcessOptions, dbEnv, psqlArgs}: {childProcessOptions: SpawnOptions, dbEnv: NodeJS.ProcessEnv, psqlArgs: string[]}) {
  const options = {
    env: dbEnv,
    ...childProcessOptions,
  }

  pgDebug('opening psql process')
  const psql = spawn('psql', psqlArgs, options)
  psql.once('spawn', () => pgDebug('psql process spawned'))

  return psql
}

// According to node.js docs, sending a kill to a process won't cause an error
// but could have unintended consequences if the PID gets reassigned:
// https://nodejs.org/docs/latest-v14.x/api/child_process.html#child_process_subprocess_kill_signal
// To be on the safe side, check if the process was already killed before sending the signal
function kill(childProcess: ChildProcess, signal: NodeJS.Signals | number | undefined) {
  if (!childProcess.killed) {
    pgDebug('killing psql child process')
    childProcess.kill(signal)
  }
}

export async function runWithTunnel(db: ConnectionDetails, tunnelConfig: TunnelConfig, options: Parameters<typeof execPSQL>[0]): Promise<string> {
  const tunnel = await Tunnel.connect(db, tunnelConfig)
  pgDebug('after create tunnel')

  const psql = execPSQL(options)
  // interactive opens with stdio: 'inherit'
  // which gives the child process the same stdin,stdout,stderr of the node process (global `process`)
  // https://nodejs.org/api/child_process.html#child_process_options_stdio
  // psql.stdout will be null in this case
  // return a string for consistency but ideally we should return the child process from this function
  // and let the caller decide what to do with stdin/stdout/stderr
  const stdoutPromise = psql.stdout ? consumeStream(psql.stdout) : Promise.resolve('')
  const cleanupSignalTraps = trapAndForwardSignalsToChildProcess(psql)

  try {
    pgDebug('waiting for psql or tunnel to exit')
    // wait for either psql or tunnel to exit;
    // the important bit is that we ensure both processes are
    // always cleaned up in the `finally` block below
    await Promise.race([
      waitForPSQLExit(psql),
      tunnel.waitForClose(),
    ])
  } catch (error) {
    pgDebug('wait for psql or tunnel error', error)
    throw error
  } finally {
    pgDebug('begin tunnel cleanup')
    cleanupSignalTraps()
    tunnel.close()
    kill(psql, 'SIGKILL')
    pgDebug('end tunnel cleanup')
  }

  return stdoutPromise as Promise<string>
}

// trap SIGINT so that ctrl+c can be used by psql without killing the
// parent node process.
// you can use ctrl+c in psql to kill running queries
// while keeping the psql process open.
// This code is to stop the parent node process (heroku CLI)
// from exiting. If the parent Heroku CLI node process exits, then psql will exit as it
// is a child process of the Heroku CLI node process.
export const trapAndForwardSignalsToChildProcess = (childProcess: ChildProcess) => {
  const signalsToTrap: NodeJS.Signals[] = ['SIGINT']
  const signalTraps = signalsToTrap.map(signal => {
    process.removeAllListeners(signal)
    const listener = () => kill(childProcess, signal)
    process.on(signal, listener)
    return [signal, listener]
  }) as ([NodeJS.Signals, () => void])[]

  // restores the built-in node ctrl+c and other handlers
  return () => {
    for (const [signal, listener] of signalTraps) {
      process.removeListener(signal as string, listener)
    }
  }
}

export async function waitForPSQLExit(psql: EventEmitter) {
  let errorToThrow: Error | null = null
  try {
    const [exitCode] = await once(psql, 'close')

    pgDebug(`psql exited with code ${exitCode}`)
    if (exitCode > 0) {
      errorToThrow = new Error(`psql exited with code ${exitCode}`)
    }
  } catch (error) {
    pgDebug('psql process error', error)
    const {code} = error as {code: string}
    if (code === 'ENOENT') {
      errorToThrow = new Error('The local psql command could not be located. For help installing psql, see https://devcenter.heroku.com/articles/heroku-postgresql#local-setup')
    }
  }

  if (errorToThrow) {
    throw errorToThrow
  }
}

// a small wrapper around tunnel-ssh
// so that other code doesn't have to worry about
// whether there is or is not a tunnel
export class Tunnel {
  private readonly bastionTunnel: Server
  private readonly events: EventEmitter
  constructor(bastionTunnel: Server) {
    this.bastionTunnel = bastionTunnel
    // eslint-disable-next-line unicorn/prefer-event-target
    this.events = new EventEmitter()
  }

  static async connect(db: ConnectionDetails, tunnelConfig: TunnelConfig) {
    const tunnel = await sshTunnel(db, tunnelConfig)
    return new Tunnel(tunnel as Server)
  }

  close() {
    if (this.bastionTunnel) {
      pgDebug('close tunnel')
      this.bastionTunnel.close()
    } else {
      pgDebug('no tunnel necessary; sending fake close event')
      this.events.emit('close', 0)
    }
  }

  async waitForClose() {
    if (this.bastionTunnel) {
      try {
        pgDebug('wait for tunnel close')
        await once(this.bastionTunnel, 'close')
        pgDebug('tunnel closed')
      } catch (error) {
        pgDebug('tunnel close error', error)
        throw new Error('Secure tunnel to your database failed')
      }
    } else {
      pgDebug('no bastion required; waiting for fake close event')
      await once(this.events, 'close')
    }
  }
}
