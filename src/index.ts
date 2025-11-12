import type * as DataApiTypes from './types/pg/platform-api.js'
import type * as TunnelTypes from './types/pg/tunnel.js'

import {AmbiguousError} from './errors/ambiguous.js'
import {NotFound} from './errors/not-found.js'
import AddonResolver from './utils/addons/addon-resolver.js'
import {
  getAddonService,
  isAdvancedDatabase,
  isAdvancedPrivateDatabase,
  isEssentialDatabase,
  isLegacyDatabase,
  isLegacyEssentialDatabase,
  isPostgresAddon,
} from './utils/addons/helpers.js'
import {getPsqlConfigs, sshTunnel} from './utils/pg/bastion.js'
import {getConfigVarNameFromAttachment} from './utils/pg/config-vars.js'
import DatabaseResolver from './utils/pg/databases.js'
import getHost from './utils/pg/host.js'
import PsqlService from './utils/pg/psql.js'
import {confirm} from './ux/confirm.js'
import {prompt} from './ux/prompt.js'
import {styledHeader} from './ux/styled-header.js'
import {styledJSON} from './ux/styled-json.js'
import {styledObject} from './ux/styled-object.js'
import {table} from './ux/table.js'
import {wait} from './ux/wait.js'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace pg {
  export type AddOnWithRelatedData = DataApiTypes.AddOnWithRelatedData
  export type ExtendedAddon = DataApiTypes.ExtendedAddon
  export type ExtendedAddonAttachment = DataApiTypes.ExtendedAddonAttachment
  export type Link = DataApiTypes.Link
  export type ConnectionDetails = TunnelTypes.ConnectionDetails
  export type ConnectionDetailsWithAttachment = TunnelTypes.ConnectionDetailsWithAttachment
  export type TunnelConfig = TunnelTypes.TunnelConfig
}

export const utils = {
  AddonResolver,
  errors: {
    AmbiguousError,
    NotFound, // This should be NotFoundError for consistency, but we're keeping it for backwards compatibility
  },
  pg: {
    DatabaseResolver,
    PsqlService,
    addonService: getAddonService,
    host: getHost,
    isAdvancedDatabase,
    isAdvancedPrivateDatabase,
    isEssentialDatabase,
    isLegacyDatabase,
    isLegacyEssentialDatabase,
    isPostgresAddon,
    psql: {
      exec(
        connectionDetails: TunnelTypes.ConnectionDetailsWithAttachment,
        query: string,
        psqlCmdArgs: string[] = [],
      ): Promise<string> {
        const psqlService = new PsqlService(connectionDetails)
        return psqlService.execQuery(query, psqlCmdArgs)
      },
      getConfigVarNameFromAttachment,
      getPsqlConfigs,
      sshTunnel,
    },
  },
}

export const hux = {
  confirm,
  prompt,
  styledHeader,
  styledJSON,
  styledObject,
  table,
  wait,
}
