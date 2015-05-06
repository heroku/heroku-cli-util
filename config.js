'use strict';

const defaultHost = 'heroku.com';

function host () {
  return process.env.HEROKU_HOST || defaultHost;
}

function gitHost () {
  return process.env.HEROKU_GIT_HOST || host();
}

function httpGitHost () {
  return process.env.HEROKU_HTTP_GIT_HOST || `git.${host()}`;
}

exports.defaultHost = defaultHost;
exports.host = host;
exports.gitHost = gitHost;
exports.httpGitHost = httpGitHost;
