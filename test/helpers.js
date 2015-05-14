'use strict';
global.cli = require('..');
cli.mockConsole();
cli.config.raiseErrors = true;

let chai = require('chai');
chai.should();
