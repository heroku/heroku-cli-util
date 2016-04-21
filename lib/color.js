'use strict';

let _ = require('lodash');
let chalk = require('chalk');

let colors = {
  attachment: 'cyan',
  addon: 'yellow',
  configVar: 'green'
};

let definedColors = _.pickBy(colors, function(value) {
  return typeof(chalk[value]) === 'function';
});

let boundColors = _.mapValues(definedColors, v => s => chalk[v](s));

boundColors.release = s => chalk.blue.bold(s);
boundColors.cmd = s => chalk.cyan.bold(s);

boundColors.heroku = s => {
  if (!chalk.enabled) return s;
  let supports = require('supports-color');
  if (!supports) return s;
  supports.has256 = supports.has256 || (process.env.TERM || '').indexOf('256') !== -1;
  return supports.has256 ? '\u001b[38;5;104m'+s+chalk.styles.modifiers.reset.open : chalk.magenta(s);
};

boundColors.app = s => chalk.enabled && process.platform !== 'win32' ? boundColors.heroku(`⬢ ${s}`) : boundColors.heroku(s);


module.exports = Object.assign(chalk, boundColors);
