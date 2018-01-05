'use strict'
/* globals describe it beforeEach */

const cli = require('..')
const stripAnsi = require('strip-ansi')
let expect = require('chai').expect

describe('errors', function () {
  beforeEach(function () {
    cli.exit.mock()
    cli.mockConsole()
  })

  it('prints out errors', function () {
    expect(function () { cli.exit(1, 'foobar') }).to.throw(/foobar/)
    expect(stripAnsi(cli.stderr)).to.equal(' ▸    foobar\n')
  })
})
