'use strict'

const Vars = require('../lib/vars').constructor
const expect = require('unexpected')

describe('vars', () => {
  it('sets vars by default', () => {
    const vars = new Vars({})
    expect(vars.host, 'to equal', 'heroku.com')
    expect(vars.apiHost, 'to equal', 'api.heroku.com')
    expect(vars.httpGitHost, 'to equal', 'git.heroku.com')
    expect(vars.apiUrl, 'to equal', 'https://api.heroku.com')
  })

  it('respects HEROKU_HOST', () => {
    const vars = new Vars({HEROKU_HOST: 'customhost'})
    expect(vars.host, 'to equal', 'customhost')
    expect(vars.apiHost, 'to equal', 'api.customhost')
    expect(vars.httpGitHost, 'to equal', 'git.customhost')
    expect(vars.apiUrl, 'to equal', 'https://api.customhost')
  })

  it('respects HEROKU_HOST as url', () => {
    const vars = new Vars({HEROKU_HOST: 'https://customhost'})
    expect(vars.host, 'to equal', 'https://customhost')
    expect(vars.apiHost, 'to equal', 'customhost')
    expect(vars.httpGitHost, 'to equal', 'customhost')
    expect(vars.apiUrl, 'to equal', 'https://customhost')
  })
})

