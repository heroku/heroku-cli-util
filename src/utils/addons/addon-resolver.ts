/* eslint-disable camelcase */
import type {APIClient} from '@heroku-cli/command'

import type {ExtendedAddon} from '../../types/pg/platform-api.js'

import {AmbiguousError} from '../../errors/ambiguous.js'

export default class AddonResolver {
  private readonly addonHeaders: Readonly<{Accept: string; 'Accept-Expansion': string}> = {
    Accept: 'application/vnd.heroku+json; version=3.sdk',
    'Accept-Expansion': 'addon_service,plan',
  }

  constructor(private readonly heroku: APIClient) {}

  public async resolve(
    addon: string,
    app?: string,
    addonService?: string,
  ): Promise<ExtendedAddon>  {
    const [appPart, addonPart] = addon.match(/^(.+)::(.+)$/)?.slice(1) ?? [app, addon]
    const {body: addons} = await this.heroku.post<ExtendedAddon[]>('/actions/addons/resolve', {
      body: {
        addon: addonPart,
        addon_service: addonService,
        app: appPart,
      },
      headers: this.addonHeaders,
    })

    if (addons.length === 1) {
      return addons[0]
    }

    throw new AmbiguousError(addons, 'addon')
  }
}
