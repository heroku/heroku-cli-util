'use strict';

let fs     = require('fs');
let path   = require('path');
let ini    = require('ini');
let url    = require('url');
let extend = require('./extend');

let home = process.env.HOME || process.env.USERPROFILE || '/root';
let config = {
  color:  true,
  home:   home,
};

try {
  let p = path.join(home, '.herokurc');
  let iniConfig = ini.parse(fs.readFileSync(p, 'utf-8'));
  config = extend(config, iniConfig);
} catch (e) {}

function apiHost() {
  if (process.env.HEROKU_API_URL) {
    let api = url.parse(process.env.HEROKU_API_URL);
    return api.hostname;
  }
}

config.host          = process.env.HEROKU_HOST || 'heroku.com';
config.api_host      = process.env.HEROKU_API_HOST || apiHost() || 'api.heroku.com';
config.git_host      = process.env.HEROKU_GIT_HOST || config.host;
config.http_git_host = process.env.HEROKU_HTTP_GIT_HOST || 'git.' + config.host;

module.exports = config;
