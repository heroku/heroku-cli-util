'use strict';

let console  = require('./console');

function wrap (msg) {
  let linewrap = require('linewrap');
  return linewrap(6,
    process.stderr.getWindowSize()[0], {
    skipScheme: 'ansi-color'
  })(msg || '');
}

function bangify (msg) {
  let lines = msg.split('\n');
  for(let i=0; i<lines.length; i++) {
    let line = lines[i];
    lines[i] = ' !' + line.substr(2,line.length);
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
  console.error(bangify(wrap(getErrorMessage(err))));
}

function warn (msg) {
  console.error(bangify(wrap(msg)));
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
  return function handleErr(err) {
    options = options || {};
    error(err);
    if (options.logPath) {
      if (err.stack) {
        log(err.stack, options.logPath);
      }
      if (err.body) {
        log(JSON.stringify(err.body), options.logPath);
      }
      //error(`See ${options.logPath} for more info.`);
    }
    if (options.exit !== false) {
      process.exit(1);
    }
  };
}

module.exports.error           = error;
module.exports.warn            = warn;
module.exports.errorHandler    = errorHandler;
