'use strict';

let Heroku = require('heroku-client');

describe('preauth', function () {
  it('makes a POST to /apps/myapp/pre-authorizations', function (done) {
    let heroku = new Heroku();
    nock('https://api.heroku.com', {
      reqheaders: {'Heroku-Two-Factor-Code': '2fa key'}
    })
    .put('/apps/myapp/pre-authorizations')
    .reply(200, {});

    cli.preauth('myapp', heroku, '2fa key').should.eventually.notify(done);
  });
});
