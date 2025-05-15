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
