'use strict'
/* globals describe it beforeEach */

const expect = require('unexpected')
const cli = require('..')

describe('action', function () {
  beforeEach(() => cli.mockConsole())

  it('shows message', function () {
    return cli.action('working', Promise.resolve())
      .then(() => expect(cli.stderr, 'to equal', 'working... done\n'))
  })

  it('warns', function () {
    let p = cli.action('working', new Promise((resolve) => process.nextTick(() => resolve())))
      .then(() => expect(cli.stderr, 'to equal', 'working... !\n ▸    warning!\nworking... done\n'))
    cli.action.warn('warning!')
    return p
  })

  it('errors', function () {
    return expect(cli.action('working', Promise.reject(new Error('oh noes'))),
      'to be rejected with', { message: 'oh noes' })
      .then(() => expect(cli.stderr, 'to equal', 'working... !\n'))
  })
})
