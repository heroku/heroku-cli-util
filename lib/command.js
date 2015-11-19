'use strict';

let co      = require('co');
let Heroku  = require('heroku-client');
let cli     = require('..');
let url     = require('url');
let spawn   = require('child_process').spawn;
let exec    = require('child_process').exec;

function apiMiddleware (response, cb) {
  let warning = response.headers['warning-message'];
  if (warning) cli.warn(warning);
  cb();
}

function heroku (context) {
  let host = context.apiUrl || 'https://api.heroku.com';
  let opts = {
    userAgent:           context.version,
    debug:               context.debug,
    debugHeaders:        context.debugHeaders,
    token:               context.auth ? context.auth.password : null,
    host:                host,
    headers:             {},
    rejectUnauthorized:  !(process.env.HEROKU_SSL_VERIFY === 'disable' || host.endsWith('herokudev.com')),
    middleware:          apiMiddleware,
  };
  if (process.env.HEROKU_HEADERS) {
    opts.headers = cli.extend(opts.headers, JSON.parse(process.env.HEROKU_HEADERS));
  }
  if (context.secondFactor) {
    opts.headers = cli.extend(opts.headers, {'Heroku-Two-Factor-Code': context.secondFactor});
  }
  if (context.reason) {
    opts.headers = cli.extend(opts.headers, {'X-Heroku-Sudo-Reason': context.reason});
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
  let cmd = null;
  if (context.command) cmd = context.command.command ? `${context.command.topic}:${context.command.command}` : context.command.topic;
  return {
    debug:   context.debug,
    dev:     context.dev,
    logPath: context.herokuDir ? context.herokuDir+'/error.log' : null,
    rollbar: cli.rollbar(rollbar.cred, {
      version: context.version,
      context: cmd,
    })
  };
}

function login () {
  return new Promise(function (fulfill, error) {
    spawn('heroku', ['login'], {stdio: 'inherit'})
    .on('close', function (e) {
      if (e === 0) fulfill();
      else error(new Error('Authorization failed.'));
    });
  });
}

function getNewAPIKey () {
  return new Promise(function (fulfill, reject) {
    exec('heroku auth:token', function (error, stdout, stderr) {
      if (stderr) console.error(stderr);
      if (error)  reject(error);
      fulfill(stdout.trim());
    });
  });
}

function relogin () {
  if (process.env.HEROKU_API_KEY) {
    cli.error(`API key is currently set by the HEROKU_API_KEY environment variable.
Ensure this is set to a correct value or unset it to use the netrc file.`);
    process.exit(1);
  }
  return login().then(getNewAPIKey);
}

function twoFactorPrompt(options, context) {
  cli.yubikey.enable();
  return cli.prompt('Two-factor code', {mask: true})
  .then(function (secondFactor) {
    cli.yubikey.disable();
    return secondFactor;
  })
  .then(function (secondFactor) {
    if (options.preauth) {
      return cli.preauth(context.app, heroku(context), secondFactor);
    } else {
      context.secondFactor = secondFactor;
    }
  });
}

function reasonPrompt(context) {
  return cli.prompt('Reason')
  .then(function (reason) {
      context.reason = reason;
  });
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
      return co.wrap(fn)(context, heroku(context))
      .catch(function (err) {
        if (err && err.body && err.body.id === 'unauthorized') {
          cli.error(err.body.message || 'Unauthorized');
          relogin()
          .then(apiKey => context.auth = {password: apiKey})
          .then(run)
          .catch(handleErr);
        }
        else if (err && err.body && err.body.id === 'sudo_reason_required') {
          cli.warn(err.body.message);
          reasonPrompt(context).then(run).catch(handleErr);
        }
        else if (err && err.body && err.body.id === 'two_factor') {
          twoFactorPrompt(options, context).then(run).catch(handleErr);
        } else throw err;
      }).catch(handleErr);
    };
    return run();
  };
};
