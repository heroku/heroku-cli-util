import {initCliTest, restoreStdoutStderr, setupStdoutStderr} from '@heroku-cli/test-utils'
import nock from 'nock'

export const mochaHooks = {
  afterEach(done) {
    restoreStdoutStderr()
    done()
  },

  beforeAll() {
    nock.disableNetConnect()
  },

  beforeEach(done) {
    initCliTest()
    setupStdoutStderr()
    done()
  },
}
