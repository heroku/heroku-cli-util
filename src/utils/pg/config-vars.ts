import type {HTTP} from '@heroku/http-call'
import type {APIClient} from '@heroku-cli/command'
import type {AddOnAttachment} from '@heroku-cli/schema'

// import color from '@heroku-cli/color'
// import {ux} from '@oclif/core'

import type {AddOnAttachmentWithConfigVarsAndPlan} from '../../types/pg/data-api'

const responseByAppId: Map<string, Promise<HTTP<Record<string, string>>>> = new Map()

export async function getConfig(heroku: APIClient, app: string): Promise<Record<string, string> | undefined> {
  if (!responseByAppId.has(app)) {
    const promise = heroku.get<Record<string, string>>(`/apps/${app}/config-vars`)
    responseByAppId.set(app, promise)
  }

  const result = await responseByAppId.get(app)
  return result?.body
}

export function getConfigVarName(configVars: string[]): string {
  const connStringVars = configVars.filter(cv => (cv.endsWith('_URL')))
  if (connStringVars.length === 0) throw new Error('Database URL not found for this addon')
  return connStringVars[0]
}

export function getConfigVarNameFromAttachment(attachment: Required<{
  addon: AddOnAttachmentWithConfigVarsAndPlan
} & AddOnAttachment>, config: Record<string, string> = {}): string {
  const configVars = attachment.addon.config_vars?.filter((cv: string) => config[cv]?.startsWith('postgres://')) ?? []
  if (configVars.length === 0) {
    // ux.error(`No config vars found for ${attachment.name}; perhaps they were removed as a side effect of ${color.cmd('heroku rollback')}? Use ${color.cmd('heroku addons:attach')} to create a new attachment and then ${color.cmd('heroku addons:detach')} to remove the current attachment.`)
  }

  const configVarName = `${attachment.name}_URL`
  if (configVars.includes(configVarName) && configVarName in config) {
    return configVarName
  }

  return getConfigVarName(configVars)
}
