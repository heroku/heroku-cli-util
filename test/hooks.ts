// import {initCliTest} from '../src/test-helpers/init'
// import {restoreStdoutStderr, setupStdoutStderr} from '../src/test-helpers/stub-output'

exports.mochaHooks = {
  afterEach(done: () => void) {
    // initCliTest()
    // restoreStdoutStderr()
    done()
  },

  beforeEach(done: () => void) {
    // setupStdoutStderr()
    done()
  },
}
