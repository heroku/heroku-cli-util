'use strict';
let co     = require('co');
let Heroku = require('heroku-client');
let errors = require('./errors');

module.exports = function command (fn) {
  return function (context) {
    process.chdir(context.cwd);
    co(function *() {
      let heroku;
      if (context.auth.password) {
        heroku = new Heroku({token: context.auth.password});
      }
      yield fn(context, heroku);
    }).catch(errors.handleErr(context));
  };
};
