'use strict'

const url = require('url')

class Vars {
  constructor (env) {
    this.env = env
  }

  get host () { return this.env.HEROKU_HOST || 'heroku.com' }
  get apiHost () { return this.host.startsWith('http') ? this.host : `api.${this.host}` }
  get gitHost () {
    if (this.env.HEROKU_GIT_HOST) return this.env.HEROKU_GIT_HOST
    if (this.host.startsWith('http')) {
      const u = url.parse(this.host)
      if (u.host) return u.host
    }
    return this.host
  }
  get httpGitHost () {
    if (this.env.HEROKU_GIT_HOST) return this.env.HEROKU_GIT_HOST
    if (this.host.startsWith('http')) {
      const u = url.parse(this.host)
      if (u.host) return u.host
    }
    return `git.${this.host}`
  }

  get gitPrefixes () {
    return [
      `git@${this.gitHost}:`,
      `ssh://git@${this.gitHost}/`,
      `https://${this.httpGitHost}/`
    ]
  }
}

module.exports = new Vars(process.env)
