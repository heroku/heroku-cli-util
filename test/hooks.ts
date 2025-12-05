import {initCliTest, restoreStdoutStderr, setupStdoutStderr} from '@heroku-cli/test-utils'
import nock from 'nock'

export const mochaHooks = {
  afterEach(done: () => void) {
    restoreStdoutStderr()
    done()
  },

  beforeAll() {
    nock.disableNetConnect()
  },

  beforeEach(done: () => void) {
    initCliTest()
    setupStdoutStderr()
    done()
  },
}
