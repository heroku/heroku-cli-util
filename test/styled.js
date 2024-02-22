'use strict'
/* globals describe it beforeEach */

const cli = require('..')
const expect = require('chai').expect

describe('styledHash', function () {
  beforeEach(() => cli.mockConsole())

  it('prints out a styled hash', function () {
    cli.styledHash({ Name: 'myapp', Collaborators: ['user1@example.com', 'user2@example.com'] })
    expect(cli.stdout).to.eq('Collaborators: user1@example.com\n' +
      '               user2@example.com\n' +
      'Name:          myapp\n')
  })

  it('prints out a styled header', function () {
    cli.styledHeader('MyApp')
    expect(cli.stdout).to.eq('=== MyApp\n')
  })
})

describe('styledNameValues', function () {
  beforeEach(() => cli.mockConsole())

  it('prints out a styled set of name values', function () {
    cli.styledHash({ Name: 'myapp', Collaborators: ['user1@example.com', 'user2@example.com'] })
    expect(cli.stdout).to.eq('Collaborators: user1@example.com\n' +
      '               user2@example.com\n' +
      'Name:          myapp\n')
  })

  it('prints out a styled header', function () {
    cli.styledHeader('MyApp')
    expect(cli.stdout).to.eq('=== MyApp\n')
  })
})

describe('styledJSON', function () {
  beforeEach(() => cli.mockConsole())

  it('prints out indented json', function () {
    cli.styledJSON({ name: 'Name', values: ['myapp'] })
    expect(cli.stdout).to.eq(`{
  "name": "Name",
  "values": [
    "myapp"
  ]
}
`)
  })
})
