// import {initCliTest} from '../src/test-helpers/init'
// import {restoreStdoutStderr, setupStdoutStderr} from '../src/test-helpers/stub-output'
import {stdout} from 'stdout-stderr'

exports.mochaHooks = {
  afterEach(done: () => void) {
    stdout.stop()
    done()
  },

  beforeEach(done: () => void) {
    stdout.start()
    done()
  },
}
