import type {HTTP} from '@heroku/http-call'
import type {APIClient} from '@heroku-cli/command'

import {color} from '@heroku-cli/color'

import type {ExtendedAddonAttachment} from '../../types/pg/data-api.js'

/*
 * Cache of app config vars.
 */
export const configVarsByAppIdCache: Map<string, Promise<HTTP<Record<string, string>>>> = new Map()

/*
 * Returns the app's config vars as a record of key-value pairs, either from the cache or from the API.
 */
export async function getConfig(heroku: APIClient, appId: string): Promise<Record<string, string>> {
  let promise = configVarsByAppIdCache.get(appId)

  if (!promise) {
    promise = heroku.get<Record<string, string>>(`/apps/${appId}/config-vars`)
    configVarsByAppIdCache.set(appId, promise)
  }

  const {body: config} = await promise
  return config
}

/**
 * Returns the attachment's first config var name that has a `_URL` suffix, expected to be the name of the one
 * that contains the database URL connection string.
 */
export function getConfigVarName(configVarNames: ExtendedAddonAttachment['config_vars']): string {
  const urlConfigVarNames = configVarNames.filter(cv => (cv.endsWith('_URL')))
  if (urlConfigVarNames.length === 0) throw new Error('Database URL not found for this addon')
  return urlConfigVarNames[0]
}

/**
 * This function returns the config var name that contains the database URL connection string for the given
 * attachment, based on the contents of the app's config vars.
 */
export function getConfigVarNameFromAttachment(
  attachment: ExtendedAddonAttachment,
  config: Record<string, string> = {},
): string {
  // Handle the case where no attachment config var names remain after filtering out those that don't contain a
  // database URL connection string in the app's config vars.
  const connStringConfigVarNames = attachment.config_vars
    .filter(cvn => config[cvn]?.startsWith('postgres://'))

  if (connStringConfigVarNames.length === 0) {
    throw new Error(
      `No config vars found for ${attachment.name}; perhaps they were removed as a side effect of` +
      `${color.cmd('heroku rollback')}? Use ${color.cmd('heroku addons:attach')} to create a new attachment and ` +
      `then ${color.cmd('heroku addons:detach')} to remove the current attachment.`
    )
  }

  // Generate the default config var name and return it if it contains a database URL connection string.
  const configVarName = `${attachment.name}_URL`
  if (connStringConfigVarNames.includes(configVarName) && configVarName in config) {
    return configVarName
  }

  // Return the first config var name that has a `_URL` suffix. This might not be needed at all anymore.
  return getConfigVarName(connStringConfigVarNames)
}
