'use strict';
let co     = require('co');
let Heroku = require('heroku-client');
let errors = require('./errors');

function handleErr(err) {
  if (err.body) {
    if (err.body.message) {
      errors.error(err.body.message);
    } else if (err.body.error) {
      errors.error(err.body.error);
    }
  } else {
    console.error(err.stack);
  }
  process.exit(1);
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
    }).catch(handleErr);
  };
};
