'use strict';

let cli = require('..');

function action (message, options, promise) {
  if (options.then) {
    let swap = promise;
    promise = options;
    options = swap;
  }
  options = options || {};
  cli.console.writeError(message + '... ');
  return promise.then(function (result) {
    if (options.success !== false) {
      cli.console.error(options.success || 'done');
    }
    return result;
  }).catch(function (err) {
    if (err.body && err.body.id === 'two_factor') {
      cli.console.error(cli.color.yellow.bold('!'));
    } else {
      cli.console.error(cli.color.red.bold('!!!'));
    }
    throw err;
  });
}

module.exports = action;
