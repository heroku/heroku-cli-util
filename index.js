'use strict';
var console = require('./lib/console');
var errors  = require('./lib/errors');
var prompt  = require('./lib/prompt');
var styled  = require('./lib/styled');

exports.hush         = console.hush;
exports.log          = console.log.bind(console);
exports.formatDate   = require('./lib/date').formatDate;
exports.error        = errors.error;
exports.warn         = errors.warn;
exports.errorHandler = errors.errorHandler;
exports.console      = console;
exports.prompt       = prompt.prompt;
exports.confirmApp   = prompt.confirmApp;
exports.preauth      = require('./lib/preauth');
exports.command      = require('./lib/command');
exports.color        = require('chalk');
exports.action       = require('./lib/action');
exports.extend       = require('./lib/extend');
exports.debug        = console.debug;
exports.mockConsole  = console.mock;
exports.stdout       = '';
exports.stderr       = '';
exports.styledHeader = styled.styledHeader;
exports.styledHash   = styled.styledHash;
exports.rollbar      = require('./lib/rollbar');
