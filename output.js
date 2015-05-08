'use strict';

let h = require('./');

function action (message, promise, options) {
  return new Promise(function (fulfill, reject) {
    options = options || {};
    process.stderr.write(message + '... ');
    promise.then(function (result) {
      if (options.success !== false) {
        console.error(options.success || 'done');
      }
      fulfill(result);
    }).catch(function (err) {
      console.error(h.color.red.bold('!!!'));
      reject(err);
    });
  });
}

exports.action = action;
