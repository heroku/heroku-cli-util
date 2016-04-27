'use strict'
/* globals describe it beforeEach afterEach expect */

let Spinner = require('../lib/spinner')
let hookStd = require('hook-std')
let mockConsole = require('../lib/console')
let chalk = require('chalk')

describe('spinner', () => {
  function readOutput (spinner, callback) {
    let out = ''

    const unhook = hookStd.stderr({silent: true}, (output) => {
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
      expect(chalk.stripColor(output)).to.eq('foo  \b⣾foo')
    })
  })
})
