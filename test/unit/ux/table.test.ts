import heredoc from 'tsheredoc'

import expectOutput from '../../../src/test-helpers/expect-output'
import {stdout} from '../../../src/test-helpers/stub-output'
import {table} from '../../../src/ux/table'

import stripAnsi = require('strip-ansi')

describe('table', function () {
  it('should print the correct table output', function () {
    const data = [
      {baz: 42, foo: 'bar'},
      {baz: 7, foo: 'qux'},
    ]
    const columns = {baz: {header: 'Baz'}, foo: {header: 'Foo'}}
    table(data, columns)
    const expected = heredoc(`
      Baz Foo
       ─── ───
       42  bar
       7   qux
    `)
    const actual = stripAnsi(stdout())
    expectOutput(expected, actual)
  })
})
