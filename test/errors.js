'use strict';

require('chai').should();
var cli = require('..');

describe('errors', function () {
  beforeEach(function () {
    cli.console.mock();
  });

  it('prints out errors', function () {
    cli.error('foobar');
    cli.console.stderr.should.contain(' !    foobar\n');
  });

  it('prints out warnings', function () {
    cli.warn('foobar');
    cli.console.stderr.should.contain(' !    foobar\n');
  });
});
