'use strict';

let expect = require('chai').expect;

describe('action', function () {
  beforeEach(() => cli.mockConsole());

  it('shows message', function () {
    return cli.action('foobar', Promise.resolve())
    .then(() => expect(cli.stderr).to.equal('foobar... done\n'));
  });
});
