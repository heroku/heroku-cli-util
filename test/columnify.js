require('chai').should();
var cli = require('../');

describe('columns', function () {
  beforeEach(function () {
    cli.console.mock();
  });

  it('prints out data in columns', function () {
    cli.columnify({foo: 1, bar: 2});
    cli.console.stdout.should.contain('foo 1\nbar 2\n');
  });
});
