import {stderr, stdout} from 'stdout-stderr'

export const mochaHooks = {
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
