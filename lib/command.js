'use strict'
/* globals context */

let cli = require('..')

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
        return cli.preauth(context.app, secondFactor)
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
  return function () {
    if (typeof options === 'function') [fn, options] = [options, {}]
    cli.color.enabled = context.supportsColor
    let handleErr = cli.errorHandler(errHandlerOpts(options.rollbar, context))
    let run = function () {
      let p = fn(context, cli.heroku)
      if (!p.catch) return
      return p.catch(function (err) {
        if (err && err.body && err.body.id === 'unauthorized') {
          cli.error(err.body.message || 'Unauthorized')
          relogin()
            .then(apiKey => { cli.heroku.token = context.auth = {password: apiKey} })
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
