'use strict';

var cli = require('..');

var mocking;

/**
 * log is a wrapper for console.log() but can be mocked
 *
 * @param {...Object} obj - objects to be printed to stdout
 */
function log () {
  if (mocking) {
    cli.stdout += Array.prototype.slice.call(arguments, 0).join() + '\n';
  } else {
    console.log.apply(null, arguments);
  }
}

/**
 * log is a wrapper for console.error() but can be mocked
 *
 * @param {...Object} obj - objects to be printed to stderr
 */
function error () {
  if (mocking) {
    cli.stderr += Array.prototype.slice.call(arguments, 0).join() + '\n';
  } else {
    console.error.apply(null, arguments);
  }
}

/**
 * mock will make {@link log} and {@link error}
 * stop printing to stdout and stderr and start writing to the
 * stdout and stderr strings.
 */
function mock () {
  mocking = true;
  cli.stderr = '';
  cli.stdout = '';
}

/**
 * debug pretty prints an object.
 * It simply calls console.dir with color enabled.
 *
 * @param {Object} obj - object to be printed
 */
function debug (obj) {
  console.dir(obj, {colors: true});
}

exports.log   = log;
exports.error = error;
exports.mock  = mock;
exports.debug = debug;
