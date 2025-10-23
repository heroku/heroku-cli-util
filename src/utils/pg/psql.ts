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
import {getPsqlConfigs, sshTunnel} from './bastion.js'

const pgDebug = debug('pg')

/**
 * A small wrapper around tunnel-ssh so that other code doesn't have to worry about whether there is or is not a tunnel.
 */
export class Tunnel {
  private readonly events: EventEmitter
  /**
   * Creates a new Tunnel instance.
   *
   * @param bastionTunnel - The SSH tunnel server or void if no tunnel is needed
   */
  constructor(private readonly bastionTunnel: Server | void) {
    // eslint-disable-next-line unicorn/prefer-event-target
    this.events = new EventEmitter()
  }

  /**
   * Creates and connects to an SSH tunnel.
   *
   * @param connectionDetails - The database connection details with attachment information
   * @param tunnelConfig - The tunnel configuration object
   * @param tunnelFn - The function to create the SSH tunnel (default: sshTunnel)
   * @returns Promise that resolves to a new Tunnel instance
   */
  static async connect(
    connectionDetails: ConnectionDetails,
    tunnelConfig: TunnelConfig,
    tunnelFn: typeof sshTunnel,
  ) {
    const tunnel = await tunnelFn(connectionDetails, tunnelConfig)
    return new Tunnel(tunnel)
  }

  /**
   * Closes the tunnel if it exists, or emits a fake close event if no tunnel is needed.
   *
   * @returns void
   */
  close(): void {
    if (this.bastionTunnel) {
      pgDebug('close tunnel')
      this.bastionTunnel.close()
    } else {
      pgDebug('no tunnel necessary; sending fake close event')
      this.events.emit('close', 0)
    }
  }

  /**
   * Waits for the tunnel to close.
   *
   * @returns Promise that resolves when the tunnel closes
   * @throws Error if the secure tunnel fails
   */
  async waitForClose(): Promise<void> {
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
      pgDebug('no tunnel required; waiting for fake close event')
      await once(this.events, 'close')
    }
  }
}

type SpawnPsqlOptions = {
  childProcessOptions: SpawnOptions,
  dbEnv: NodeJS.ProcessEnv,
  psqlArgs: string[],
}

export default class PsqlService {
  constructor(
    private readonly connectionDetails: ConnectionDetails,
    private readonly getPsqlConfigsFn = getPsqlConfigs,
    private readonly spawnFn = spawn,
    private readonly tunnelFn = sshTunnel,
  ) {}

  /**
   * Executes a PostgreSQL query using the instance's database connection details.
   * It uses the `getPsqlConfigs` function to get the configuration for the database and the tunnel,
   * and then calls the `runWithTunnel` function to execute the query.
   *
   * @param query - The SQL query to execute
   * @param psqlCmdArgs - Additional command-line arguments for psql (default: [])
   * @returns Promise that resolves to the query result as a string
   */
  public async execQuery(query: string, psqlCmdArgs: string[] = []) {
    const configs = this.getPsqlConfigsFn(this.connectionDetails)
    const options = this.psqlQueryOptions(query, configs.dbEnv, psqlCmdArgs)
    return this.runWithTunnel(configs.dbTunnelConfig, options)
  }

  /**
   * Consumes a stream and returns its content as a string.
   *
   * @param inputStream - The input stream to consume
   * @returns Promise that resolves to the stream content as a string
   */
  private consumeStream(inputStream: Stream): Promise<string> {
    let result = ''
    const throughStream = new Stream.PassThrough()

    // eslint-disable-next-line no-async-promise-executor
    const promise = new Promise<string>(async (resolve, reject) => {
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

  /**
   * Kills a child process if it hasn't been killed already.
   * According to node.js docs, sending a kill to a process won't cause an error
   * but could have unintended consequences if the PID gets reassigned.
   * To be on the safe side, check if the process was already killed before sending the signal.
   *
   * @param childProcess - The child process to kill
   * @param signal - The signal to send to the process
   * @returns void
   */
  private kill(childProcess: ChildProcess, signal: NodeJS.Signals | number | undefined): void {
    if (!childProcess.killed) {
      pgDebug('killing psql child process')
      childProcess.kill(signal)
    }
  }

  /**
   * Creates the options for spawning the psql process.
   *
   * @param query - The SQL query to execute
   * @param dbEnv - The database environment variables
   * @param psqlCmdArgs - Additional command-line arguments for psql (default: [])
   * @returns Object containing child process options, database environment, and psql arguments
   */
  private psqlQueryOptions(query: string, dbEnv: NodeJS.ProcessEnv, psqlCmdArgs: string[] = []): SpawnPsqlOptions {
    pgDebug('Running query: %s', query.trim())

    const psqlArgs = ['-c', query, '--set', 'sslmode=require', ...psqlCmdArgs]

    const childProcessOptions: SpawnOptionsWithStdioTuple<'ignore', 'pipe', 'inherit'> = {
      stdio: ['ignore', 'pipe', 'inherit'],
    }

    return {
      childProcessOptions,
      dbEnv,
      psqlArgs,
    }
  }

  /**
   * Runs the psql command with tunnel support.
   *
   * @param tunnelConfig - The tunnel configuration object
   * @param options - The options for spawning the psql process
   * @returns Promise that resolves to the query result as a string
   */
  // eslint-disable-next-line perfectionist/sort-classes
  public async runWithTunnel(
    tunnelConfig: TunnelConfig,
    options: Parameters<typeof this.spawnPsql>[0],
  ): Promise<string> {
    const tunnel = await Tunnel.connect(this.connectionDetails, tunnelConfig, this.tunnelFn)
    pgDebug('after create tunnel')

    const psql = this.spawnPsql(options)
    // Note: In non-interactive mode, psql.stdout is available for capturing output.
    // In interactive mode, stdio: 'inherit' would make psql.stdout null.
    // Return a string for consistency but ideally we should return the child process from this function
    // and let the caller decide what to do with stdin/stdout/stderr
    const stdoutPromise = psql.stdout ? this.consumeStream(psql.stdout) : Promise.resolve('')
    const cleanupSignalTraps = this.trapAndForwardSignalsToChildProcess(psql)

    try {
      pgDebug('waiting for psql or tunnel to exit')
      // wait for either psql or tunnel to exit;
      // the important bit is that we ensure both processes are
      // always cleaned up in the `finally` block below
      await Promise.race([
        this.waitForPSQLExit(psql),
        tunnel.waitForClose(),
      ])
    } catch (error) {
      pgDebug('wait for psql or tunnel error', error)
      throw error
    } finally {
      pgDebug('begin tunnel cleanup')
      cleanupSignalTraps()
      tunnel.close()
      this.kill(psql, 'SIGKILL')
      pgDebug('end tunnel cleanup')
    }

    return stdoutPromise as Promise<string>
  }

  /**
   * Spawns the psql process with the given options.
   *
   * @param options - The options for spawning the psql process
   * @returns The spawned child process
   */
  private spawnPsql(options: SpawnPsqlOptions) {
    const {childProcessOptions, dbEnv, psqlArgs} = options
    const spawnOptions = {
      env: dbEnv,
      ...childProcessOptions,
    }

    pgDebug('opening psql process')
    const psql = this.spawnFn('psql', psqlArgs, spawnOptions)
    psql.once('spawn', () => pgDebug('psql process spawned'))

    return psql
  }

  /**
   * Traps SIGINT so that ctrl+c can be used by psql without killing the parent node process.
   * You can use ctrl+c in psql to kill running queries while keeping the psql process open.
   * This code is to stop the parent node process (heroku CLI) from exiting.
   * If the parent Heroku CLI node process exits, then psql will exit as it is a child process.
   *
   * @param childProcess - The child process to forward signals to
   * @returns Function to restore the original signal handlers
   */
  private trapAndForwardSignalsToChildProcess(childProcess: ChildProcess) {
    const signalsToTrap: NodeJS.Signals[] = ['SIGINT']
    const signalTraps = signalsToTrap.map(signal => {
      process.removeAllListeners(signal)
      const listener = () => this.kill(childProcess, signal)
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

  /**
   * Waits for the psql process to exit and handles any errors.
   *
   * @param psql - The psql process event emitter
   * @throws Error if psql exits with non-zero code or if psql command is not found
   * @returns Promise that resolves to void when psql exits
   */
  private async waitForPSQLExit(psql: EventEmitter): Promise<void> {
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
        errorToThrow = new Error(
          'The local psql command could not be located. For help installing psql, see '
          + 'https://devcenter.heroku.com/articles/heroku-postgresql#local-setup',
        )
      }
    }

    if (errorToThrow) {
      throw errorToThrow
    }
  }
}
