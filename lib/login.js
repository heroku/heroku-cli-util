'use strict'

const co = require('co')
const cli = require('..')

function basicAuth (username, password) {
  let auth = [username, password].join(':')
  auth = new Buffer(auth).toString('base64')
  return `Basic ${auth}`
}

function createOAuthToken (username, password, secondFactor) {
  const os = require('os')

  let headers = {
    Authorization: basicAuth(username, password)
  }

  if (secondFactor) headers['Heroku-Two-Factor-Code'] = secondFactor

  return cli.heroku.post('/oauth/authorizations', {
    headers,
    body: {
      scope: ['global'],
      description: `Heroku CLI login from ${os.hostname()} at ${new Date()}`,
      expires_in: 60 * 60 * 24 * 365 // 1 year
    }
  }).then(function (auth) {
    return {token: auth.access_token.token, email: auth.user.email}
  })
}

function * loginUserPass () {
  const {prompt} = require('./prompt')

  cli.log('Enter your Heroku credentials:')
  let email = yield prompt('Email')
  let password = yield prompt('Password', {hide: true})

  try {
    return yield createOAuthToken(email, password)
  } catch (err) {
    if (!err.body || err.body.id !== 'two_factor') throw err
    let secondFactor = yield prompt('Two-factor code', {mask: true})
    return yield createOAuthToken(email, password, secondFactor)
  }
}

function * loginSSO () {
  const {prompt} = require('./prompt')

  let url = process.env['SSO_URL']
  if (!url) {
    let org = process.env['HEROKU_ORGANIZATION']
    if (!org) {
      org = yield prompt('Enter your organization name')
    }
    url = `https://sso.heroku.com/saml/${encodeURIComponent(org)}/init?cli=true`
  }

  const open = require('./open')

  let openError
  yield cli.action('Opening browser for login', open(url)
    .catch(function (err) {
      openError = err
    })
  )

  if (openError) {
    cli.console.error(openError.message)
  }

  let token = yield prompt('Enter your access token (typing will be hidden)', {hide: true})

  let account = yield cli.heroku.get('/account', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return {token: token, email: account.email}
}

function * login (options = {}) {
  if (options['sso']) {
    return yield loginSSO()
  } else {
    return yield loginUserPass()
  }
}

module.exports = co.wrap(login)
