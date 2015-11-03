'use strict';

let _ = require('lodash');
let chalk = require('chalk');

let colors = {
  app: 'cyan',
  attachment: 'green',
  addon: 'magenta',
};

let definedColors = _.pick(colors, function(value) {
  return typeof(chalk[value]) === 'function';
});

let boundColors = _.mapValues(definedColors, function(value) {
  return function(s) {
    return chalk[value](s);
  };
});

module.exports = Object.assign(chalk, boundColors);
