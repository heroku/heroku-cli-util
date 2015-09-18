'use strict';

let Heroku  = require('heroku-client');
let cli     = require('..');
let url     = require('url');

function heroku (context) {
  let host = context.apiHost || 'api.heroku.com';
  let opts = {
    userAgent:           context.version,
    debug:               context.debug,
    token:               context.auth ? context.auth.password : null,
    host:                host,
    headers:             {},
    rejectUnauthorized:  !host.endsWith('herokudev.com')
  };
  if (process.env.HEROKU_HEADERS) {
    opts.headers = cli.extend(opts.headers, JSON.parse(process.env.HEROKU_HEADERS));
  }
  if (context.secondFactor) {
    opts.headers = cli.extend(opts.headers, {'Heroku-Two-Factor-Code': context.secondFactor});
  }
  return new Heroku(opts);
}

let httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;

function setupHttpProxy() {
  cli.hush(`proxy set to ${httpsProxy}`);
  let proxy = url.parse(httpsProxy);
  process.env.HEROKU_HTTP_PROXY_HOST = proxy.hostname;
  process.env.HEROKU_HTTP_PROXY_PORT = proxy.port;
}

function errHandlerOpts (rollbar, context) {
  rollbar = rollbar || {};
  return {
    debug:   context.debug,
    dev:     context.dev,
    logPath: context.herokuDir ? context.herokuDir+'/error.log' : null,
    rollbar: cli.rollbar(rollbar.cred, {
      version: context.version,
      context: context.command ? `${context.command.topic}:${context.command.command}` : null,
    })
  };
}

module.exports = function command (options, fn) {
  return function (context) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    if (httpsProxy) { setupHttpProxy(); }
    cli.color.enabled = context.supportsColor;
    let handleErr = cli.errorHandler(errHandlerOpts(options.rollbar, context));
    let run = function () {
      return fn(context, heroku(context))
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
