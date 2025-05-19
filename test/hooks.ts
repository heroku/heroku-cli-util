import {initCliTest, restoreStdoutStderr, setupStdoutStderr} from '@heroku-cli/test-utils'

export const mochaHooks = {
  afterEach(done: () => void) {
    restoreStdoutStderr()
    done()
  },

  beforeEach(done: () => void) {
    initCliTest()
    setupStdoutStderr()
    done()
  },
}
