'use strict';

let cli = require('./');

function context (base) {
  return cli.extend(base, {});
}

function heroku () {
  return {};
}

exports.context = context;
exports.heroku  = heroku;
