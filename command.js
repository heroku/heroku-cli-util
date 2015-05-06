'use strict';
let co     = require('co');
let Heroku = require('heroku-client');
let errors = require('./errors');

function handleErr (context) {
  return function (err) {
    if (err.body) {
      // API error
      if (err.body.message) {
        errors.error(err.body.message);
      } else if (err.body.error) {
        errors.error(err.body.error);
      }
    } else {
      // Unhandled error
      if (err.message) {
        errors.error(err.message);
      } else {
        errors.error(err);
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
        errors.error(`See ${logPath}` + logPath + ' for more info.');
      }
    }
    process.exit(1);
  };
}

module.exports = function command (fn) {
  return function (context) {
    process.chdir(context.cwd);
    co(function *() {
      let heroku;
      if (context.auth.password) {
        heroku = new Heroku({token: context.auth.password});
      }
      yield fn(context, heroku);
    }).catch(handleErr(context));
  };
};
