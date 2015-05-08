'use strict';

let h = require('./');
let chalk = require('chalk');

chalk.enabled = h.config.color === 'false' ? false : h.config.color;

module.exports = chalk;
