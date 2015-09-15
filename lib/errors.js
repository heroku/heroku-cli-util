'use strict';

let cli      = require('..');
let console  = require('./console');
let linewrap = require('./linewrap');

function errtermwidth() {
  if (!process.stderr.isTTY) return 80;
  return process.stderr.getWindowSize()[0];
}

function wrap (msg) {
  return linewrap(6,
    errtermwidth(), {
    skipScheme: 'ansi-color'
  })(msg || '');
}

function bangify (msg, c) {
  let lines = msg.split('\n');
  for(let i=0; i<lines.length; i++) {
    let line = lines[i];
    lines[i] = ' ' + c + line.substr(2,line.length);
  }
  return lines.join('\n');
}

function getErrorMessage (err) {
  if (err.body) {
    // API error
    if (err.body.message) {
      return err.body.message;
    } else if (err.body.error) {
      return err.body.error;
    }
  }
  // Unhandled error
  if (err.message && err.code) {
    return `${err.code}: ${err.message}`;
  } else if (err.message) {
    return err.message;
  }
  return err;
}

function error (err) {
  console.error(bangify(wrap(getErrorMessage(err)), cli.color.red('▸')));
}

function warn (msg) {
  console.error(bangify(wrap(msg), cli.color.yellow('▸')));
}

function logtimestamp() {
  return new Date().toISOString()
  .replace(/T/, ' ')
  .replace(/-/g, '/')
  .replace(/\..+/, '');
}

function log(msg, logPath) {
  let fs = require('fs');
  fs.appendFileSync(logPath, logtimestamp() + ' ' + msg + '\n');
}

function errorHandler(options) {
  options = options || {};
  function exit () {
    if (options.exit !== false) {
      process.exit(1);
    }
  }
  return function handleErr(err) {
    if (cli.raiseErrors) { throw err; }
    try {
      if (err !== '') { error(err); }
      if (options.logPath) {
        if (err.stack) {
          log(err.stack, options.logPath);
          if (options.debug) {
            console.error(err.stack);
          }
        }
        if (err.body) {
          log(JSON.stringify(err.body), options.logPath);
        }
      }
      if (options.dev) exit();
      else if (options.rollbar) options.rollbar.error(err).then(exit, exit);
      else exit();
    } catch (err) {
      console.error(err.stack);
      process.exit(-1);
    }
  };
}

module.exports.error           = error;
module.exports.warn            = warn;
module.exports.errorHandler    = errorHandler;
