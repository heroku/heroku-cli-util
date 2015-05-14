'use strict';

let cli   = require('../');
let chalk = require('chalk');

chalk.enabled = cli.config.color === 'false' ? false : cli.config.color;

module.exports = chalk;
