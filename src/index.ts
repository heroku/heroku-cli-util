// Test helpers (optional, for test environments)
import expectOutput from './test-helpers/expect-output'
import {initCliTest} from './test-helpers/init'
import {
  restoreStdoutStderr,
  setupStdoutStderr,
  stderr,
  stdout,
} from './test-helpers/stub-output'

export const testHelpers = {
  expectOutput,
  initCliTest,
  restoreStdoutStderr,
  setupStdoutStderr,
  stderr,
  stdout,
}

export {default as expectOutput} from './test-helpers/expect-output'

// Types - Errors
export * from './types/errors/ambiguous'
export * from './types/errors/not-found'

// Types - PG
export * from './types/pg/data-api'
export * from './types/pg/tunnel'
export * from './utils/addons/resolve'

// Utilities - Postgres
export * from './utils/pg/bastion'
export * from './utils/pg/config-vars'
export * from './utils/pg/databases'
export {default as getPgHost} from './utils/pg/host'
export * from './utils/pg/psql'

// UX helpers
export * from './ux/confirm'
export * from './ux/prompt'
export * from './ux/styled-header'
export * from './ux/styled-json'
export * from './ux/styled-object'
export * from './ux/table'
export * from './ux/wait'
