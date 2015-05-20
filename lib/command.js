'use strict';

let co      = require('co');
let Heroku  = require('heroku-client');
let cli     = require('..');
let url     = require('url');

function heroku (context) {
  let opts = {
    userAgent:           context.version,
    debug:               context.debug,
    token:               context.auth ? context.auth.password : null,
    host:                cli.config.api_host,
    rejectUnauthorized:  !cli.config.api_host.endsWith('herokudev.com'),
  };
  if (context.secondFactor) {
    opts.headers = {'Heroku-Two-Factor-Code': context.secondFactor};
  }
  return new Heroku(opts);
}

function setupHttpProxy() {
  if (!process.env.HTTP_PROXY) { return; }
  let proxy = url.parse(process.env.HTTP_PROXY);
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
    if (!context.supportsColor) {
      // TODO: parse the ini file in heroku-cli
      cli.color.enabled = false;
    }
    let logPath = context.herokuDir ? context.herokuDir+'/error.log' : null;
    let handleErr = cli.errorHandler({logPath: logPath});
    let run = function () {
      return co.wrap(fn)(context, heroku(context))
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
    return run();
  };
};
