'use strict';
let co     = require('co');
let Heroku = require('heroku-client');

function handleErr(err) {
  if (err.body) {
    if (err.body.message) {
      console.error("\n !  " + err.body.message);
    } else if (err.body.error) {
      console.error("\n !  " + err.body.error);
    }
  } else {
    console.error(err.stack);
  }
  process.exit(1);
}

module.exports = function command (fn) {
  return function (context) {
    co(function *() {
      let heroku;
      if (context.auth.password) {
        heroku = new Heroku({token: context.auth.password});
      }
      yield fn(context, heroku);
    }).catch(handleErr);
  };
};
