import {initCliTest} from '@heroku-cli/test-utils'
import {restoreStdoutStderr, setupStdoutStderr} from '@heroku-cli/test-utils'

export const mochaHooks = {
  afterEach(done) {
    initCliTest()
    restoreStdoutStderr()
    done()
  },

  beforeEach(done) {
    setupStdoutStderr()
    done()
  },
}
