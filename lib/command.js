'use strict';

let co      = require('co');
let Heroku  = require('heroku-client');
let cli     = require('../');
let url     = require('url');

function heroku (context) {
  if (!context.auth || !context.auth.password) {
    return 'set `needsApp: true` on the command';
  }
  let opts = {
    debug:  context.debug,
    token:  context.auth.password,
  };
  if (context.secondFactor) {
    opts.headers = {'Heroku-Two-Factor-Code': context.secondFactor};
  }
  return new Heroku(opts);
}

function setupHttpProxy() {
  if (!process.env.HTTPS_PROXY) { return; }
  let proxy = url.parse(process.env.HTTPS_PROXY);
  process.env.HEROKU_HTTP_PROXY_HOST = proxy.hostname;
  process.env.HEROKU_HTTP_PROXY_PORT = proxy.port;
}

module.exports = function command (options, fn) {
  return function (context) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    setupHttpProxy();
    let handleErr = cli.errorHandler({logPath: context.herokuDir+'/error.log'});
    let run = function () {
      co.wrap(fn)(context, heroku(context))
      .catch(function (err) {
        if (err && err.body && err.body.id === 'two_factor') {
          cli.prompt('Two-factor code', {mask: true})
          .then(function (secondFactor) {
            if (options.preauth) {
              return cli.preauth(context.app, heroku(context), secondFactor);
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
