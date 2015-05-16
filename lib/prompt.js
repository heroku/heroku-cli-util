'use strict';

let cli    = require('../');
let errors = require('./errors');
let util   = require('./util');


function promptMasked (options) {
  return new Promise(function (fulfill, reject) {
    process.stdin.setEncoding('utf8');
    process.stderr.write(options.prompt);
    process.stdin.resume();
    process.stdin.setRawMode(true);
    let input = '';
    process.stdin.on('data', function (c) {
      switch(c) {
      case "\u0004":
      case "\r":
      case "\n":
        if (input.length === 0) { return; }
        if (options.mask) {
          process.stderr.clearLine();
          process.stderr.cursorTo(0);
          process.stderr.write(options.prompt + input.replace(/./g, '*'));
        }
        console.error();
        process.stdin.setRawMode(false);
        process.stdin.pause();
        fulfill(input);
        return;
      case "\u0003":
        // Ctrl-c
        console.error();
        reject('');
        return;
      default:
        if (c.charCodeAt(0) === 127) {
          // backspace
          input = input.substr(0, input.length-1);
          process.stderr.clearLine();
          process.stderr.cursorTo(0);
          if (options.mask) {
            process.stderr.write(options.prompt + input);
          } else {
            process.stderr.write(options.prompt + input.replace(/./g, '*'));
          }
          return;
        }
        process.stderr.write(options.mask ? c : '*');
        input += c;
        return;
      }
    });
  });
}

function prompt (name, options) {
  options = options || {};
  options.prompt = name ? name + ': ' : '> ';
  if (options.mask || options.hide) {
    return promptMasked(options);
  }
  return new Promise(function (fulfill) {
    process.stdin.setEncoding('utf8');
    process.stderr.write(options.prompt);
    process.stdin.resume();
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
      return reject(`Confirmation ${cli.color.bold.red(confirm)} did not match ${cli.color.bold.red(app)}. Aborted.`);
    }
    if (!message) {
      message = `WARNING: Destructive Action\nThis command will affect the app ${cli.color.bold.red(app)}`;
    }
    errors.warn(message);
    errors.warn(`To proceed, type ${cli.color.bold.red(app)} or re-run this command with ${cli.color.bold.red('--confirm', app)}`);
    console.error();
    prompt().then(function (confirm) {
      if (confirm === app) {
        return fulfill();
      }
      return reject(`Confirmation did not match ${cli.color.bold.red(app)}. Aborted.`);
    });
  });
}

exports.prompt = util.promiseOrCallback(prompt);
exports.confirmApp = util.promiseOrCallback(confirmApp);
