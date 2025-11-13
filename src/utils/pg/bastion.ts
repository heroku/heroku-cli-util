import type {APIClient} from '@heroku-cli/command'

import debug from 'debug'
import {EventEmitter} from 'node:events'
import {Server} from 'node:net'
import * as tunnelSsh from 'tunnel-ssh'

import {ExtendedAddonAttachment} from '../../types/pg/platform-api'
import {
  BastionConfig,
  BastionConfigResponse,
  ConnectionDetails,
  TunnelConfig,
} from '../../types/pg/tunnel'
import host from './host'

const pgDebug = debug('pg')

/**
 * Determines whether the attachment belongs to an add-on installed onto a non-shield Private Space.
 * If true, the bastion information needs to be fetched from the Data API.
 * For add-ons installed onto a Shield Private Space, the bastion information should be fetched from config vars.
 *
 * @param attachment - The add-on attachment to check
 * @returns True if the attachment belongs to a non-shield Private Space, false otherwise
 */
export function bastionKeyPlan(attachment: ExtendedAddonAttachment): boolean {
  return Boolean(/private/.test(attachment.addon.plan.name.split(':', 2)[1]))
}

/**
 * Fetches the bastion configuration from the Data API (only relevant for add-ons installed onto a
 * non-shield Private Space).
 * For add-ons installed onto a Shield Private Space, the bastion information is stored in the config vars.
 *
 * @param heroku - The Heroku API client
 * @param addon - The add-on information
 * @returns Promise that resolves to the bastion configuration
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
      bastionKey: bastionConfig.private_key,
    }
  }

  return {}
}

/**
 * Returns the bastion configuration from the config vars for add-ons installed onto Shield
 * Private Spaces.
 *
 * If there are bastions, extracts a host and a key from the config vars.
 * If there are no bastions, returns an empty Object.
 *
 * We assert that _BASTIONS and _BASTION_KEY always exist together.
 * If either is falsy, pretend neither exist.
 *
 * @param config - The configuration variables object
 * @param baseName - The base name for the configuration variables
 * @returns The bastion configuration object
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
 * Returns both the required environment variables to effect the psql command execution and the tunnel
 * configuration according to the database connection details.
 *
 * @param connectionDetails - The database connection details with attachment information
 * @returns Object containing database environment variables and tunnel configuration
 */
export function getPsqlConfigs(connectionDetails: ConnectionDetails) {
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
 * Returns the base environment variables for the database connection based on the connection details
 * only, without taking into account if a tunnel is required for connecting to the database through a bastion host.
 *
 * @param connectionDetails - The database connection details
 * @returns The base environment variables for the database connection
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

/**
 * Creates a tunnel configuration object based on the connection details.
 *
 * @param connectionDetails - The database connection details with attachment information
 * @returns The tunnel configuration object
 */
function tunnelConfig(connectionDetails: ConnectionDetails): TunnelConfig {
  const localHost = '127.0.0.1'
  const localPort = Math.floor((Math.random() * (65_535 - 49_152)) + 49_152)
  return {
    dstHost: connectionDetails.host,
    dstPort: Number.parseInt(connectionDetails.port, 10),
    host: connectionDetails.bastionHost,
    localHost,
    localPort,
    privateKey: connectionDetails.bastionKey,
    username: 'bastion',
  }
}

/**
 * Establishes an SSH tunnel to the database using the provided configuration.
 *
 * @param connectionDetails - The database connection details with attachment information
 * @param dbTunnelConfig - The tunnel configuration object
 * @param timeout - The timeout in milliseconds (default: 10000)
 * @param createSSHTunnel - The function to create the SSH tunnel
 * @returns Promise that resolves to the tunnel server or null if no bastion key is provided
 * @throws Error if unable to establish the tunnel
 */
export async function sshTunnel(
  connectionDetails: ConnectionDetails,
  dbTunnelConfig: TunnelConfig,
  timeout = 10_000,
  createSSHTunnel = createSSHTunnelAdapter,
): Promise<Server | void> {
  if (!connectionDetails.bastionKey) {
    return
  }

  const timeoutInstance = new Timeout(timeout, 'Establishing a secure tunnel timed out')
  try {
    return await Promise.race([
      timeoutInstance.promise(),
      createSSHTunnel(dbTunnelConfig),
    ])
  } catch (error: unknown) {
    pgDebug(error)
    throw new Error(
      `Unable to establish a secure tunnel to your database: ${(error as Error).message}.`,
    )
  } finally {
    timeoutInstance.cancel()
  }
}

/**
 * A timeout utility class that can be cancelled.
 */
class Timeout {
  // eslint-disable-next-line unicorn/prefer-event-target
  private readonly events = new EventEmitter()
  private readonly message: string
  private readonly timeout: number
  private timer: NodeJS.Timeout | undefined

  /**
   * Creates a new Timeout instance.
   *
   * @param timeout - The timeout duration in milliseconds
   * @param message - The error message to display when timeout occurs
   */
  constructor(timeout: number, message: string) {
    this.timeout = timeout
    this.message = message
  }

  /**
   * Cancels the timeout.
   *
   * @returns void
   */
  cancel(): void {
    this.events.emit('cancelled')
  }

  /**
   * Returns a promise that resolves when the timeout is cancelled or rejects when the timeout occurs.
   *
   * @returns Promise that resolves to void when cancelled or rejects with an error when timeout occurs
   */
  async promise(): Promise<void> | never {
    this.timer = setTimeout(() => this.events.emit('timeout'), this.timeout)

    try {
      await new Promise<void>((resolve, reject) => {
        this.events.once('cancelled', () => resolve())
        this.events.once('timeout', () => reject(new Error(this.message)))
      })
    } finally {
      clearTimeout(this.timer)
    }
  }
}

/**
 * Adapter for tunnel-ssh v5 API. Translates our TunnelConfig into the v5
 * createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions) call
 * and returns the created local Server.
 *
 * @param config - The tunnel configuration to translate for v5 API
 * @returns Promise that resolves to the created local TCP Server
 */
async function createSSHTunnelAdapter(config: TunnelConfig): Promise<Server> {
  const tunnelOptions = {
    autoClose: true,
    reconnectOnError: false,
  }

  const serverOptions = {
    host: config.localHost,
    port: config.localPort,
  }

  const sshOptions = {
    host: config.host,
    privateKey: config.privateKey,
    username: config.username,
  }

  const forwardOptions = {
    dstAddr: config.dstHost,
    dstPort: config.dstPort,
    srcAddr: config.localHost,
    srcPort: config.localPort,
  }

  const [server] = await tunnelSsh.createTunnel(
    tunnelOptions,
    serverOptions,
    sshOptions,
    forwardOptions,
  )
  return server
}
