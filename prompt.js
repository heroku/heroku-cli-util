'use strict';

module.exports = function prompt (name, cb) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stderr.write(`${name}: `);
  process.stdin.once('data', function (data) {
    process.stdin.pause();
    data = data.trim();
    if (data === '') {
      return prompt(name, cb);
    }
    cb(data);
  });
};
