import {initCliTest} from '@heroku-cli/test-utils'
import {restoreStdoutStderr, setupStdoutStderr} from '@heroku-cli/test-utils'

exports.mochaHooks = {
  afterEach(done: () => void) {
    initCliTest()
    restoreStdoutStderr()
    done()
  },

  beforeEach(done: () => void) {
    setupStdoutStderr()
    done()
  },
}
