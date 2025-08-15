import {APIClient} from '@heroku-cli/command'

import {AmbiguousError} from './errors/ambiguous'
import {NotFound} from './errors/not-found'
import {AddOnWithRelatedData, ExtendedAddonAttachment, Link} from './types/pg/data-api'
import {ConnectionDetails, ConnectionDetailsWithAttachment, TunnelConfig} from './types/pg/tunnel'
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
  ExtendedAddonAttachment,
  Link,
} from './types/pg/data-api'

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
    psql: {
      exec(
        connectionDetails: ConnectionDetailsWithAttachment,
        query: string,
        psqlCmdArgs: string[] = [],
      ): Promise<string> {
        const psqlService = new PsqlService(connectionDetails)
        return psqlService.execQuery(query, psqlCmdArgs)
      },
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
