
import type {APIClient} from '@heroku-cli/command'

import {ux} from '@oclif/core'
import debug from 'debug'
import * as EventEmitter from 'node:events'
import {promisify} from 'node:util'
import * as createTunnel from 'tunnel-ssh'

import {AddOnAttachmentWithConfigVarsAndPlan} from '../../types/pg/data-api'
import {ConnectionDetails} from '../../types/pg/tunnel'
import {TunnelConfig} from '../../types/pg/tunnel'
import host from './host'
const pgDebug = debug('pg')

export const bastionKeyPlan = (a: AddOnAttachmentWithConfigVarsAndPlan) => Boolean(/private/.test(a.addon.plan.name))

export const env = (db: ConnectionDetails) => {
  const baseEnv = {
    PGAPPNAME: 'psql non-interactive',
    PGSSLMODE: (!db.host || db.host === 'localhost') ? 'prefer' : 'require',
    ...process.env,
  }

  const mapping: Record<string, keyof Omit<typeof db, '_tunnel' | 'bastionHost' | 'bastionKey' | 'pathname' | 'url'>> = {
    PGDATABASE: 'database',
    PGHOST: 'host',
    PGPASSWORD: 'password',
    PGPORT: 'port',
    PGUSER: 'user',
  }
  for (const envVar of Object.keys(mapping)) {
    const val = db[mapping[envVar]]
    if (val) {
      baseEnv[envVar as keyof typeof baseEnv] = val as string
    }
  }

  return baseEnv
}

export async function fetchConfig(heroku:APIClient, db: {id: string}) {
  return heroku.get<{host: string, private_key:string}>(
    `/client/v11/databases/${encodeURIComponent(db.id)}/bastion`,
    {
      hostname: host(),
    },
  )
}

export const getBastion = function (config:Record<string, string>, baseName: string) {
  // If there are bastions, extract a host and a key
  // otherwise, return an empty Object

  // If there are bastions:
  // * there should be one *_BASTION_KEY
  // * pick one host from the comma-separated list in *_BASTIONS
  // We assert that _BASTIONS and _BASTION_KEY always exist together
  // If either is falsy, pretend neither exist

  const bastionKey = config[`${baseName}_BASTION_KEY`]
  const bastions = (config[`${baseName}_BASTIONS`] || '').split(',')
  const bastionHost = bastions[Math.floor(Math.random() * bastions.length)]
  return (bastionKey && bastionHost) ? {bastionHost, bastionKey} : {}
}

export function getConfigs(db: ConnectionDetails) {
  const dbEnv: NodeJS.ProcessEnv = env(db)
  const dbTunnelConfig = tunnelConfig(db)
  if (db.bastionKey) {
    Object.assign(dbEnv, {
      PGHOST: dbTunnelConfig.localHost,
      PGPORT: dbTunnelConfig.localPort,
    })
  }

  return {
    dbEnv,
    dbTunnelConfig,
  }
}

export async function sshTunnel(db: ConnectionDetails, dbTunnelConfig: TunnelConfig, timeout = 10_000) {
  if (!db.bastionKey) {
    return null
  }

  const timeoutInstance = new Timeout(timeout, 'Establishing a secure tunnel timed out')
  const createSSHTunnel = promisify(createTunnel)
  try {
    return await Promise.race([
      timeoutInstance.promise(),
      createSSHTunnel(dbTunnelConfig),
    ])
  } catch (error) {
    pgDebug(error)
    ux.error('Unable to establish a secure tunnel to your database.')
  } finally {
    timeoutInstance.cancel()
  }
}

export function tunnelConfig(db: ConnectionDetails): TunnelConfig {
  const localHost = '127.0.0.1'
  const localPort = Math.floor((Math.random() * (65_535 - 49_152)) + 49_152)
  return {
    dstHost: db.host || undefined,
    dstPort: (db.port && Number.parseInt(db.port as string, 10)) || undefined,
    host: db.bastionHost,
    localHost,
    localPort,
    privateKey: db.bastionKey,
    username: 'bastion',
  }
}

class Timeout {
  // eslint-disable-next-line unicorn/prefer-event-target
  private readonly events = new EventEmitter()
  private readonly message: string
  private readonly timeout: number
  private timer: NodeJS.Timeout | undefined

  constructor(timeout: number, message: string) {
    this.timeout = timeout
    this.message = message
  }

  cancel() {
    this.events.emit('cancelled')
  }

  async promise() {
    this.timer = setTimeout(() => {
      this.events.emit('error', new Error(this.message))
    }, this.timeout)

    try {
      await EventEmitter.once(this.events, 'cancelled')
    } finally {
      clearTimeout(this.timer)
    }
  }
}
