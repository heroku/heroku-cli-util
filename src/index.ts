import {APIClient} from '@heroku-cli/command'

import {AmbiguousError} from './errors/ambiguous.js'
import {NotFound} from './errors/not-found.js'
import {ExtendedAddonAttachment, AddOnWithRelatedData, Link} from './types/pg/data-api.js'
import {ConnectionDetails, ConnectionDetailsWithAttachment, TunnelConfig} from './types/pg/tunnel.js'
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

export const types = {
  pg: {
    ExtendedAddonAttachment: {} as ExtendedAddonAttachment,
    AddOnWithRelatedData: {} as AddOnWithRelatedData,
    ConnectionDetails: {} as ConnectionDetails,
    ConnectionDetailsWithAttachment: {} as ConnectionDetailsWithAttachment,
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
      database: (
        heroku: APIClient,
        appId: string,
        attachmentId?: string,
        namespace?: string,
      ): Promise<ConnectionDetailsWithAttachment> => {
        const databaseResolver = new DatabaseResolver(heroku)
        return databaseResolver.getDatabase(appId, attachmentId, namespace)
      },
    },
    host: getHost,
    psql: {
      exec: (
        connectionDetails: ConnectionDetails,
        query: string,
        psqlCmdArgs: string[] = [],
      ): Promise<string> => {
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
