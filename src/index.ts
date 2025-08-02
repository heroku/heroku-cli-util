import {APIClient} from '@heroku-cli/command'

import {AmbiguousError} from './errors/ambiguous.js'
import {NotFound} from './errors/not-found.js'
import {ExtendedAddonAttachment, AddOnWithRelatedData, Link} from './types/pg/data-api.js'
import {ConnectionDetails, ConnectionDetailsWithAttachment, TunnelConfig} from './types/pg/tunnel.js'
import DatabaseResolver from './utils/pg/databases.js'
import getHost from './utils/pg/host.js'
import {exec} from './utils/pg/psql.js'
import {confirm} from './ux/confirm.js'
import {prompt} from './ux/prompt.js'
import {styledHeader} from './ux/styled-header.js'
import {styledJSON} from './ux/styled-json.js'
import {styledObject} from './ux/styled-object.js'
import {table} from './ux/table.js'
import {wait} from './ux/wait.js'

export const types = {
  errors: {
    AmbiguousError,
    NotFound,
  },
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
  pg: {
    database: (heroku: APIClient, appId: string, attachmentId?: string, namespace?: string) => {
      const databaseResolver = new DatabaseResolver(heroku)
      return databaseResolver.getDatabase(appId, attachmentId, namespace)
    },
    host: getHost,
    psql: {
      exec,
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
