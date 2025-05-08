import heredoc from 'tsheredoc'

import expectOutput from '../../../src/test-helpers/expect-output'
import {stdout} from '../../../src/test-helpers/stub-output'
import {styledJSON} from '../../../src/ux/styled-json'

import stripAnsi = require('strip-ansi');

describe('styledObject', function () {
  it('should print the correct styled object output', function () {
    const obj = {baz: 42, foo: 'bar'}
    styledJSON(obj)
    const expected = heredoc(`
      {
        "baz": 42,
        "foo": "bar"
      }
    `)
    const actual = stripAnsi(stdout())
    expectOutput(expected, actual)
  })
})
