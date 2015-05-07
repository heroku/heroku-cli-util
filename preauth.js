'use strict';
let prompt = require('./prompt');
let util   = require('./util');

function preauth (app, heroku) {
  return new Promise(function (fulfill, reject) {
    prompt.prompt('Two-factor code', {mask: true}).then(function (second_factor) {
      fulfill(heroku.request({
        method: 'PUT',
        path:   `/apps/${app}/pre-authorizations`,
        headers: {
          'Heroku-Two-Factor-Code': second_factor
        }
      }));
    }).catch(reject);
  });
}

module.exports = util.promiseOrCallback(preauth);
