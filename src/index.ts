import {APIClient} from '@heroku-cli/command'

import {AmbiguousError} from './errors/ambiguous'
import {NotFound} from './errors/not-found'
import {
  AddOnWithRelatedData,
  ExtendedAddon,
  ExtendedAddonAttachment,
  Link,
} from './types/pg/platform-api'
import {ConnectionDetails, ConnectionDetailsWithAttachment, TunnelConfig} from './types/pg/tunnel'
import {
  getAddonService,
  isAdvancedDatabase,
  isAdvancedPrivateDatabase,
  isEssentialDatabase,
  isLegacyDatabase,
  isLegacyEssentialDatabase,
  isPostgresAddon,
} from './utils/addons/helpers'
import {getPsqlConfigs, sshTunnel} from './utils/pg/bastion'
import {getConfigVarNameFromAttachment} from './utils/pg/config-vars'
import DatabaseResolver from './utils/pg/databases'
import getHost from './utils/pg/host'
import PsqlService from './utils/pg/psql'
import {confirm} from './ux/confirm'
import {prompt} from './ux/prompt'
import {styledHeader} from './ux/styled-header'
import {styledJSON} from './ux/styled-json'
import {styledObject} from './ux/styled-object'
import {table} from './ux/table'
import {wait} from './ux/wait'

// Export actual types for direct import
export type {
  AddOnWithRelatedData,
  ExtendedAddon,
  ExtendedAddonAttachment,
  Link,
} from './types/pg/platform-api'

export type {
  ConnectionDetails,
  ConnectionDetailsWithAttachment,
  TunnelConfig,
} from './types/pg/tunnel'

// Keep const types for backward compatibility (deprecated)
/** @deprecated Use direct type imports instead */
export const types = {
  pg: {
    AddOnWithRelatedData: {} as AddOnWithRelatedData,
    ConnectionDetails: {} as ConnectionDetails,
    ConnectionDetailsWithAttachment: {} as ConnectionDetailsWithAttachment,
    ExtendedAddon: {} as ExtendedAddon,
    ExtendedAddonAttachment: {} as ExtendedAddonAttachment,
    Link: {} as Link,
    TunnelConfig: {} as TunnelConfig,
  },
}

export const utils = {
  errors: {
    AmbiguousError,
    NotFound, // This should be NotFoundError for consistency, but we're keeping it for backwards compatibility
  },
  pg: {
    DatabaseResolver,
    PsqlService,
    addonService: getAddonService,
    fetcher: {
      database(
        heroku: APIClient,
        appId: string,
        attachmentId?: string,
        namespace?: string,
      ): Promise<ConnectionDetailsWithAttachment> {
        const databaseResolver = new DatabaseResolver(heroku)
        return databaseResolver.getDatabase(appId, attachmentId, namespace)
      },
    },
    host: getHost,
    isAdvancedDatabase,
    isAdvancedPrivateDatabase,
    isEssentialDatabase,
    isLegacyDatabase,
    isLegacyEssentialDatabase,
    isPostgresAddon,
    psql: {
      exec(
        connectionDetails: ConnectionDetailsWithAttachment,
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
