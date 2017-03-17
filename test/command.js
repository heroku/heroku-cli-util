'use strict'
/* globals describe it beforeEach */

let nock = require('nock')
let co = require('co')
let expect = require('unexpected')

let cli = require('..')
let command = require('../lib/command')

describe('command', function () {
  beforeEach(function () {
    nock.disableNetConnect()
    nock.cleanAll()

    cli.mockConsole()
    cli.prompt = function () {
      return new Promise(function (resolve, reject) {
        resolve('2fa')
      })
    }
  })

  it('2fa should retry just the failing request', function () {
    let api = nock('https://api.heroku.com')

    api.post('/bizbaz', {}).reply(200, {value: 'bizbaz'})

    api.post('/foobar', {}).reply(403, {'id': 'two_factor'})

    let api2FA = nock('https://api.heroku.com', {
      reqheaders: {'Heroku-Two-Factor-Code': '2fa'}
    })

    api2FA.post('/foobar', {}).reply(200, {value: 'foobar'})

    return command({preauth: false}, co.wrap(function * (context, heroku) {
      let bizbaz = yield heroku.post('/bizbaz', {body: {}})
      cli.log(bizbaz.value)

      let foobar = yield heroku.post('/foobar', {body: {}})
      cli.log(foobar.value)
    }))({})
    .then(() => {
      api.done()
      api2FA.done()
      expect(cli.stdout, 'to equal', 'bizbaz\nfoobar\n')
    })
  })

  it('2fa should preauth then run request again', function () {
    let api = nock('https://api.heroku.com', {
      badheaders: ['Heroku-Two-Factor-Code']
    })

    api.post('/bizbaz', {}).reply(200, {value: 'bizbaz'})

    api.post('/foobar', {}).reply(403, {'id': 'two_factor', 'app': {'name': 'biz'}})

    let api2FA = nock('https://api.heroku.com', {
      reqheaders: {'Heroku-Two-Factor-Code': '2fa'}
    })

    api2FA.put('/apps/biz/pre-authorizations').reply(200, {})

    api.post('/foobar', {}).reply(200, {value: 'foobar'})

    return command({preauth: true}, co.wrap(function * (context, heroku) {
      let bizbaz = yield heroku.post('/bizbaz', {body: {}})
      cli.log(bizbaz.value)

      let foobar = yield heroku.post('/foobar', {body: {}})
      cli.log(foobar.value)
    }))({app: 'fuzz'})
    .then(() => {
      api.done()
      api2FA.done()
      expect(cli.stdout, 'to equal', 'bizbaz\nfoobar\n')
    })
  })

  it('2fa should preauth if options.preauth is undefined', function () {
    let api = nock('https://api.heroku.com', {
      badheaders: ['Heroku-Two-Factor-Code']
    })

    api.post('/bizbaz', {}).reply(200, {value: 'bizbaz'})

    api.post('/foobar', {}).reply(403, {'id': 'two_factor', 'app': {'name': 'biz'}})

    let api2FA = nock('https://api.heroku.com', {
      reqheaders: {'Heroku-Two-Factor-Code': '2fa'}
    })

    api2FA.put('/apps/biz/pre-authorizations').reply(200, {})

    api.post('/foobar', {}).reply(200, {value: 'foobar'})

    return command({}, co.wrap(function * (context, heroku) {
      let bizbaz = yield heroku.post('/bizbaz', {body: {}})
      cli.log(bizbaz.value)

      let foobar = yield heroku.post('/foobar', {body: {}})
      cli.log(foobar.value)
    }))({app: 'fuzz'})
    .then(() => {
      api.done()
      api2FA.done()
      expect(cli.stdout, 'to equal', 'bizbaz\nfoobar\n')
    })
  })

  it('2fa should preauth just one time per app', function () {
    let api = nock('https://api.heroku.com', {
      badheaders: ['Heroku-Two-Factor-Code']
    })

    api.post('/foobar/a', {}).reply(403, {'id': 'two_factor', 'app': {'name': 'biz'}})
    api.post('/foobar/b', {}).reply(403, {'id': 'two_factor', 'app': {'name': 'biz'}})

    let api2FA = nock('https://api.heroku.com', {
      reqheaders: {'Heroku-Two-Factor-Code': '2fa'}
    })

    api2FA.put('/apps/biz/pre-authorizations').reply(200, {})

    api.post('/foobar/a', {}).reply(200, {value: 'foobara'})
    api.post('/foobar/b', {}).reply(200, {value: 'foobarb'})

    return command({preauth: true}, co.wrap(function * (context, heroku) {
      let bizbaz = yield [
        heroku.post('/foobar/a', {body: {}}),
        heroku.post('/foobar/b', {body: {}})
      ]
      bizbaz.forEach((l) => cli.log(l.value))
    }))({app: 'fuzz'})
    .then(() => {
      api.done()
      api2FA.done()
      expect(cli.stdout, 'to equal', 'foobara\nfoobarb\n')
    })
  })

  it('2fa should preauth for each app', function () {
    let api = nock('https://api.heroku.com', {
      badheaders: ['Heroku-Two-Factor-Code']
    })

    api.post('/foobar/a', {}).reply(403, {'id': 'two_factor', 'app': {'name': 'biz'}})
    api.post('/foobar/b', {}).reply(403, {'id': 'two_factor', 'app': {'name': 'baz'}})

    let api2FA = nock('https://api.heroku.com', {
      reqheaders: {'Heroku-Two-Factor-Code': '2fa'}
    })

    api2FA.put('/apps/biz/pre-authorizations').reply(200, {})
    api2FA.put('/apps/baz/pre-authorizations').reply(200, {})

    api.post('/foobar/a', {}).reply(200, {value: 'foobara'})
    api.post('/foobar/b', {}).reply(200, {value: 'foobarb'})

    return command({preauth: true}, co.wrap(function * (context, heroku) {
      let bizbaz = yield [
        heroku.post('/foobar/a', {body: {}}),
        heroku.post('/foobar/b', {body: {}})
      ]
      bizbaz.forEach((l) => cli.log(l.value))
    }))({app: 'fuzz'})
    .then(() => {
      api.done()
      api2FA.done()
      expect(cli.stdout, 'to equal', 'foobara\nfoobarb\n')
    })
  })

  it('preauth should fail if we keep getting two factored for each app', function () {
    let api = nock('https://api.heroku.com', {
      badheaders: ['Heroku-Two-Factor-Code']
    })

    api.post('/foobar/a', {}).reply(403, {'id': 'two_factor', 'app': {'name': 'biz'}})
    api.post('/foobar/b', {}).reply(403, {'id': 'two_factor', 'app': {'name': 'biz'}})

    let api2FA = nock('https://api.heroku.com', {
      reqheaders: {'Heroku-Two-Factor-Code': '2fa'}
    })

    api2FA.put('/apps/biz/pre-authorizations').reply(200, {})

    api.post('/foobar/a', {}).reply(200, {value: 'foobara'})
    api.post('/foobar/b', {}).reply(403, {'id': 'two_factor', 'app': {'name': 'biz'}})

    return command({preauth: true}, co.wrap(function * (context, heroku) {
      let bizbaz = yield [
        heroku.post('/foobar/a', {body: {}}),
        heroku.post('/foobar/b', {body: {}})
      ]
      bizbaz.forEach((l) => cli.log(l.value))
    }))({app: 'fuzz'})
    .then(() => {
      expect(true, 'to equal', false)
    })
    .catch((err) => {
      expect(err.body.id, 'to equal', 'two_factor')
    })
  })

  it('2fa prompt error should propegate', function () {
    let api = nock('https://api.heroku.com')

    api.post('/foobar', {}).reply(403, {'id': 'two_factor'})

    cli.prompt = function () {
      return new Promise(function (resolve, reject) {
        reject('error reading prompt')
      })
    }

    return expect(command(co.wrap(function * (context, heroku) {
      let foobar = yield heroku.post('/foobar', {body: {}})
      cli.log(foobar.value)
    }))({}), 'to be rejected with', 'error reading prompt')
  })

  it('non 2fa error should propagate', function () {
    let api = nock('https://api.heroku.com')
    api.post('/foobar', {}).reply(403, {'id': 'not_two_factor'})

    return expect(command(co.wrap(function * (context, heroku) {
      yield heroku.post('/foobar', {body: {}})
    }))({}), 'to be rejected with', {statusCode: 403, body: { id: 'not_two_factor' }})
  })

  it('non json error should propagate', function () {
    let api = nock('https://api.heroku.com')
    api.post('/foobar', {}).reply(403, 'fizz')

    return expect(command(co.wrap(function * (context, heroku) {
      yield heroku.post('/foobar', {body: {}})
    }))({}), 'to be rejected with', {body: 'fizz'})
  })
})
