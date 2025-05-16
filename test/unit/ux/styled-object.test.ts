import {expect} from 'chai'
import {stdout} from 'stdout-stderr'
import heredoc from 'tsheredoc'

import {styledObject} from '../../../src/ux/styled-object'

import stripAnsi = require('strip-ansi')

describe('styledObject', function () {
  it('should print the correct styled object output', function () {
    const obj = {baz: 42, foo: 'bar'}
    styledObject(obj)
    const expected = heredoc(`
      baz: 42
      foo: bar
    `)
    const actual = stripAnsi(stdout.output)
    expect(actual).to.equal(expected)
  })
})

