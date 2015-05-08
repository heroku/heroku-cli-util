'use strict';

let config = require('rc')('heroku', {
  color:          true,
  host:           'heroku.com',
  git_host:       'heroku.com',
  http_git_host:  'git.heroku.com',
});

module.exports = config;
