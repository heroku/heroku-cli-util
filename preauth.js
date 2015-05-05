'use strict';
let Heroku = require('heroku-client');
let prompt = require('./prompt');

module.exports = function preauth (app, token, cb) {
  prompt('Two-factor code', function (second_factor) {
    let heroku = new Heroku({token: token});
    return heroku.request({
      method: 'PUT',
      path:   `/apps/${app}/pre-authorizations`,
      headers: {
        'Heroku-Two-Factor-Code': second_factor
      }
    }, cb);
  });
};
