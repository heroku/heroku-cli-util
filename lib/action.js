'use strict';

let cli = require('..');
let errors = require('./errors');

function action (message, options, promise) {
  if (options.then) {
    let swap = promise;
    promise = options;
    options = swap;
  }
  options = options || {};

  module.exports.task = {
    promise: promise,
    spinner: new cli.Spinner({spinner: options.spinner, text: `${message}... `}),
  };

  module.exports.task.spinner.start();
  return promise.then(function (result) {
    module.exports.task.spinner.stop();
    module.exports.task = null;
    if (options.success !== false) {
      cli.console.error(options.success || 'done');
    }
    return result;
  }).catch(function (err) {
    module.exports.task.spinner.stop();
    module.exports.task = null;
    if (err.body && err.body.id === 'two_factor') {
      cli.console.error(cli.color.yellow.bold('!'));
    } else {
      cli.console.error(cli.color.red.bold('!!!'));
    }
    throw err;
  });
}

function warn (msg) {
  if (module.exports.task) module.exports.task.spinner.warn(msg);
  else errors.warn(msg);
}

function update (msg) {
  if (module.exports.task) module.exports.task.spinner.update(msg);
}

module.exports      = action;
module.exports.warn = warn;
module.exports.update = update;
