'use strict'
/* globals describe it beforeEach afterEach */

const Spinner = require('../lib/spinner')
const hookStd = require('hook-std')
const mockConsole = require('../lib/console')
const stripColor = require('strip-ansi')
const expect = require('unexpected')

describe('spinner', () => {
  function readOutput (spinner, callback) {
    let out = ''

    const unhook = hookStd.stderr({silent: true}, output => {
      out += output
    })

    spinner.start()
    spinner.stop()
    unhook()

    callback(out)
  }

  beforeEach(() => {
    mockConsole.mock(false)
    process.stderr.isTTY = true
    process.stderr.clearLine = function () {}
    process.stderr.cursorTo = function () {}
  })

  afterEach(() => {
    mockConsole.mock()
  })

  it('main', () => {
    const spinner = new Spinner({text: 'foo'})

    spinner.enabled = true

    readOutput(spinner, (output) => {
      expect(stripColor(output), 'to equal', 'foo ⣾ \nfoo \n')
    })
  })
})
