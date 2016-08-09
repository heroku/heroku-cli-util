'use strict'

module.exports = function () {
  const Heroku = require('heroku-client')
  let token = module.exports.token()
  if (token) {
    this.auth = {password: token}
    this.heroku = new Heroku({token})
  } else {
    return module.exports.login()
  }
}

module.exports.token = function () {
  if (process.env.HEROKU_API_KEY) return process.env.HEROKU_API_KEY
  const Netrc = require('netrc')
  let api = Netrc()['api.heroku.com']
  if (api) return api.password
}

module.exports.login = function () {
  const Netrc = require('netrc')
  const login = require('./login')
  const Heroku = require('heroku-client')

  return login()
    .then(creds => {
      this.auth = {password: creds.access_token.token}
      this.heroku = new Heroku({auth: this.auth.password})
      let netrc = Netrc()
      netrc['git.heroku.com'] = netrc['api.heroku.com'] = {login: creds.user.email, password: this.auth.password}
      Netrc.save(netrc)
    })
}

module.exports.clear = function () {
  const Netrc = require('netrc')
  let netrc = Netrc()
  delete netrc['api.heroku.com']
  delete netrc['git.heroku.com']
  Netrc.save(netrc)
  this.auth = null
}
