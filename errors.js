'use strict';
let console  = require('./console');
let linewrap = require('linewrap');

function wrap (msg) {
  return linewrap(6,
    process.stderr.getWindowSize()[0], {
    skipScheme: 'ansi-color'
  })(msg);
}

function bangify (msg) {
  let lines = msg.split('\n');
  for(let i=0; i<lines.length; i++) {
    let line = lines[i];
    lines[i] = ' !' + line.substr(2,line.length);
  }
  return lines.join('\n');
}

function error (msg) {
  console.error(bangify(wrap(msg)));
}

function warn (msg) {
  console.error(bangify(wrap(msg)));
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
