'use strict';

describe('errors', function () {
  it('prints out errors', function () {
    cli.error('foobar');
    cli.stderr.should.contain(' !    foobar\n');
  });

  it('prints out warnings', function () {
    cli.warn('foobar');
    cli.stderr.should.contain(' !    foobar\n');
  });
});
