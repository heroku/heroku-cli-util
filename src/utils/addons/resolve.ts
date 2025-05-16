import type {APIClient} from '@heroku-cli/command'
import type {AddOnAttachment} from '@heroku-cli/schema'

import type {AddOnAttachmentWithConfigVarsAndPlan} from '../../types/pg/data-api.js'

import {AmbiguousError} from '../../types/errors/ambiguous.js'
import {NotFound} from '../../types/errors/not-found.js'

export const appAttachment = async (heroku: APIClient, app: string | undefined, id: string, options: {
  addon_service?: string,
  namespace?: string
} = {}): Promise<{ addon: AddOnAttachmentWithConfigVarsAndPlan } & AddOnAttachment> => {
  const result = await heroku.post<({
    addon: AddOnAttachmentWithConfigVarsAndPlan
  } & AddOnAttachment)[]>('/actions/addon-attachments/resolve', {
      // eslint-disable-next-line camelcase
      body: {addon_attachment: id, addon_service: options.addon_service, app}, headers: attachmentHeaders,
    })
  return singularize('addon_attachment', options.namespace)(result.body)
}

const attachmentHeaders: Readonly<{ Accept: string, 'Accept-Inclusion': string }> = {
  Accept: 'application/vnd.heroku+json; version=3.sdk',
  'Accept-Inclusion': 'addon:plan,config_vars',
}

function singularize(type?: null | string, namespace?: null | string) {
  return <T extends { name?: string, namespace?: null | string }>(matches: T[]): T => {
    if (namespace) {
      matches = matches.filter(m => m.namespace === namespace)
    } else if (matches.length > 1) {
      // In cases that aren't specific enough, filter by namespace
      matches = matches.filter(m => !Reflect.has(m, 'namespace') || m.namespace === null)
    }

    switch (matches.length) {
    case 0: {
      throw new NotFound()
    }

    case 1: {
      return matches[0]
    }

    default: {
      throw new AmbiguousError(matches, type ?? '')
    }
    }
  }
}
