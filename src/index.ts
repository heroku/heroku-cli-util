import {AmbiguousError} from './types/errors/ambiguous'
import {NotFound} from './types/errors/not-found'
import {AddOnAttachmentWithConfigVarsAndPlan, AddOnWithRelatedData, Link} from './types/pg/data-api'
import {ConnectionDetails, ConnectionDetailsWithAttachment, TunnelConfig} from './types/pg/tunnel'
import {getDatabase} from './utils/pg/databases'
import getHost from './utils/pg/host'
import {exec} from './utils/pg/psql'
import {confirm} from './ux/confirm'
import {prompt} from './ux/prompt'
import {styledHeader} from './ux/styled-header'
import {styledJSON} from './ux/styled-json'
import {styledObject} from './ux/styled-object'
import {table} from './ux/table'
import {wait} from './ux/wait'

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
    databases: getDatabase,
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
