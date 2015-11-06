'use strict';

let expect = require('chai').expect;

describe('errors', function () {
  beforeEach(() => cli.mockConsole());

  it('prints out errors', function () {
    cli.error('foobar');
    expect(cli.color.stripColor(cli.stderr)).to.equal(' ▸    foobar\n');
  });

  it('prints out warnings', function () {
    cli.warn('foobar');
    expect(cli.color.stripColor(cli.stderr)).to.equal(' ▸    WARNING: foobar\n');
  });
});
