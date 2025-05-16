import {expect} from 'chai'
import {stdout} from 'stdout-stderr'
import tsheredoc from 'tsheredoc'
const heredoc = tsheredoc.default

import {styledJSON} from '../../../src/ux/styled-json.js'

import stripAnsi = require('strip-ansi')

describe('styledJSON', function () {
  it('should print the correct styled object output', function () {
    const obj = {baz: 42, foo: 'bar', test: {one: 'two'}}
    styledJSON(obj)
    const expected = heredoc(`
      {
        "baz": 42,
        "foo": "bar",
        "test": {
          "one": "two"
        }
      }
    `)
    const actual = stripAnsi(stdout.output)
    expect(actual).to.equal(expected)
  })
})
