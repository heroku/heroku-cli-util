'use strict';

let chalk = require('chalk');

module.exports = Object.assign(chalk, {
  app: chalk.cyan,
  attachment: chalk.green,
  addon: chalk.magenta,
});
