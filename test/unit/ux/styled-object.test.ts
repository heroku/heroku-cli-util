import {stdout} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import tsheredoc from 'tsheredoc'
const heredoc = tsheredoc.default
import {styledObject} from '../../../src/ux/styled-object.js'

import stripAnsi = require('strip-ansi')

describe('styledObject', function () {
  it('should print the correct styled object output', function () {
    const obj = {baz: 42, foo: 'bar'}
    styledObject(obj)
    const expected = heredoc(`
      baz: 42
      foo: bar
    `)
    const actual = stripAnsi(stdout())
    expect(actual).to.equal(expected)
  })
})

