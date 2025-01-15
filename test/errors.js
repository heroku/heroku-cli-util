'use strict'
/* globals describe it beforeEach */

const stripAnsi = require('strip-ansi')
const cli = require('..')
const expect = require('chai').expect

describe('errors', function () {
  beforeEach(() => cli.mockConsole())

  it('prints out errors', function () {
    cli.error('foobar')
    expect(stripAnsi(cli.stderr)).to.equal(' ▸    foobar\n')
  })

  it('prints out warnings', function () {
    cli.warn('foobar')
    expect(stripAnsi(cli.stderr)).to.equal(' ▸    foobar\n')
  })
})
