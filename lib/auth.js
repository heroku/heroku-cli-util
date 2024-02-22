'use strict'

const cli = require('..')
const vars = require('./vars')

function basicAuth (username, password) {
  let auth = [username, password].join(':')
  auth = Buffer.from(auth).toString('base64')
  return `Basic ${auth}`
}

function createOAuthToken (username, password, expiresIn, secondFactor) {
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
      expires_in: expiresIn || 60 * 60 * 24 * 365 // 1 year
    }
  }).then(function (auth) {
    return { token: auth.access_token.token, email: auth.user.email, expires_in: auth.access_token.expires_in }
  })
}

function saveToken ({ email, token }) {
  const netrc = require('netrc-parser').default
  netrc.loadSync()
  const hosts = [vars.apiHost, vars.httpGitHost]
  hosts.forEach(host => {
    if (!netrc.machines[host]) netrc.machines[host] = {}
    netrc.machines[host].login = email
    netrc.machines[host].password = token
  })
  if (netrc.machines._tokens) {
    netrc.machines._tokens.forEach(token => {
      if (hosts.includes(token.host)) {
        token.internalWhitespace = '\n  '
      }
    })
  }
  netrc.saveSync()
}

async function loginUserPass ({ save, expires_in: expiresIn }) {
  const { prompt } = require('./prompt')

  cli.log('Enter your Heroku credentials:')
  let email = await prompt('Email')
  let password = await prompt('Password', { hide: true })

  let auth
  try {
    auth = await createOAuthToken(email, password, expiresIn)
  } catch (err) {
    if (!err.body || err.body.id !== 'two_factor') throw err
    let secondFactor = await prompt('Two-factor code', { mask: true })
    auth = await createOAuthToken(email, password, expiresIn, secondFactor)
  }
  if (save) saveToken(auth)
  return auth
}

async function loginSSO ({ save, browser }) {
  const { prompt } = require('./prompt')

  let url = process.env['SSO_URL']
  if (!url) {
    let org = process.env['HEROKU_ORGANIZATION']
    if (!org) {
      org = await prompt('Enter your organization name')
    }
    url = `https://sso.heroku.com/saml/${encodeURIComponent(org)}/init?cli=true`
  }

  const open = require('./open')

  let openError
  await cli.action('Opening browser for login', open(url, browser)
    .catch(function (err) {
      openError = err
    })
  )

  if (openError) {
    cli.console.error(openError.message)
  }

  let token = await prompt('Enter your access token (typing will be hidden)', { hide: true })

  let account = await cli.heroku.get('/account', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (save) saveToken({ token, email: account.email })
  return { token: token, email: account.email }
}

async function logout () {
  let token = cli.heroku.options.token
  if (token) {
    // for SSO logins we delete the session since those do not show up in
    // authorizations because they are created a trusted client
    let sessionsP = cli.heroku.delete('/oauth/sessions/~')
      .catch(err => {
        if (err.statusCode === 404 && err.body && err.body.id === 'not_found' && err.body.resource === 'session') {
          return null
        }
        if (err.statusCode === 401 && err.body && err.body.id === 'unauthorized') {
          return null
        }
        throw err
      })

    // grab the default authorization because that is the token shown in the
    // dashboard as API Key and they may be using it for something else and we
    // would unwittingly break an integration that they are depending on
    let defaultAuthorizationP = cli.heroku.get('/oauth/authorizations/~')
      .catch(err => {
        if (err.statusCode === 404 && err.body && err.body.id === 'not_found' && err.body.resource === 'authorization') {
          return null
        }
        if (err.statusCode === 401 && err.body && err.body.id === 'unauthorized') {
          return null
        }
        throw err
      })

    // grab all the authorizations so that we can delete the token they are
    // using in the CLI.  we have to do this rather than delete ~ because
    // the ~ is the API Key, not the authorization that is currently requesting
    let authorizationsP = cli.heroku.get('/oauth/authorizations')
      .catch(err => {
        if (err.statusCode === 401 && err.body && err.body.id === 'unauthorized') {
          return []
        }
        throw err
      })

    let [, defaultAuthorization, authorizations] = await Promise.all([sessionsP, defaultAuthorizationP, authorizationsP])

    if (accessToken(defaultAuthorization) !== token) {
      for (let authorization of authorizations) {
        if (accessToken(authorization) === token) {
          // remove the matching access token from core services
          await cli.heroku.delete(`/oauth/authorizations/${authorization.id}`)
        }
      }
    }
  }

  const netrc = require('netrc-parser').default
  netrc.loadSync()
  if (netrc.machines[vars.apiHost]) {
    netrc.machines[vars.apiHost] = undefined
  }
  if (netrc.machines[vars.httpGitHost]) {
    netrc.machines[vars.httpGitHost] = undefined
  }
  netrc.saveSync()
}

function accessToken (authorization) {
  return authorization && authorization.access_token && authorization.access_token.token
}

async function login (options = {}) {
  if (!options.skipLogout) await logout()

  try {
    if (options['sso']) {
      return await loginSSO(options)
    } else {
      return await loginUserPass(options)
    }
  } catch (e) {
    const { PromptMaskError } = require('./prompt')
    const os = require('os')
    if (e instanceof PromptMaskError && os.platform() === 'win32') {
      throw new PromptMaskError('Login is currently incompatible with git bash/Cygwin/MinGW')
    } else {
      throw e
    }
  }
}

function token () {
  const netrc = require('netrc-parser').default
  netrc.loadSync()
  if (process.env.HEROKU_API_KEY) return process.env.HEROKU_API_KEY
  return netrc.machines[vars.apiHost] && netrc.machines[vars.apiHost].password
}

module.exports = {
  login: login,
  logout: logout,
  token
}
