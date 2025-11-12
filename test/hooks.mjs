import {initCliTest, restoreStdoutStderr, setupStdoutStderr} from '@heroku-cli/test-utils'

export const mochaHooks = {
  afterEach(done) {
    restoreStdoutStderr()
    done()
  },

  beforeEach(done) {
    initCliTest()
    setupStdoutStderr()
    done()
  },
}
