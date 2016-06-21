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
  })
}

function * login () {
  const {prompt} = require('./prompt')

  console.log('Enter your Heroku credentials:')
  let email = yield prompt('Email')
  let password = yield prompt('Password', {hide: true})

  try {
    return yield createOAuthToken(email, password)
  } catch (err) {
    if (err.body && err.body.id !== 'two_factor') throw err
    let secondFactor = yield prompt('Two-factor code', {mask: true})
    return yield createOAuthToken(email, password, secondFactor)
  }
}

module.exports = co.wrap(login)
