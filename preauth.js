'use strict';
let util   = require('./util');

function preauth (app, heroku, secondFactor) {
  return heroku.request({
    method: 'PUT',
    path:   `/apps/${app}/pre-authorizations`,
    headers: { 'Heroku-Two-Factor-Code': secondFactor }
  });
}

module.exports = util.promiseOrCallback(preauth);
