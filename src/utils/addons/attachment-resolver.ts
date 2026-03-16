import type {APIClient} from '@heroku-cli/command'

import type {ExtendedAddonAttachment} from '../../types/pg/platform-api.js'

import {AmbiguousError} from '../../errors/ambiguous.js'
import {NotFound} from '../../errors/not-found.js'

export interface AddonAttachmentResolverOptions {
  addonService?: string
  namespace?: string
}
export default class AddonAttachmentResolver {
  private readonly attachmentHeaders: Readonly<{Accept: string, 'Accept-Inclusion': string}> = {
    Accept: 'application/vnd.heroku+json; version=3.sdk',
    'Accept-Inclusion': 'addon:plan,config_vars',
  }

  constructor(private readonly heroku: APIClient) {}

  async resolve(
    appId: string | undefined,
    attachmentId: string,
    options: AddonAttachmentResolverOptions = {},
  ): Promise<ExtendedAddonAttachment>  {
    const {addonService, namespace} = options
    let attachments: ExtendedAddonAttachment[] = [];

    /* eslint-disable camelcase */
    ({body: attachments} = await this.heroku.post<ExtendedAddonAttachment[]>('/actions/addon-attachments/resolve', {
      body: {
        addon_attachment: attachmentId,
        // We would pass the add-on service slug here for Platform API to filter the attachments by
        // add-on service, but the resolvers won't allow alpha add-ons to be found.
        // addon_service: addonService,
        app: appId,
      },
      headers: this.attachmentHeaders,
    }))
    /* eslint-enable camelcase */

    // We implement the add-on service filtering logic here if the parameter is provided.
    if (addonService) {
      attachments = attachments.filter(attachment => attachment.addon.plan.name.split(':', 2)[0] === addonService)
    }

    return this.singularize(attachments, namespace)
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
