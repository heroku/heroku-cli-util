'use strict'
/* globals describe it beforeEach afterEach */

const expect = require('unexpected')
const prompt = require('../lib/prompt').prompt

let isTTY

describe('login', function () {
  beforeEach(() => {
    isTTY = process.stdin.isTTY
    delete process.env.TERM
  })

  afterEach(() => {
    process.stdin.isTTY = isTTY
    delete process.env.TERM
  })

  it('throws error when prompt hidden and dumb', function () {
    process.env.TERM = 'dumb'
    return expect(prompt('foo', { hide: true }), 'to be rejected with', 'CLI needs to prompt for foo but stdin is not a tty.')
  })

  it('throws error when prompt masked and dumb', function () {
    process.env.TERM = 'dumb'
    return expect(prompt('foo', { mask: true }), 'to be rejected with', 'CLI needs to prompt for foo but stdin is not a tty.')
  })

  it('throws error when prompt hidden and not tty', function () {
    process.stdin.isTTY = false
    return expect(prompt('foo', { hide: true }), 'to be rejected with', 'CLI needs to prompt for foo but stdin is not a tty.')
  })

  it('throws error when prompt masked and not tty', function () {
    process.stdin.isTTY = false
    return expect(prompt('foo', { mask: true }), 'to be rejected with', 'CLI needs to prompt for foo but stdin is not a tty.')
  })
})
