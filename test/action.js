'use strict'
/* globals describe it beforeEach */

const expect = require('unexpected')
const cli = require('..')
const hookStd = require('hook-std')

describe('action', function () {
  beforeEach(() => cli.mockConsole())

  it('shows message', function () {
    let out = ''
    const unhook = hookStd.stderr({silent: true}, output => { out += output })

    return cli.action('working', Promise.resolve())
    .then(() => {
      unhook()
      expect(out, 'to equal', 'working... done\n')
    })
  })

  it('warns', function () {
    let out = ''
    const unhook = hookStd.stderr({silent: true}, output => { out += output })

    let p = cli.action('working', new Promise((resolve) => process.nextTick(() => resolve())))
      .then(() => {
        unhook()
        expect(out, 'to equal', 'working... !\n ▸    warning!\nworking... done\n')
      })
    cli.action.warn('warning!')
    return p
  })

  it('errors', function () {
    let out = ''
    const unhook = hookStd.stderr({silent: true}, output => { out += output })

    return expect(cli.action('working', Promise.reject(new Error('oh noes'))),
      'to be rejected with', {message: 'oh noes'})
      .then(() => {
        unhook()
        expect(out, 'to equal', 'working... !!!\n')
      })
  })
})
