'use strict';
var chalk = require('chalk');
var console = require('./console');

function error (msg) {
  console.error(' ' + chalk.bgRed('!') + '    ' + msg);
}

function warn (msg) {
  console.error(' ' + chalk.bgYellow('!')  + '    ' + msg);
}

module.exports.error = error;
module.exports.warn  = warn;
