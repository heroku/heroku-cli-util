'use strict';

let expect = require('chai').expect;

describe('styledHash', function () {
  it('prints out a styled hash', function () {
    cli.styledHash({Name: "myapp", Collaborators: ["user1@example.com", "user2@example.com"]});
    expect(cli.color.stripColor(cli.stdout)).to.contain('Collaborators: user1@example.com\n' +
     '               user2@example.com\n' +
     'Name:          myapp\n');
  });

  it('prints out a styled header', function () {
    cli.styledHeader('MyApp');
    expect(cli.color.stripColor(cli.stdout)).to.contain('=== MyApp\n');
  });
});

describe('styledNameValues', function () {
  it('prints out a styled set of name values', function () {
    cli.styledHash([{name: 'Name', values: ["myapp"]}, {name: 'Collaborators', values: ["user1@example.com", "user2@example.com"]}]);
    expect(cli.color.stripColor(cli.stdout)).to.contain('Collaborators: user1@example.com\n' +
     '               user2@example.com\n' +
     'Name:          myapp\n');
  });

  it('prints out a styled header', function () {
    cli.styledHeader('MyApp');
    expect(cli.color.stripColor(cli.stdout)).to.contain('=== MyApp\n');
  });
});
