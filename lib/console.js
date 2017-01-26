'use strict'

let cli = require('..')

let mocking

function stdout () {
  return global.herokuStdout || process.stdout
}

function stderr () {
  return global.herokuStderr || process.stderr
}

/**
 * log is a wrapper for console.log() but can be mocked
 *
 * @param {...Object} obj - objects to be printed to stdout
 */
function log (...args) {
  writeLog(...args, '\n')
}

/**
 * writeLog is a wrapper for process.stdout.write() but can be mocked
 *
 * @param {...Object} obj - objects to be printed to stdout
 */
function writeLog (...args) {
  if (mocking) {
    cli.stdout += cli.color.stripColor(args.join(' '))
  } else {
    stdout().write(args.join(''))
  }
}

function hush () {
  let debug = process.env.HEROKU_DEBUG
  if (debug && (debug === '1' || debug.toUpperCase() === 'TRUE')) {
    console.error.apply(null, arguments)
  }
}

/**
 * error is a wrapper for console.error() but can be mocked
 *
 * @param {...Object} obj - objects to be printed to stderr
 */
function error (...args) {
  writeError(...args, '\n')
}

/**
 * writeError is a wrapper for process.stderr.write() but can be mocked
 *
 * @param {...Object} obj - objects to be printed to stderr
 */
function writeError (...args) {
  if (mocking) {
    cli.stderr += cli.color.stripColor(args.join(' '))
  } else {
    stderr().write(args.join(''))
  }
}

/**
 * mock will make {@link log} and {@link error}
 * stop printing to stdout and stderr and start writing to the
 * stdout and stderr strings.
 */
function mock (mock) {
  if (mock === false) {
    mocking = false
  } else {
    mocking = true
    cli.stderr = ''
    cli.stdout = ''
  }
}

/**
 * debug pretty prints an object.
 * It simply calls console.dir with color enabled.
 *
 * @param {Object} obj - object to be printed
 */
function debug (obj) {
  console.dir(obj, {colors: true})
}

exports.hush = hush
exports.log = log
exports.writeLog = writeLog
exports.error = error
exports.writeError = writeError
exports.mock = mock
exports.mocking = () => mocking
exports.debug = debug
