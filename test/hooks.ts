import {initCliTest} from '@heroku-cli/test-utils'
import nock from 'nock'

export const mochaHooks = {
  beforeAll() {
    nock.disableNetConnect()
  },

  beforeEach(done: () => void) {
    initCliTest()
    done()
  },
}
