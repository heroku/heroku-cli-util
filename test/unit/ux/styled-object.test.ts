import {expectOutput} from '@heroku-cli/test-utils'
import {stdout} from '@heroku-cli/test-utils'
import heredoc from 'tsheredoc'

import {styledObject} from '../../../src/ux/styled-object'

import stripAnsi = require('strip-ansi');

describe('styledObject', function () {
  it('should print the correct styled object output', function () {
    const obj = {baz: 42, foo: 'bar'}
    styledObject(obj)
    const expected = heredoc(`
      baz: 42
      foo: bar
    `)
    const actual = stripAnsi(stdout())
    expectOutput(expected, actual)
  })
})

