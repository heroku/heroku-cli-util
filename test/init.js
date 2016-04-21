'use strict';

global.cli    = require('..');
global.expect = require('chai').expect;
global.sinon  = require('sinon');

cli.mockConsole();
cli.raiseErrors = true;
