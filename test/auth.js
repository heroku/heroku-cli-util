'use strict'
/* globals describe it beforeEach afterEach */

let nock = require('nock')
let Heroku = require('heroku-client')
let cli = require('..')
let os = require('os')

let proxyquire = require('proxyquire').noCallThru()
let sinon = require('sinon')
let expect = require('unexpected')
let {PromptMaskError} = require('../lib/prompt.js')

let stubPrompt
let stubOpen
let auth

let fs = require('fs')
let tmpNetrc
let netrc = require('netrc-parser').default

let mockLogout = function (heroku) {
  let api = nock('https://api.heroku.com')
  let password = heroku.options.token
  let base64 = `Basic ${Buffer.from(':' + password).toString('base64')}`

  let sessionDelete = api
    .delete('/oauth/sessions/~')
    .reply(function (uri, requestBody) {
      expect(this.req.headers['authorization'], 'to equal', base64)
      return {}
    })

  let authorizationsGet = api
    .get('/oauth/authorizations')
    .reply(function (uri, requestBody) {
      expect(this.req.headers['authorization'], 'to equal', base64)
      return [{id: '1234', access_token: {token: password}}]
    })

  let authorizationsDefaultGet = api
    .get('/oauth/authorizations/~')
    .reply(function (uri, requestBody) {
      expect(this.req.headers['authorization'], 'to equal', base64)
      return {id: '5678', access_token: {token: 'XXXX-YYYY'}}
    })

  let authorizationsDelete = api
    .delete('/oauth/authorizations/1234')
    .reply(function (uri, requestBody) {
      expect(this.req.headers['authorization'], 'to equal', base64)
      return {}
    })

  return {sessionDelete, authorizationsGet, authorizationsDefaultGet, authorizationsDelete}
}

let password = '3c739c03-c94a-43ef-9473-4e59c1fc851a'
let mockMachines = {
  'api.heroku.com': {password},
  'git.heroku.com': {password}
}

let mockAuth = function () {
  netrc.machines = mockMachines
  cli.heroku = new Heroku({token: password})
  return password
}

describe('auth', function () {
  beforeEach(() => {
    stubPrompt = sinon.stub()
    stubPrompt.throws('not stubbed')

    stubOpen = sinon.stub()
    stubOpen.throws('not stubbed')

    tmpNetrc = require('tmp').fileSync().name
    netrc.save = () => {}
    netrc.saveSync = () => {}

    auth = proxyquire('../lib/auth', {
      './prompt': {
        prompt: stubPrompt,
        PromptMaskError: PromptMaskError
      },
      './open': stubOpen
    })

    cli.mockConsole()
    cli.heroku = new Heroku({token: null})

    nock.disableNetConnect()
    nock.cleanAll()

    delete process.env['HEROKU_ORGANIZATION']
    delete process.env['SSO_URL']
  })

  afterEach(() => {
    delete process.env['HEROKU_ORGANIZATION']
    delete process.env['SSO_URL']
    fs.unlinkSync(tmpNetrc)
  })

  it('logs in via username and password', function () {
    stubPrompt.withArgs('Email').returns(Promise.resolve('email'))
    stubPrompt.withArgs('Password', {hide: true}).returns(Promise.resolve('password'))

    let body = {
      'scope': ['global'],
      'expires_in': 31536000
    }

    let headers = {Authorization: 'Basic ZW1haWw6cGFzc3dvcmQ='}

    let response = {access_token: {token: 'token'}, user: {email: 'foo@bar.com'}}
    let api = nock('https://api.heroku.com', {reqheaders: headers})
      .post('/oauth/authorizations', body)
      .reply(200, response)
    return auth.login()
      .then((data) => {
        expect(data, 'to equal', {token: response.access_token.token, email: response.user.email})
        expect(cli.stderr, 'to equal', '')
        expect(cli.stdout, 'to equal', 'Enter your Heroku credentials:\n')
        api.done()
      })
  })

  it('logs in with oauth token expires_in set', function () {
    stubPrompt.withArgs('Email').returns(Promise.resolve('email'))
    stubPrompt.withArgs('Password', {hide: true}).returns(Promise.resolve('password'))

    let body = {
      'scope': ['global'],
      'expires_in': 60 // seconds
    }

    let headers = {Authorization: 'Basic ZW1haWw6cGFzc3dvcmQ='}

    let response = {access_token: {token: 'token', expires_in: 60}, user: {email: 'foo@bar.com'}}
    let api = nock('https://api.heroku.com', {reqheaders: headers})
      .post('/oauth/authorizations', body)
      .reply(200, response)
    return auth.login({expires_in: 60})
      .then((data) => {
        expect(data, 'to equal', {token: response.access_token.token, email: response.user.email, expires_in: response.access_token.expires_in})
        expect(cli.stderr, 'to equal', '')
        expect(cli.stdout, 'to equal', 'Enter your Heroku credentials:\n')
        api.done()
      })
  })

  it('logs in and saves', function () {
    stubPrompt.withArgs('Email').returns(Promise.resolve('email'))
    stubPrompt.withArgs('Password', {hide: true}).returns(Promise.resolve('password'))

    let body = {
      'scope': ['global'],
      'expires_in': 31536000
    }

    let headers = {Authorization: 'Basic ZW1haWw6cGFzc3dvcmQ='}

    let response = {access_token: {token: 'token'}, user: {email: 'foo@bar.com'}}
    let api = nock('https://api.heroku.com', {reqheaders: headers})
      .post('/oauth/authorizations', body)
      .reply(200, response)
    return auth.login({save: true})
      .then((data) => {
        expect(data, 'to equal', {token: response.access_token.token, email: response.user.email})
        expect(cli.stderr, 'to equal', '')
        expect(cli.stdout, 'to equal', 'Enter your Heroku credentials:\n')

        expect(netrc.machines['api.heroku.com'].login, 'to equal', 'foo@bar.com')
        expect(netrc.machines['api.heroku.com'].password, 'to equal', 'token')
        expect(netrc.machines['api.heroku.com'].internalWhitespace, 'to equal', "\n  ")
        expect(netrc.machines['git.heroku.com'].login, 'to equal', 'foo@bar.com')
        expect(netrc.machines['git.heroku.com'].password, 'to equal', 'token')
        expect(netrc.machines['git.heroku.com'].internalWhitespace, 'to equal', "\n  ")
        api.done()
      })
  })

  it.skip('logs in and removes old session / token', function () {
    stubPrompt.withArgs('Email').returns(Promise.resolve('email'))
    stubPrompt.withArgs('Password', {hide: true}).returns(Promise.resolve('password'))

    let body = {
      'scope': ['global'],
      'expires_in': 31536000
    }

    mockAuth()

    let response = {access_token: {token: 'token'}, user: {email: 'foo@bar.com'}}
    let api = nock('https://api.heroku.com')

    let authorize = api
      .post('/oauth/authorizations', body)
      .reply(function (uri, requestBody) {
        expect(this.req.headers['authorization'], 'to equal', 'Basic ZW1haWw6cGFzc3dvcmQ=')
        return response
      })

    let {sessionDelete, authorizationsGet, authorizationsDefaultGet, authorizationsDelete} = mockLogout(cli.heroku)

    return auth.login({save: true})
      .then((data) => {
        expect(data, 'to equal', {token: response.access_token.token, email: response.user.email})
        expect(cli.stderr, 'to equal', '')
        expect(cli.stdout, 'to equal', 'Enter your Heroku credentials:\n')

        expect(netrc.machines['api.heroku.com'].login, 'to equal', 'foo@bar.com')
        expect(netrc.machines['api.heroku.com'].password, 'to equal', 'token')
        expect(netrc.machines['git.heroku.com'].login, 'to equal', 'foo@bar.com')
        expect(netrc.machines['git.heroku.com'].password, 'to equal', 'token')

        authorize.done()
        sessionDelete.done()
        authorizationsGet.done()
        authorizationsDefaultGet.done()
        authorizationsDelete.done()
      })
  })

  it('logout does nothing if no creds', function () {
    return auth.logout({})
  })

  it.skip('logout deletes the session & authorization', function () {
    mockAuth()

    let {sessionDelete, authorizationsGet, authorizationsDefaultGet, authorizationsDelete} = mockLogout(cli.heroku)

    return auth.logout()
      .then(() => {
        expect(netrc.machines['api.heroku.com'], 'to equal', undefined)
        expect(netrc.machines['git.heroku.com'], 'to equal', undefined)
        sessionDelete.done()
        authorizationsGet.done()
        authorizationsDefaultGet.done()
        authorizationsDelete.done()
      })
  })

  it('logout does not delete the default token', function () {
    let password = mockAuth()

    let sessionDelete = nock('https://api.heroku.com')
      .delete('/oauth/sessions/~')
      .reply(200, {})

    let authorizationsDefaultGet = nock('https://api.heroku.com')
      .get('/oauth/authorizations/~')
      .reply(200, {id: '1234', access_token: {token: password}})

    let authorizationsGet = nock('https://api.heroku.com')
      .get('/oauth/authorizations')
      .reply(200, [{id: '1234', access_token: {token: password}}])

    return auth.logout()
      .then(() => {
        expect(netrc.machines['api.heroku.com'], 'to equal', undefined)
        expect(netrc.machines['git.heroku.com'], 'to equal', undefined)
        sessionDelete.done()
        authorizationsDefaultGet.done()
        authorizationsGet.done()
      })
  })

  it('logout traps session & default authorization not found', function () {
    let password = mockAuth()

    let sessionDelete = nock('https://api.heroku.com')
      .delete('/oauth/sessions/~')
      .reply(404, {'resource': 'session', 'id': 'not_found'})

    let authorizationsGet = nock('https://api.heroku.com')
      .get('/oauth/authorizations')
      .reply(200, [{id: '1234', access_token: {token: password}}])

    let authorizationsDefaultGet = nock('https://api.heroku.com')
      .get('/oauth/authorizations/~')
      .reply(404, {'resource': 'authorization', 'id': 'not_found'})

    let authorizationsDelete = nock('https://api.heroku.com')
      .delete('/oauth/authorizations/1234')
      .reply(200, {})

    return auth.logout()
      .then(() => {
        expect(netrc.machines['api.heroku.com'], 'to equal', undefined)
        expect(netrc.machines['git.heroku.com'], 'to equal', undefined)
        sessionDelete.done()
        authorizationsDefaultGet.done()
        authorizationsGet.done()
        authorizationsDelete.done()
      })
  })

  it('logout traps unauthorized', function () {
    mockAuth()

    let sessionDelete = nock('https://api.heroku.com')
      .delete('/oauth/sessions/~')
      .reply(401, {'id': 'unauthorized'})

    let authorizationsDefaultGet = nock('https://api.heroku.com')
      .get('/oauth/authorizations/~')
      .reply(401, {'id': 'unauthorized'})

    let authorizationsGet = nock('https://api.heroku.com')
      .get('/oauth/authorizations')
      .reply(401, {'id': 'unauthorized'})

    return auth.logout()
      .then(() => {
        expect(netrc.machines['api.heroku.com'], 'to equal', undefined)
        expect(netrc.machines['git.heroku.com'], 'to equal', undefined)
        sessionDelete.done()
        authorizationsDefaultGet.done()
        authorizationsGet.done()
      })
  })

  it('throws error when not http error body', function () {
    stubPrompt.withArgs('Email').returns(Promise.resolve('email'))
    stubPrompt.withArgs('Password', {hide: true}).returns(Promise.resolve('password'))

    let body = {
      'scope': ['global'],
      'expires_in': 31536000
    }

    let headers = {Authorization: 'Basic ZW1haWw6cGFzc3dvcmQ='}

    let api = nock('https://api.heroku.com', {reqheaders: headers})
      .post('/oauth/authorizations', body)
      .reply(200, {})
    return expect(auth.login(), 'to be rejected with', "Cannot read property 'token' of undefined")
      .then(() => api.done())
  })

  it('logs in via sso env var', function () {
    let url = 'https://sso.foobar.com/saml/myorg/init?cli=true'
    process.env['SSO_URL'] = url

    let urlStub = stubOpen.withArgs(url).returns(Promise.resolve(undefined))

    let tokenStub = stubPrompt.withArgs('Enter your access token (typing will be hidden)', {hide: true}).returns(Promise.resolve('token'))
    let headers = {Authorization: 'Bearer token'}

    let api = nock('https://api.heroku.com', {reqheaders: headers})
      .get('/account')
      .reply(200, {email: 'foo@bar.com'})

    return auth.login({sso: true})
      .then((auth) => {
        expect(urlStub.called, 'to equal', true)
        expect(tokenStub.called, 'to equal', true)
        expect(cli.stderr, 'to equal', 'Opening browser for login... done\n')
        api.done()
        expect(auth, 'to equal', {token: 'token', email: 'foo@bar.com'})
      })
  })

  it('logs in via sso org env', function () {
    process.env['HEROKU_ORGANIZATION'] = 'myorg'

    let url = 'https://sso.heroku.com/saml/myorg/init?cli=true'
    let urlStub = stubOpen.withArgs(url).returns(Promise.resolve(undefined))

    let tokenStub = stubPrompt.withArgs('Enter your access token (typing will be hidden)', {hide: true}).returns(Promise.resolve('token'))
    let headers = {Authorization: 'Bearer token'}

    let api = nock('https://api.heroku.com', {reqheaders: headers})
      .get('/account')
      .reply(200, {email: 'foo@bar.com'})

    return auth.login({sso: true})
      .then((auth) => {
        expect(urlStub.called, 'to equal', true)
        expect(tokenStub.called, 'to equal', true)
        expect(cli.stderr, 'to equal', 'Opening browser for login... done\n')
        api.done()
        expect(auth, 'to equal', {token: 'token', email: 'foo@bar.com'})
      })
  })

  it('logs in via sso org prompt', function () {
    let orgStub = stubPrompt.withArgs('Enter your organization name').returns(Promise.resolve('myorg'))

    let url = 'https://sso.heroku.com/saml/myorg/init?cli=true'
    let urlStub = stubOpen.withArgs(url).returns(Promise.resolve(undefined))

    let tokenStub = stubPrompt.withArgs('Enter your access token (typing will be hidden)', {hide: true}).returns(Promise.resolve('token'))
    let headers = {Authorization: 'Bearer token'}

    let api = nock('https://api.heroku.com', {reqheaders: headers})
      .get('/account')
      .reply(200, {email: 'foo@bar.com'})

    return auth.login({sso: true})
      .then((auth) => {
        expect(orgStub.called, 'to equal', true)
        expect(urlStub.called, 'to equal', true)
        expect(tokenStub.called, 'to equal', true)
        expect(cli.stderr, 'to equal', 'Opening browser for login... done\n')
        api.done()
        expect(auth, 'to equal', {token: 'token', email: 'foo@bar.com'})
      })
  })

  it('unauthorized token', function () {
    let orgStub = stubPrompt.withArgs('Enter your organization name').returns(Promise.resolve('myorg'))

    let url = 'https://sso.heroku.com/saml/myorg/init?cli=true'
    let urlStub = stubOpen.withArgs(url).returns(Promise.resolve(undefined))

    let tokenStub = stubPrompt.withArgs('Enter your access token (typing will be hidden)', {hide: true}).returns(Promise.resolve('token'))
    let headers = {Authorization: 'Bearer token'}

    let api = nock('https://api.heroku.com', {reqheaders: headers})
      .get('/account')
      .reply(403, {message: 'api message'})

    return expect(auth.login({sso: true}), 'to be rejected with', {body: {message: 'api message'}})
      .then(() => {
        expect(orgStub.called, 'to equal', true)
        expect(urlStub.called, 'to equal', true)
        expect(tokenStub.called, 'to equal', true)
        expect(cli.stderr, 'to equal', 'Opening browser for login... done\n')
        api.done()
      })
  })

  it('logs in via sso org prompt when cannot open', function () {
    let orgStub = stubPrompt.withArgs('Enter your organization name').returns(Promise.resolve('myorg'))

    let url = 'https://sso.heroku.com/saml/myorg/init?cli=true'
    let urlStub = stubOpen.withArgs(url).returns(Promise.reject(new Error('cannot open')))

    let tokenStub = stubPrompt.withArgs('Enter your access token (typing will be hidden)', {hide: true}).returns(Promise.resolve('token'))
    let headers = {Authorization: 'Bearer token'}

    let api = nock('https://api.heroku.com', {reqheaders: headers})
      .get('/account')
      .reply(200, {email: 'foo@bar.com'})

    return auth.login({sso: true})
      .then((auth) => {
        expect(orgStub.called, 'to equal', true)
        expect(urlStub.called, 'to equal', true)
        expect(tokenStub.called, 'to equal', true)
        expect(cli.stderr, 'to equal', 'Opening browser for login... done\ncannot open\n')
        api.done()
        expect(auth, 'to equal', {token: 'token', email: 'foo@bar.com'})
      })
  })

  context('win shells that are not tty', () => {
    it('recommends using cmd.exe on windows', () => {
      stubPrompt.withArgs('Email').returns(Promise.resolve('email'))
      stubPrompt.withArgs('Password', {hide: true}).returns(Promise.reject(new PromptMaskError('CLI needs to prompt for Login but stdin is not a tty.')))
      os.platform = sinon.stub().returns('win32')
      return expect(auth.login(), 'to be rejected with', 'Login is currently incompatible with git bash/Cygwin/MinGW')
    })
  })
})
