'use strict'

const cli = require('../')
const errors = require('./errors')
const util = require('./util')
const color = require('./color')
const ansi = require('ansi-escapes')

function promptMasked (options) {
  return new Promise(function (resolve, reject) {
    let stdin = process.stdin
    let stderr = process.stderr
    let input = ''
    if (!stdin.isTTY) {
      throw new Error(`Error: CLI needs to prompt for ${options.name || options.prompt} but stdin is not a tty.`)
    }
    stdin.setEncoding('utf8')
    stderr.write(ansi.eraseLine)
    stderr.write(ansi.cursorLeft)
    stderr.write(options.prompt)
    stdin.resume()
    stdin.setRawMode(true)

    function stop () {
      if (!options.hide) {
        stderr.write(
          ansi.cursorHide +
            ansi.cursorLeft +
            options.prompt +
            input.replace(/./g, '*') +
            '\n' +
            ansi.cursorShow)
      } else {
        stderr.write('\n')
      }
      stdin.removeListener('data', fn)
      stdin.setRawMode(false)
      stdin.pause()
    }

    function enter () {
      if (input.length === 0) return
      stop()
      resolve(input)
    }

    function ctrlc () {
      reject('')
      stop()
    }

    function backspace () {
      if (input.length === 0) return
      input = input.substr(0, input.length - 1)
      stderr.write(ansi.cursorBackward(1))
      stderr.write(ansi.eraseEndLine)
    }

    function newchar (c) {
      input += c
      stderr.write(options.hide ? '*' : c)
    }

    let fn = function (c) {
      switch (c) {
        case '\u0004': // Ctrl-d
        case '\r':
        case '\n':
          return enter()
        case '\u0003': // Ctrl-c
          return ctrlc()
        default:
          // backspace
          if (c.charCodeAt(0) === 127) return backspace()
          else return newchar(c)
      }
    }
    stdin.on('data', fn)
  })
}

function prompt (name, options) {
  options = options || {}
  options.name = name
  options.prompt = name ? color.gray(`${name}: `) : color.gray('> ')
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
