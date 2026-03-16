import type {APIClient} from '@heroku-cli/command'

import type {ExtendedAddon} from '../../types/pg/platform-api.js'

import {AmbiguousError} from '../../errors/ambiguous.js'
import {NotFound} from '../../errors/not-found.js'

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
    let addons: ExtendedAddon[] = []
    const [appPart, addonPart] = addon.match(/^(.+)::(.+)$/)?.slice(1) ?? [app, addon];

    ({body: addons} = await this.heroku.post<ExtendedAddon[]>('/actions/addons/resolve', {
      body: {
        addon: addonPart,
        // We would pass the add-on service slug here for Platform API to filter the add-ons by
        // add-on service, but the resolvers won't allow alpha add-ons to be found.
        // addon_service: addonService,
        app: appPart,
      },
      headers: this.addonHeaders,
    }))

    // We implement the add-on service filtering logic here if the parameter is provided.
    if (addonService) {
      addons = addons.filter(addon => addon.addon_service.name === addonService)
    }

    if (addons.length === 0) {
      throw new NotFound()
    }

    if (addons.length === 1) {
      return addons[0]
    }

    throw new AmbiguousError(addons, 'addon')
  }
}
