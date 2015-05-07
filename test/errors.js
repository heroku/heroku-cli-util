require('chai').should();
var console = require('../console');
var errors = require('../errors');

describe('errors', function () {
  beforeEach(function () {
    console.mock();
  });

  it('prints out errors', function () {
    errors.error('foobar');
    console.stderr.should.contain(' !    foobar\n');
  });

  it('prints out warnings', function () {
    errors.warn('foobar');
    console.stderr.should.contain(' !    foobar\n');
  });
});
