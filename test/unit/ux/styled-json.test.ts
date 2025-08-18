import {expectOutput, stdout} from '@heroku-cli/test-utils'
import stripAnsi from 'strip-ansi'
import heredoc from 'tsheredoc'

import {styledJSON} from '../../../src/ux/styled-json'

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
