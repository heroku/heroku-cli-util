'use strict';

let expect = require('unexpected');

describe('action', function () {
  beforeEach(() => cli.mockConsole());

  it('shows message', function () {
    return cli.action('foobar', Promise.resolve())
    .then(() => expect(cli.stderr, 'to equal', 'foobar... done\n'));
  });

  it('errors', function () {
    return expect(cli.action('foobar', Promise.reject(new Error('oh noes'))),
                  'to be rejected with', {message: 'oh noes'})
    .then(() => expect(cli.stderr, 'to equal', 'foobar... !!!\n'));
  });
});
