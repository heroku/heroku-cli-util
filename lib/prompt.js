'use strict'

const cli = require('../')
const errors = require('./errors')
const util = require('./util')
const color = require('./color')

function prompt (name, options) {
  const password = require('password-prompt')
  options = options || {}
  options.name = name
  options.prompt = name ? color.gray(`${name}: `) : color.gray('> ')
  if (options.mask || options.hide) return password(options.prompt, options)
  return new Promise(function (resolve) {
    process.stdin.setEncoding('utf8')
    process.stderr.write(options.prompt)
    process.stdin.resume()
    process.stdin.once('data', function (data) {
      process.stdin.pause()
      data = data.trim()
      if (data === '') {
        resolve(prompt(name))
      } else {
        resolve(data)
      }
    })
  })
}

function confirmApp (app, confirm, message) {
  return new Promise(function (resolve, reject) {
    if (confirm) {
      if (confirm === app) return resolve()
      return reject(`Confirmation ${cli.color.bold.red(confirm)} did not match ${cli.color.bold.red(app)}. Aborted.`)
    }
    if (!message) {
      message = `WARNING: Destructive Action
This command will affect the app ${cli.color.bold.red(app)}`
    }
    errors.warn(message)
    errors.warn(`To proceed, type ${cli.color.bold.red(app)} or re-run this command with ${cli.color.bold.red('--confirm', app)}`)
    console.error()
    prompt().then(function (confirm) {
      if (confirm === app) {
        return resolve()
      }
      return reject(`Confirmation did not match ${cli.color.bold.red(app)}. Aborted.`)
    })
  })
}

exports.prompt = util.promiseOrCallback(prompt)
exports.confirmApp = util.promiseOrCallback(confirmApp)
