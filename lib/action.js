'use strict';

let cli = require('..');

let task;

function action (message, options, promise) {
  if (options.then) {
    let swap = promise;
    promise = options;
    options = swap;
  }
  options = options || {};

  task = {
    promise: promise,
    spinner: new cli.Spinner({spinner: options.spinner, text: `${message}... `}),
  };

  task.spinner.start();
  return promise.then(function (result) {
    task.spinner.stop();
    task = null;
    if (options.success !== false) {
      cli.console.error(options.success || 'done');
    }
    return result;
  }).catch(function (err) {
    task.spinner.stop();
    task = null;
    if (err.body && err.body.id === 'two_factor') {
      cli.console.error(cli.color.yellow.bold('!'));
    } else {
      cli.console.error(cli.color.red.bold('!!!'));
    }
    throw err;
  });
}

function warn (msg) {
  if (!task) return cli.warn(msg);
  task.spinner.stop();
  task.spinner.clear();
  cli.warn(msg);
  task.spinner.start();
}

module.exports      = action;
module.exports.warn = warn;
