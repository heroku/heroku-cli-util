'use strict'
/* globals describe it beforeEach afterEach */

const cli = require('..')
const expect = require('chai').expect
const chalk = require('chalk')

describe('color', function () {
  beforeEach(function () {
    cli.mockConsole()
    cli.color.enabled = true
  })

  afterEach(() => {
    cli.color.enabled = false
  })

  it('app is cyan', function () {
    expect(cli.color.app('myapp')).to.equal(cli.color.heroku('⬢ myapp'))
  })

  it('attachments is green', function () {
    expect(cli.color.attachment('myattachment')).to.equal(chalk.cyan('myattachment'))
  })

  it('addon is magenta', function () {
    expect(cli.color.addon('myaddon')).to.equal(chalk.yellow('myaddon'))
  })

  it('special colors respect supportsColor', function () {
    cli.color.enabled = false
    expect(cli.color.app('myapp')).to.equal('⬢ myapp')
  })

  it('custom colors respect supportsColor', function () {
    cli.color.enabled = false
    expect(cli.color.magenta('myaddon')).to.equal('myaddon')
  })

  it('proxies all other colors through to chalk', function () {
    expect(cli.color.magenta('myaddon')).to.equal(chalk.magenta('myaddon'))
  })
})
