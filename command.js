'use strict';

let co      = require('co');
let Heroku  = require('heroku-client');
let h       = require('./');

function heroku (context) {
  if (!context.auth.password) {
    return 'set `needsApp: true` on the command';
  }
  let opts = {
    log:    context.debug,
    token:  context.auth.password,
  };
  if (context.secondFactor) {
    opts.headers = {'Heroku-Two-Factor-Code': context.secondFactor};
  }
  return new Heroku(opts);
}

module.exports = function command (options, fn) {
  return function (context) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    process.chdir(context.cwd);
    let handleErr = h.errorHandler({logPath: context.herokuDir+'/error.log'});
    let run = function () {
      co.wrap(fn)(context, heroku(context))
      .catch(function (err) {
        if (err && err.body && err.body.id === 'two_factor') {
          h.prompt('Two-factor code', {mask: true})
          .then(function (secondFactor) {
            if (options.preauth) {
              return h.preauth(context.app, heroku(context), secondFactor);
            } else {
              context.secondFactor = secondFactor;
            }
          })
          .then(run)
          .catch(handleErr);
          return;
        }
        throw err;
      }).catch(handleErr);
    };
    run();
  };
};
