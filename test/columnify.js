require('chai').should();
var console = require('../console');
var columnify = require('../columnify');

describe('columns', function () {
  beforeEach(function () {
    console.mock();
  });

  it('prints out data in columns', function () {
    columnify({foo: 1, bar: 2});
    console.stdout.should.contain('foo 1\nbar 2\n');
  });
});
