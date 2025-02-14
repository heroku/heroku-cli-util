'use strict'
/* globals describe it */

const cli = require('..')
const Heroku = require('heroku-client')
const nock = require('nock')

describe('preauth', function () {
  it('makes a POST to /apps/myapp/pre-authorizations', function () {
    const heroku = new Heroku()
    nock('https://api.heroku.com', {
      reqheaders: { 'Heroku-Two-Factor-Code': '2fa key' }
    })
      .put('/apps/myapp/pre-authorizations')
      .reply(200, {})

    return cli.preauth('myapp', heroku, '2fa key')
  })
})
