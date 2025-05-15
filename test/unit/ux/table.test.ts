import {expect} from 'chai'
import {stdout} from 'stdout-stderr'
import tsheredoc from 'tsheredoc'
const heredoc = tsheredoc.default
import {table} from '../../../src/ux/table.js'

import stripAnsi = require('strip-ansi')

process.env.OCLIF_TABLE_SKIP_CI_CHECK = 'true'

describe('table', function () {
  it('should print the correct table output', function () {
    const data = [
      {baz: 42, foo: 'bar'},
      {baz: 7, foo: 'qux'},
    ]
    const columns = {baz: {header: 'Baz'}, foo: {header: 'Foo'}}
    table(data, columns)
    const expected = heredoc(`
    Baz   Foo 
     ───────────
      42    bar
      7     qux
    `)
    const actual = stripAnsi(stdout.output)
    expect(actual.trim()).to.equal(expected.trim())
  })
})
