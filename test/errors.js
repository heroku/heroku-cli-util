'use strict';

describe('errors', function () {
  it('prints out errors', function () {
    cli.error('foobar');
    cli.color.stripColor(cli.stderr).should.contain(' ▸    foobar\n');
  });

  it('prints out warnings', function () {
    cli.warn('foobar');
    cli.color.stripColor(cli.stderr).should.contain(' ▸    foobar\n');
  });
});
