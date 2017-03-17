'use strict'

const Vars = require('../lib/vars').constructor
const expect = require('unexpected')

describe('vars', () => {
  it('sets vars by default', () => {
    const vars = new Vars({})
    expect(vars.host, 'to equal', 'heroku.com')
    expect(vars.gitHost, 'to equal', 'heroku.com')
    expect(vars.httpGitHost, 'to equal', 'git.heroku.com')
  })

  it('respects HEROKU_HOST', () => {
    const vars = new Vars({HEROKU_HOST: 'https://customhost'})
    expect(vars.host, 'to equal', 'https://customhost')
    expect(vars.gitHost, 'to equal', 'customhost')
    expect(vars.httpGitHost, 'to equal', 'customhost')
  })
})

