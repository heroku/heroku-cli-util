'use strict';

function promiseOrCallback(fn) {
  return function () {
    if (typeof arguments[arguments.length-1] === 'function') {
      let args = Array.prototype.slice.call(arguments);
      let callback = args.pop();
      fn.apply(null, args).then(function () {
        let args = Array.prototype.slice.call(arguments);
        args.unshift(null);
        callback.apply(null, args);
      }).catch(function (err) {
        callback.call(null, err);
      });
    } else {
      return fn.apply(null, arguments);
    }
  };
}

exports.promiseOrCallback = promiseOrCallback;
