'use strict';

let fs   = require('fs');
let path = require('path');
let _    = require('lodash');
let ini  = require('ini');

let home = process.env.HOME || process.env.USERPROFILE || '/root';
let config = {
  color:  true,
  home:   home,
};

try {
  let p = path.join(home, '.herokurc');
  let iniConfig = ini.parse(fs.readFileSync(p, 'utf-8'));
  config = _.assign(config, iniConfig);
} catch (e) {}

config.host          = process.env.HEROKU_HOST || 'heroku.com';
config.git_host      = process.env.HEROKU_GIT_HOST || config.host;
config.http_git_host = process.env.HEROKU_HTTP_GIT_HOST || 'git.' + config.host;

module.exports = config;
