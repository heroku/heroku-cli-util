'use strict'

let Heroku = require('heroku-client')
let cli = require('..')

function apiMiddleware (response, cb) {
  let warning = response.headers['x-heroku-warning'] || response.headers['warning-message']
  if (warning) cli.action.warn(warning)
  cb()
}

function heroku (context) {
  let host = context.apiUrl || 'https://api.heroku.com'
  let opts = {
    userAgent: context.version,
    debug: context.debug,
    debugHeaders: context.debugHeaders,
    token: context.auth ? context.auth.password : null,
    host: host,
    headers: {},
    rejectUnauthorized: !(process.env.HEROKU_SSL_VERIFY === 'disable' || host.endsWith('herokudev.com')),
    middleware: apiMiddleware
  }
  if (process.env.HEROKU_HEADERS) {
    Object.assign(opts.headers, JSON.parse(process.env.HEROKU_HEADERS))
  }
  if (context.secondFactor) {
    Object.assign(opts.headers, {'Heroku-Two-Factor-Code': context.secondFactor})
  }
  if (context.reason) {
    Object.assign(opts.headers, {'X-Heroku-Sudo-Reason': context.reason})
  }
  return new Heroku(opts)
}

let httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy

function setupHttpProxy () {
  const url = require('url')
  cli.hush(`proxy set to ${httpsProxy}`)
  let proxy = url.parse(httpsProxy)
  process.env.HEROKU_HTTP_PROXY_HOST = proxy.hostname
  process.env.HEROKU_HTTP_PROXY_PORT = proxy.port
  process.env.HEROKU_HTTP_PROXY_AUTH = proxy.auth
}

function errHandlerOpts (rollbar, context) {
  rollbar = rollbar || {}
  let cmd = null
  if (context.command) cmd = context.command.command ? `${context.command.topic}:${context.command.command}` : context.command.topic
  return {
    debug: context.debug,
    dev: context.dev,
    rollbar: cli.rollbar(rollbar.cred, {
      version: context.version,
      context: cmd
    })
  }
}

function login () {
  const spawn = require('child_process').spawn
  return new Promise(function (resolve, reject) {
    spawn('heroku', ['login'], {stdio: 'inherit'})
      .on('close', function (e) {
        if (e === 0) resolve()
        else reject(new Error('Authorization failed.'))
      })
  })
}

function getNewAPIKey () {
  const exec = require('child_process').exec
  return new Promise(function (resolve, reject) {
    exec('heroku auth:token', function (error, stdout, stderr) {
      if (stderr) console.error(stderr)
      if (error) reject(error)
      resolve(stdout.trim())
    })
  })
}

function relogin () {
  if (process.env.HEROKU_API_KEY) {
    cli.error(`API key is currently set by the HEROKU_API_KEY environment variable.
Ensure this is set to a correct value or unset it to use the netrc file.`)
    process.exit(1)
  }
  return login().then(getNewAPIKey)
}

function twoFactorPrompt (options, context) {
  cli.yubikey.enable()
  return cli.prompt('Two-factor code', {mask: true})
    .then(function (secondFactor) {
      cli.yubikey.disable()
      return secondFactor
    })
    .then(function (secondFactor) {
      if (options.preauth) {
        return cli.preauth(context.app, heroku(context), secondFactor)
      } else {
        context.secondFactor = secondFactor
      }
    })
}

function reasonPrompt (context) {
  return cli.prompt('Reason')
    .then(function (reason) {
      context.reason = reason
    })
}

module.exports = function command (options, fn) {
  return function (context) {
    if (typeof options === 'function') [fn, options] = [options, {}]
    if (httpsProxy) setupHttpProxy()
    cli.color.enabled = context.supportsColor
    let handleErr = cli.errorHandler(errHandlerOpts(options.rollbar, context))
    let run = function () {
      let p = fn(context, heroku(context))
      if (!p.catch) return
      return p.catch(function (err) {
        if (err && err.body && err.body.id === 'unauthorized') {
          cli.error(err.body.message || 'Unauthorized')
          relogin()
            .then(apiKey => { context.auth = {password: apiKey} })
            .then(run)
            .catch(handleErr)
        } else if (err && err.body && err.body.id === 'sudo_reason_required') {
          cli.warn(err.body.message)
          reasonPrompt(context).then(run).catch(handleErr)
        } else if (err && err.body && err.body.id === 'two_factor') {
          twoFactorPrompt(options, context).then(run).catch(handleErr)
        } else throw err
      }).catch(handleErr)
    }
    return run()
  }
}
