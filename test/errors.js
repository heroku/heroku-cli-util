require('chai').should();
var console = require('../console');
var errors = require('../errors');

describe('errors', function () {
  beforeEach(function () {
    console.mock();
  });

  it('prints out errors', function () {
    errors.error('foobar');
    console.stderr.should.contain(' \u001b[41m!\u001b[49m    foobar\n');
  });

  it('prints out warnings', function () {
    errors.warn('foobar');
    console.stderr.should.contain(' \u001b[43m!\u001b[49m    foobar\n');
  });
});
