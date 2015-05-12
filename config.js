'use strict';

let config = require('rc')('heroku', {
  color:  true
});

config.host          = process.env.HEROKU_HOST || 'heroku.com';
config.git_host      = process.env.HEROKU_GIT_HOST || config.host;
config.http_git_host = process.env.HEROKU_HTTP_GIT_HOST || 'git.' + config.host;

module.exports = config;
