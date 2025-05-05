import {expect} from 'chai'

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
    const expected
      = ' Foo Baz \n'
      + ' ─── ─── \n'
      + ' bar 42  \n'
      + ' qux 7   \n'
    // Remove ANSI color codes and normalize whitespace for comparison
    const actual = stripAnsi(stdout())
    expect(actual).to.include(stripAnsi(expected))
  })
})
