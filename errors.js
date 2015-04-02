'use strict';
var chalk = require('chalk');
var console = require('./console');

function error (msg) {
  console.error(chalk.red(` !    ${msg}`));
}

function warn (msg) {
  console.error(chalk.yellow(` !    ${msg}`));
}

module.exports.error = error;
module.exports.warn  = warn;
