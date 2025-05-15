import {stderr, stdout} from 'stdout-stderr'

exports.mochaHooks = {
  afterEach(done: () => void) {
    stdout.stop()
    stderr.stop()
    done()
  },

  beforeEach(done: () => void) {
    stdout.start()
    stderr.start()
    done()
  },
}
