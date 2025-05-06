import type {AddOnAttachment} from '@heroku-cli/schema'

import color from '@heroku-cli/color'
import {APIClient} from '@heroku-cli/command'
import {HerokuAPIError} from '@heroku-cli/command/lib/api-client'
import debug from 'debug'
import {env} from 'node:process'

import type {AddOnAttachmentWithConfigVarsAndPlan} from '../../types/pg/data-api'
import type {ConnectionDetails, ConnectionDetailsWithAttachment} from '../../types/pg/tunnel'

import {AmbiguousError} from '../../types/errors/ambiguous'
import {appAttachment} from '../addons/resolve'
import {bastionKeyPlan, fetchConfig, getBastion} from './bastion'
import {getConfig, getConfigVarName, getConfigVarNameFromAttachment} from './config-vars'

const pgDebug = debug('pg')

async function allAttachments(heroku: APIClient, appId: string): Promise<AddOnAttachmentWithConfigVarsAndPlan[]> {
  const {body: attachments} = await heroku.get<AddOnAttachmentWithConfigVarsAndPlan[]>(`/apps/${appId}/addon-attachments`, {
    headers: {'Accept-Inclusion': 'addon:plan,config_vars'},
  })
  return attachments.filter((a: AddOnAttachmentWithConfigVarsAndPlan) => a.addon.plan?.name?.startsWith('heroku-postgresql'))
}

export async function getAttachment(heroku: APIClient, app: string, db = 'DATABASE_URL', namespace = ''): Promise<Required<{addon: AddOnAttachmentWithConfigVarsAndPlan} & AddOnAttachment>> {
  const matchesOrError = await matchesHelper(heroku, app, db, namespace)
  let {matches} = matchesOrError
  const {error} = matchesOrError
  // happy path where the resolver matches just one
  if (matches && matches.length === 1) {
    return matches[0] as Required<{addon: AddOnAttachmentWithConfigVarsAndPlan} & AddOnAttachment>
  }

  // case for 404 where there are implicit attachments
  if (!matches) {
    const appConfigMatch = /^(.+?)::(.+)/.exec(db)
    if (appConfigMatch) {
      app = appConfigMatch[1]
      db = appConfigMatch[2]
    }

    if (!db.endsWith('_URL')) {
      db += '_URL'
    }

    const [config = {}, attachments] = await Promise.all([
      getConfig(heroku, app),
      allAttachments(heroku, app),
    ])

    if (attachments.length === 0) {
      throw new Error(`${color.app(app)} has no databases`)
    }

    matches = attachments.filter(attachment => config[db] && config[db] === config[getConfigVarName(attachment.config_vars as string[])])

    if (matches.length === 0) {
      const validOptions = attachments.map(attachment => getConfigVarName(attachment.config_vars as string[]))
      throw new Error(`Unknown database: ${db}. Valid options are: ${validOptions.join(', ')}`)
    }
  }

  // case for multiple attachments with passedDb
  const first = matches[0] as Required<{addon: AddOnAttachmentWithConfigVarsAndPlan} & AddOnAttachment>

  // case for 422 where there are ambiguous attachments that are equivalent
  if (matches.every(match => first.addon?.id === match.addon?.id && first.app?.id === match.app?.id)) {
    const config = await getConfig(heroku, first.app.name as string) ?? {}
    if (matches.every(match => config[getConfigVarName(first.addon.config_vars as string[])] === config[getConfigVarName(match.config_vars as string[])])) {
      return first
    }
  }

  throw error
}

export const getConnectionDetails = (attachment: Required<{
  addon: AddOnAttachmentWithConfigVarsAndPlan
} & AddOnAttachment>, configVars: Record<string, string> = {}): ConnectionDetailsWithAttachment => {
  const connStringVar = getConfigVarNameFromAttachment(attachment, configVars)

  // remove _URL from the end of the config var name
  const baseName = connStringVar.slice(0, -4)

  // build the default payload for non-bastion dbs
  pgDebug(`Using "${connStringVar}" to connect to your database…`)

  const conn = parsePostgresConnectionString(configVars[connStringVar])

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

  // If bastion creds exist, graft it into the payload
  const bastion = getBastion(configVars, baseName)
  if (bastion) {
    Object.assign(payload, bastion)
  }

  return payload
}

export async function getDatabase(heroku: APIClient, app: string, db?: string, namespace?: string) {
  const attached = await getAttachment(heroku, app, db, namespace)

  // would inline this as well but in some cases attachment pulls down config
  // as well, and we would request twice at the same time but I did not want
  // to push this down into attachment because we do not always need config
  const config = await getConfig(heroku, attached.app.name as string)

  const database = getConnectionDetails(attached, config)
  if (bastionKeyPlan(attached.addon) && !database.bastionKey) {
    const {body: bastionConfig} = await fetchConfig(heroku, attached.addon)
    const bastionHost = bastionConfig.host
    const bastionKey = bastionConfig.private_key

    Object.assign(database, {bastionHost, bastionKey})
  }

  return database
}

async function matchesHelper(heroku: APIClient, app: string, db: string, namespace?: string): Promise<{error?: AmbiguousError | HerokuAPIError, matches: AddOnAttachment[] | null}> {
  debug(`fetching ${db} on ${app}`)

  const addonService = process.env.HEROKU_POSTGRESQL_ADDON_NAME || 'heroku-postgresql'
  debug(`addon service: ${addonService}`)
  try {
    const attached = await appAttachment(heroku, app, db, {addon_service: addonService, namespace})
    return ({matches: [attached]})
  } catch (error) {
    if (error instanceof AmbiguousError && error.body?.id === 'multiple_matches' && error.matches) {
      return {error, matches: error.matches}
    }

    if (error instanceof HerokuAPIError && (error as HerokuAPIError).http.statusCode === 404 && (error as HerokuAPIError).body && (error as HerokuAPIError).body.id === 'not_found') {
      return {error, matches: null}
    }

    throw error
  }
}

export const parsePostgresConnectionString = (db: string): ConnectionDetails => {
  const dbPath = /:\/\//.test(db) ? db : `postgres:///${db}`
  const url = new URL(dbPath)
  const {hostname, password, pathname, port, username} = url

  return {
    database: pathname.charAt(0) === '/' ? pathname.slice(1) : pathname,
    host: hostname,
    password,
    pathname,
    port: port || env.PGPORT || (hostname && '5432'),
    url: dbPath,
    user: username,
  }
}
