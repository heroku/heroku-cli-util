'use strict';

global.cli    = require('..');
global.expect = require('chai').expect;

cli.mockConsole();
cli.raiseErrors = true;
