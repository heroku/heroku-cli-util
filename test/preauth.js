'use strict'
/* globals describe it */

const cli = require('..')
const nock = require('nock')

describe('preauth', function () {
  it('makes a POST to /apps/myapp/pre-authorizations', function () {
    nock('https://api.heroku.com', {
      reqheaders: {'Heroku-Two-Factor-Code': '2fa key'}
    })
      .put('/apps/myapp/pre-authorizations')
      .reply(200, {})

    return cli.preauth('myapp', '2fa key')
  })
})
