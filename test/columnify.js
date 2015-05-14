describe('columns', function () {
  it('prints out data in columns', function () {
    cli.columnify({foo: 1, bar: 2});
    cli.stdout.should.contain('foo 1\nbar 2\n');
  });
});
