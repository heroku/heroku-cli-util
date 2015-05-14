'use strict';
global.cli = require('heroku-cli-util');
cli.mockConsole();
cli.config.raiseErrors = true;

let chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));
