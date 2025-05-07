import expectOutput from './test-helpers/expect-output'
import {initCliTest} from './test-helpers/init'
import {runCommand} from './test-helpers/run-command'
import {
  restoreStdoutStderr,
  setupStdoutStderr,
  stderr,
  stdout,
} from './test-helpers/stub-output'
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
import {styledJson} from './ux/styled-json'
import {styledObject} from './ux/styled-object'

export const testHelpers = {
  expectOutput,
  initCliTest,
  restoreStdoutStderr,
  runCommand,
  setupStdoutStderr,
  stderr,
  stdout,
}

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

export const ux = {
  confirm,
  prompt,
  styledHeader,
  styledJson,
  styledObject,
}
