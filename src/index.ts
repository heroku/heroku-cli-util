import {AmbiguousError} from './types/errors/ambiguous.js'
import {NotFound} from './types/errors/not-found.js'
import {AddOnAttachmentWithConfigVarsAndPlan, AddOnWithRelatedData, Link} from './types/pg/data-api.js'
import {ConnectionDetails, ConnectionDetailsWithAttachment, TunnelConfig} from './types/pg/tunnel.js'
// import {getDatabase} from './utils/pg/databases.js'
import getHost from './utils/pg/host.js'
// import {exec} from './utils/pg/psql.js'
import {confirm} from './ux/confirm.js'
import {styledHeader} from './ux/styled-header.js'
// import {prompt} from './ux/prompt'
import {styledJSON} from './ux/styled-json.js'
import {styledObject} from './ux/styled-object.js'
import {table} from './ux/table.js'

export const types = {
  errors: {
    AmbiguousError,
    NotFound,
  },
  pg: {
    AddOnAttachmentWithConfigVarsAndPlan: {} as AddOnAttachmentWithConfigVarsAndPlan,
    AddOnWithRelatedData: {} as AddOnWithRelatedData,
    ConnectionDetails: {} as ConnectionDetails,
    ConnectionDetailsWithAttachment: {} as ConnectionDetailsWithAttachment,
    Link: {} as Link,
    TunnelConfig: {} as TunnelConfig,
  },
}

export const utils = {
  pg: {
    // databases: getDatabase,
    host: getHost,
    psql: {
      // exec,
    },
  },
}

export const hux = {
  confirm,
  styledHeader,
  // prompt,
  styledJSON,
  styledObject,
  table,
  // wait,
}
