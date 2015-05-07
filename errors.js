'use strict';
var console = require('./console');
const BANG = ' !     ';

function wrap (msg) {
  return BANG + msg.split('\n').join('\n' + BANG);
}

function error (msg) {
  console.error(wrap(msg));
}

function warn (msg) {
  console.error(wrap(msg));
}

function handleErr (context) {
  return function (err) {
    if (err.body) {
      // API error
      if (err.body.message) {
        error(err.body.message);
      } else if (err.body.error) {
        error(err.body.error);
      }
    } else {
      // Unhandled error
      if (err.message) {
        error(err.message);
      } else {
        error(err);
      }
      if (err.stack) {
        var logPath = context.herokuDir + '/error.log';
        var fs = require('fs');
        var log = function (line) {
          var d = new Date().toISOString()
          .replace(/T/, ' ')
          .replace(/-/g, '/')
          .replace(/\..+/, '');
          fs.appendFileSync(logPath, d + ' ' + line + '\n');
        };
        log(err.stack);
        error(`See ${logPath}` + logPath + ' for more info.');
      }
    }
    process.exit(1);
  };
}

module.exports.error     = error;
module.exports.warn      = warn;
module.exports.handleErr = handleErr;
