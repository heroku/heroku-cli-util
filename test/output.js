require('chai').should();
var console = require('../console');
var output = require('../output');

describe('output', function () {
  beforeEach(function () {
    console.mock();
  });

  it('prints out errors', function () {
    output.error('foobar');
    console.stderr.should.contain('\u001b[31m !    foobar\u001b[39m');
  });
});
