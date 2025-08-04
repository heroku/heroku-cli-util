import type {APIClient} from '@heroku-cli/command'
import {ux} from '@oclif/core'
import debug from 'debug'
import * as EventEmitter from 'node:events'
import {promisify} from 'node:util'
import * as createTunnel from 'tunnel-ssh'

import {ExtendedAddonAttachment} from '../../types/pg/data-api.js'
import {BastionConfig, BastionConfigResponse, ConnectionDetails, ConnectionDetailsWithAttachment, TunnelConfig} from '../../types/pg/tunnel.js'
import host from './host.js'

const pgDebug = debug('pg')

/**
 * This function returns whether the attachment belongs to an add-on installed onto a non-shield Private Space or not.
 * If true, the bastion information needs to be fetched from the Data API.
 * For add-ons installed onto a Shield Private Space, the bastion information should be fetched from config vars.
 */
export function bastionKeyPlan(attachment: ExtendedAddonAttachment): boolean {
  return Boolean(/private/.test(attachment.addon.plan.name.split(':', 2)[1]))
}

/**
 * Fetches the bastion configuration from the Data API (only relevant for add-ons installed onto a
 * non-shield Private Space).
 * For add-ons installed onto a Shield Private Space, the bastion information is stored in the config vars.
 */
export async function fetchBastionConfig(
  heroku: APIClient,
  addon: ExtendedAddonAttachment['addon'],
): Promise<BastionConfig> {
  const {body: bastionConfig} = await heroku.get<BastionConfigResponse>(
    `/client/v11/databases/${encodeURIComponent(addon.id)}/bastion`,
    {hostname: host()},
  )

  if (bastionConfig.host && bastionConfig.private_key) {
    return {
      bastionHost: bastionConfig.host,
      bastionKey: bastionConfig.private_key
    }
  }

  return {}
}

/**
 * This function returns the bastion configuration from the config vars for add-ons installed onto Shield
 * Private Spaces.
 *
 * If there are bastions, extracts a host and a key from the config vars.
 * If there are no bastions, returns an empty Object.
 *
 * We assert that _BASTIONS and _BASTION_KEY always exist together.
 * If either is falsy, pretend neither exist.
 */
export const getBastionConfig = function (config: Record<string, string>, baseName: string): BastionConfig {
  // <BASE_NAME>_BASTION_KEY contains the private key for the bastion.
  const bastionKey = config[`${baseName}_BASTION_KEY`]

  // <BASE_NAME>_BASTIONS contains a comma-separated list of hosts, select one at random.
  const bastions = (config[`${baseName}_BASTIONS`] || '').split(',')
  const bastionHost = bastions[Math.floor(Math.random() * bastions.length)]

  if (bastionKey && bastionHost) {
    return {bastionHost, bastionKey}
  }

  return {}
}

/**
 * This function returns both the required environment variables to effect the psql command execution and the tunnel
 * configuration according to the database connection details.
 */
export function getPsqlConfigs(connectionDetails: ConnectionDetailsWithAttachment) {
  const dbEnv: NodeJS.ProcessEnv = baseEnv(connectionDetails)
  const dbTunnelConfig = tunnelConfig(connectionDetails)

  // If a tunnel is required, we need to adjust the environment variables for psql to use the tunnel host and port.
  if (connectionDetails.bastionKey) {
    Object.assign(dbEnv, {
      PGHOST: dbTunnelConfig.localHost!,
      PGPORT: dbTunnelConfig.localPort!.toString(),
    })
  }

  return {
    dbEnv,
    dbTunnelConfig,
  }
}

export type PsqlConfigs = ReturnType<typeof getPsqlConfigs>

/**
 * This function returns the base environment variables for the database connection based on the connection details
 * only, without taking into account if a tunnel is required for connecting to the database through a bastion host.
 */
function baseEnv(connectionDetails: ConnectionDetails): NodeJS.ProcessEnv {
  // Mapping of environment variables to ConnectionDetails properties
  const mapping: Record<string, keyof ConnectionDetails> = {
    PGDATABASE: 'database',
    PGHOST: 'host',
    PGPASSWORD: 'password',
    PGPORT: 'port',
    PGUSER: 'user',
  }

  const baseEnv = {
    PGAPPNAME: 'psql non-interactive',
    PGSSLMODE: (
      !connectionDetails.host || connectionDetails.host === 'localhost'
    ) ? 'prefer' : 'require',
    ...process.env,
  }

  for (const envVar of Object.keys(mapping)) {
    const val = connectionDetails[mapping[envVar]]
    if (val) {
      baseEnv[envVar as keyof typeof baseEnv] = val as string
    }
  }

  return baseEnv
}

function tunnelConfig(connectionDetails: ConnectionDetailsWithAttachment): TunnelConfig {
  const localHost = '127.0.0.1'
  const localPort = Math.floor((Math.random() * (65_535 - 49_152)) + 49_152)
  return {
    dstHost: connectionDetails.host || undefined,
    dstPort: (connectionDetails.port && Number.parseInt(connectionDetails.port, 10)) || undefined,
    host: connectionDetails.bastionHost,
    localHost,
    localPort,
    privateKey: connectionDetails.bastionKey,
    username: 'bastion',
  }
}

export async function sshTunnel(connectionDetails: ConnectionDetailsWithAttachment, dbTunnelConfig: TunnelConfig, timeout = 10_000) {
  if (!connectionDetails.bastionKey) {
    return null
  }

  const timeoutInstance = new Timeout(timeout, 'Establishing a secure tunnel timed out')
  const createSSHTunnel = promisify(createTunnel.default)
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

class Timeout {
  private readonly events = new EventEmitter.EventEmitter()
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
      await new Promise<null>(resolve => {
        this.events.once('cancelled', () => resolve(null))
      })
    } finally {
      clearTimeout(this.timer)
      return null
    }
  }
}
