'use strict';

let chalk  = require('chalk');
let errors = require('./errors');
let util   = require('./util');

function prompt (name) {
  return new Promise(function (fulfill) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stderr.write(name ? name + ': ' : '> ');
    process.stdin.once('data', function (data) {
      process.stdin.pause();
      data = data.trim();
      if (data === '') {
        fulfill(prompt(name));
      } else {
        fulfill(data);
      }
    });
  });
}

function confirmApp (app, confirm, message) {
  return new Promise(function (fulfill, reject) {
    if (confirm) {
      if (confirm === app) {
        return fulfill();
      }
      return reject(`Confirmation ${chalk.bold.red(confirm)} did not match ${chalk.bold.red(app)}. Aborted.`);
    }
    if (!message) {
      message = `WARNING: Destructive Action\nThis command will affect the app ${chalk.bold.red(app)}`;
    }
    errors.warn(message);
    errors.warn(`To proceed, type ${chalk.bold.red(app)} or re-run this command with ${chalk.bold.red('--confirm ' + app)}`);
    console.error();
    prompt().then(function (confirm) {
      if (confirm === app) {
        return fulfill();
      }
      return reject(`Confirmation did not match ${chalk.bold.red(app)}. Aborted.`);
    });
  });
}

exports.prompt = util.promiseOrCallback(prompt);
exports.confirmApp = util.promiseOrCallback(confirmApp);
