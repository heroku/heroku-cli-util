'use strict'

let cli = require('../')
let errors = require('./errors')
let util = require('./util')

function promptMasked (options) {
  function refresh (input, mask) {
    process.stderr.clearLine()
    process.stderr.cursorTo(0)
    process.stderr.write(options.prompt + (mask ? input.replace(/./g, '*') : input))
  }

  function start () {
    process.stdin.setEncoding('utf8')
    process.stderr.write(options.prompt)
    process.stdin.resume()
    if (!process.stdin.isTTY) {
      throw new Error(`need to prompt for ${options.name || options.prompt} but stdin is not a tty`)
    }
    process.stdin.setRawMode(true)
  }

  function stop () {
    console.error()
    process.stdin.setRawMode(false)
    process.stdin.pause()
  }

  return new Promise(function (resolve, reject) {
    start()
    let input = ''
    let fn = function (c) {
      switch (c) {
        case '\u0004': // Ctrl-d
        case '\r':
        case '\n':
          if (input.length === 0) return
          refresh(input, true)
          stop()
          process.stdin.removeListener('data', fn)
          resolve(input)
          return
        case '\u0003':
          // Ctrl-c
          reject('')
          stop()
          process.stdin.removeListener('data', fn)
          return
        default:
          // backspace
          if (c.charCodeAt(0) === 127) input = input.substr(0, input.length - 1)
          else input += c
          refresh(input, options.hide)
          return
      }
    }
    process.stdin.on('data', fn)
  })
}

function prompt (name, options) {
  options = options || {}
  options.prompt = name ? name + ': ' : '> '
  if (options.mask || options.hide) return promptMasked(options)
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
      message = `WARNING: Destructive Action\nThis command will affect the app ${cli.color.bold.red(app)}`
    }
    errors.warn(message)
    errors.warn(`To proceed, type ${cli.color.bold.red(app)} or re-run this command with ${cli.color.bold.red('--confirm', app)}`)
    console.error()
    prompt().then(function (confirm) {
      if (confirm === app) { return resolve() }
      return reject(`Confirmation did not match ${cli.color.bold.red(app)}. Aborted.`)
    })
  })
}

exports.prompt = util.promiseOrCallback(prompt)
exports.confirmApp = util.promiseOrCallback(confirmApp)
