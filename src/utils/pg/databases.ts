import {color} from '@heroku-cli/color'
import {APIClient} from '@heroku-cli/command'
import {HerokuAPIError} from '@heroku-cli/command/lib/api-client'
import debug from 'debug'

import type {ExtendedAddon, ExtendedAddonAttachment} from '../../types/pg/platform-api'
import type {ConnectionDetails, ConnectionDetailsWithAttachment} from '../../types/pg/tunnel'

import {AmbiguousError} from '../../errors/ambiguous'
import AddonAttachmentResolver from '../addons/attachment-resolver'
import {getAddonService, isLegacyDatabase} from '../addons/helpers'
import {bastionKeyPlan, fetchBastionConfig, getBastionConfig} from './bastion'
import {getConfig, getConfigVarName, getConfigVarNameFromAttachment} from './config-vars'

const pgDebug = debug('pg')

export default class DatabaseResolver {
  private readonly addonAttachmentResolver: AddonAttachmentResolver
  private readonly addonHeaders: Readonly<{ Accept: string, 'Accept-Expansion': string }> = {
    Accept: 'application/vnd.heroku+json; version=3.sdk',
    'Accept-Expansion': 'addon_service,plan',
  }

  private readonly attachmentHeaders: Readonly<{ Accept: string, 'Accept-Inclusion': string }> = {
    Accept: 'application/vnd.heroku+json; version=3.sdk',
    'Accept-Inclusion': 'addon:plan,config_vars',
  }

  constructor(
    private readonly heroku: APIClient,
    private readonly getConfigFn = getConfig,
    private readonly fetchBastionConfigFn = fetchBastionConfig,
  ) {
    this.addonAttachmentResolver = new AddonAttachmentResolver(this.heroku)
  }

  /**
   * Parses a PostgreSQL connection string (or a local database name) into a ConnectionDetails object.
   *
   * @param connStringOrDbName - PostgreSQL connection string or local database name
   * @returns Connection details object with parsed connection information
   */
  public static parsePostgresConnectionString(connStringOrDbName: string): ConnectionDetails {
    const dbPath = /:\/\//.test(connStringOrDbName) ? connStringOrDbName : `postgres:///${connStringOrDbName}`
    const url = new URL(dbPath)
    const {hostname, password, pathname, port, username} = url

    return {
      database: pathname.slice(1), // remove the leading slash from the pathname
      host: hostname,
      password,
      pathname,
      port: port || process.env.PGPORT || (hostname && '5432'),
      url: dbPath,
      user: username,
    }
  }

  /**
   * Return all Heroku Postgres databases on the Legacy tiers for a given app.
   *
   * @param app - The name of the app to get the databases for
   * @returns Promise resolving to all Heroku Postgres databases
   * @throws {Error} When no legacy database add-on exists on the app
   */
  public async getAllLegacyDatabases(app: string): Promise<Array<{attachment_names?: string[]} & ExtendedAddonAttachment['addon']>> {
    pgDebug(`fetching all legacy databases on ${app}`)
    const allAttachments = await this.allLegacyDatabaseAttachments(app)
    const addons: Array<{attachment_names?: string[]} & ExtendedAddonAttachment['addon']> = []
    for (const attachment of allAttachments) {
      if (!addons.some(a => a.id === attachment.addon.id)) {
        addons.push(attachment.addon)
      }
    }

    const attachmentNamesByAddon = this.getAttachmentNamesByAddon(allAttachments)
    for (const addon of addons) {
      // eslint-disable-next-line camelcase
      addon.attachment_names = attachmentNamesByAddon[addon.id]
    }

    return addons
  }

  /**
   * Resolves an arbitrary legacy database add-on based on the provided app name.
   *
   * @param app - The name of the app to get the arbitrary legacy database for
   * @returns Promise resolving to the arbitrary legacy database add-on
   * @throws {Error} When no legacy database add-on exists on the app
   */
  public async getArbitraryLegacyDB(app: string) {
    pgDebug(`fetching arbitrary legacy database on ${app}`)
    const {body: addons} = await this.heroku.get<ExtendedAddon[]>(
      `/apps/${app}/addons`,
      {headers: this.addonHeaders},
    )
    const addon = addons.find(a => a.app.name === app && isLegacyDatabase(a))
    if (!addon) throw new Error(`No Heroku Postgres legacy database on ${app}`)
    return addon
  }

  /**
   * Resolves a database attachment based on the provided database identifier
   * (attachment name, id, or config var name) and namespace (credential).
   *
   * @param appId - The ID of the app to get the attachment for
   * @param attachmentId - The database identifier (defaults to 'DATABASE_URL')
   * @param namespace - Optional namespace/credential for the attachment
   * @returns Promise resolving to the database attachment
   * @throws {Error} When no databases exist or when database identifier is unknown
   * @throws {AmbiguousError} When multiple matching attachments are found
   */
  public async getAttachment(
    appId: string,
    attachmentId = 'DATABASE_URL',
    namespace?: string,
  ): Promise<ExtendedAddonAttachment> {
    // handle the case where the user passes an app::database format, overriding any app name option values.
    const appConfigMatch = /^(.+?)::(.+)/.exec(attachmentId)
    if (appConfigMatch) {
      appId = appConfigMatch[1]
      attachmentId = appConfigMatch[2]
    }

    const {error, matches} = await this.matchesHelper(appId, attachmentId, namespace)

    // happy path where the resolver matches just one
    if (matches && matches.length === 1) {
      return matches[0]
    }

    // handle the case where the resolver didn't find any matches for the given database and show valid options.
    if (!matches) {
      const attachments = await this.allPostgresAttachments(appId)
      if (attachments.length === 0) {
        throw new Error(`${color.app(appId)} has no databases`)
      } else {
        const validOptions = attachments.map(attachment => getConfigVarName(attachment.config_vars))
        throw new Error(`Unknown database: ${attachmentId}. Valid options are: ${validOptions.join(', ')}`)
      }
    }

    // handle the case where the resolver found multiple matches for the given database.
    const first = matches[0]

    // return the first attachment when all ambiguous attachments are equivalent (basically target the same database)
    if (matches.every(match => first.addon.id === match.addon.id && first.app.id === match.app.id)) {
      const config = await this.getConfigFn(this.heroku, first.app.name)
      if (matches.every(
        match => config[getConfigVarName(first.config_vars)] === config[getConfigVarName(match.config_vars)],
      )) {
        return first
      }
    }

    throw error
  }

  /**
   * Returns the connection details for a database attachment according to the app config vars.
   *
   * @param attachment - The attachment to get the connection details for
   * @param config - The record of app config vars with their values
   * @returns Connection details with attachment information
   */
  public getConnectionDetails(
    attachment: ExtendedAddonAttachment,
    config: Record<string, string> = {},
  ): ConnectionDetailsWithAttachment {
    const connStringVar = getConfigVarNameFromAttachment(attachment, config)

    // build the default payload for non-bastion dbs
    pgDebug(`Using "${connStringVar}" to connect to your database…`)

    const conn = DatabaseResolver.parsePostgresConnectionString(config[connStringVar])

    const payload: ConnectionDetailsWithAttachment = {
      attachment,
      database: conn.database,
      host: conn.host,
      password: conn.password,
      pathname: conn.pathname,
      port: conn.port,
      url: conn.url,
      user: conn.user,
    }

    // This handles injection of bastion creds into the payload if they exist as config vars (Shield-tier databases).
    const baseName = connStringVar.slice(0, -4)
    const bastion = getBastionConfig(config, baseName)
    if (bastion) {
      Object.assign(payload, bastion)
    }

    return payload
  }

  /**
   * Returns the connection details for a database attachment resolved through the identifiers passed as
   * arguments: appId, attachmentId and namespace (credential).
   *
   * @param appId - The ID of the app containing the database
   * @param attachmentId - Optional database identifier (defaults to 'DATABASE_URL')
   * @param namespace - Optional namespace/credential for the attachment
   * @returns Promise resolving to connection details with attachment information
   */
  public async getDatabase(
    appId: string,
    attachmentId?: string,
    namespace?: string,
  ): Promise<ConnectionDetailsWithAttachment> {
    const attached = await this.getAttachment(appId, attachmentId, namespace)
    const config = await this.getConfigFn(this.heroku, attached.app.name)
    const database = this.getConnectionDetails(attached, config)

    // Add bastion configuration if it's a non-shielded Private Space add-on and we still don't have the config.
    if (bastionKeyPlan(attached) && !database.bastionKey) {
      const bastionConfig = await this.fetchBastionConfigFn(this.heroku, attached.addon)
      Object.assign(database, bastionConfig)
    }

    return database
  }

  /**
   * Helper function that attempts to find all Heroku Postgres attachments on a given app.
   *
   * @param app - The name of the app to get the attachments for
   * @returns Promise resolving to an array of all Heroku Postgres attachments on the app
   */
  private async allLegacyDatabaseAttachments(app: string) {
    const {body: attachments} = await this.heroku.get<ExtendedAddonAttachment[]>(
      `/apps/${app}/addon-attachments`,
      {headers: this.attachmentHeaders},
    )
    return attachments.filter(a => isLegacyDatabase(a.addon))
  }

  /**
   * Fetches all Heroku PostgreSQL add-on attachments for a given app.
   *
   * This is used internally by the `getAttachment` function to get all valid Heroku PostgreSQL add-on attachments
   * to generate a list of possible valid attachments when the user passes a database name that doesn't match any
   * attachments.
   *
   * @param appId - The ID of the app to get the attachments for
   * @returns Promise resolving to array of PostgreSQL add-on attachments
   */
  private async allPostgresAttachments(appId: string): Promise<ExtendedAddonAttachment[]> {
    const {body: attachments} = await this.heroku.get<ExtendedAddonAttachment[]>(`/apps/${appId}/addon-attachments`, {
      headers: this.attachmentHeaders,
    })
    return attachments.filter(a => a.addon.plan.name.split(':', 2)[0] === getAddonService())
  }

  /**
   * Helper function that groups Heroku Postgres attachments by addon.
   *
   * @param attachments - The attachments to group by addon
   * @returns A record of addon IDs with their attachment names
   */
  private getAttachmentNamesByAddon(attachments: ExtendedAddonAttachment[]): Record<string, string[]> {
    const addons: Record<string, string[]> = {}
    for (const attachment of attachments) {
      addons[attachment.addon.id] = [...(addons[attachment.addon.id] || []), attachment.name]
    }

    return addons
  }

  /**
   * Helper function that attempts to find a single addon attachment matching the given database identifier
   * (attachment name, id, or config var name).
   *
   * This is used internally by the `getAttachment` function to handle the lookup of addon attachments.
   * It returns either a single match, multiple matches (for ambiguous cases), or null if no matches are found.
   *
   * The AddonAttachmentResolver uses the Platform API add-on attachment resolver endpoint to get the attachment.
   *
   * @param appId - The ID of the app to search for attachments
   * @param attachmentId - The database identifier to match
   * @param namespace - Optional namespace/credential filter
   * @returns Promise resolving to either a single match, multiple matches with error, or no matches with error
   */
  private async matchesHelper(appId: string, attachmentId: string, namespace?: string): Promise<
    {error: AmbiguousError, matches: ExtendedAddonAttachment[]} |
    {error: HerokuAPIError, matches: null} |
    {error: undefined, matches: ExtendedAddonAttachment[]}
  > {
    debug(`fetching ${attachmentId} on ${appId}`)

    const addonService = getAddonService()
    debug(`addon service: ${addonService}`)

    try {
      const attached = await this.addonAttachmentResolver.resolve(appId, attachmentId, {addonService, namespace})
      return {error: undefined, matches: [attached]}
    } catch (error: unknown) {
      if (error instanceof AmbiguousError && error.body.id === 'multiple_matches' && error.matches) {
        return {error, matches: error.matches as ExtendedAddonAttachment[]}
      }

      // This handles the case where the resolver returns a 404 error when making the request, but not the case
      // where it returns a NotFound error because there were no matches after filtering by namespace.
      if (
        error instanceof HerokuAPIError
        && error.http.statusCode === 404
        && error.body && error.body.id === 'not_found'
      ) {
        return {error, matches: null}
      }

      // This re-throws a NotFound error or any other HerokuAPIError except for the 404 case which is handled above.
      throw error
    }
  }
}
