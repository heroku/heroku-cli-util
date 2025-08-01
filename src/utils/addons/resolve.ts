import type {APIClient} from '@heroku-cli/command'

import type {ExtendedAddonAttachment} from '../../types/pg/data-api.js'

import {AmbiguousError} from '../../types/errors/ambiguous.js'
import {NotFound} from '../../types/errors/not-found.js'

export interface AppAttachmentResolverOptions {
  addon_service?: string
  namespace?: string
}
export default class AppAttachmentResolver {
  constructor(private readonly heroku: APIClient) {}

  private readonly attachmentHeaders: Readonly<{ Accept: string, 'Accept-Inclusion': string }> = {
    Accept: 'application/vnd.heroku+json; version=3.sdk',
    'Accept-Inclusion': 'addon:plan,config_vars',
  }

  async resolve(
    app: string | undefined,
    id: string,
    options: AppAttachmentResolverOptions = {}
  ): Promise<ExtendedAddonAttachment>  {
    const {body: attachments} = await this.heroku.post<ExtendedAddonAttachment[]>('/actions/addon-attachments/resolve', {
      // eslint-disable-next-line camelcase
      body: {addon_attachment: id, addon_service: options.addon_service, app}, headers: this.attachmentHeaders,
    })
    return this.singularize(attachments, options.namespace)
  }

  private singularize(attachments: ExtendedAddonAttachment[], namespace?: null | string) {
    let matches: ExtendedAddonAttachment[]

    if (namespace) {
      matches = attachments.filter(m => m.namespace === namespace)
    } else if (attachments.length > 1) {
      // In cases that aren't specific enough, keep only attachments without a namespace
      matches = attachments.filter(m => !Reflect.has(m, 'namespace') || m.namespace === null)
    } else {
      matches = attachments
    }

    switch (matches.length) {
      case 0: {
        throw new NotFound()
      }

      case 1: {
        return matches[0]
      }

      default: {
        throw new AmbiguousError(matches, 'addon_attachment')
      }
    }
  }  
}
