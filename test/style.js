'use strict';

let expect = require('chai').expect;
let chalk  = require('chalk');

describe('style', function () {
  beforeEach(function() {
    cli.mockConsole();
  });

  it('app is cyan', function () {
    expect(cli.color.app('myapp')).to.equal(chalk.cyan('myapp'));
  });

  it('attachments is green', function () {
    expect(cli.color.attachment('myattachment')).to.equal(chalk.green('myattachment'));
  });

  it('addon is magenta', function () {
    expect(cli.color.addon('myaddon')).to.equal(chalk.magenta('myaddon'));
  });

  it('proxies all other colors through to chalk', function () {
    expect(cli.color.magenta('myaddon')).to.equal(chalk.magenta('myaddon'));
  });
});
