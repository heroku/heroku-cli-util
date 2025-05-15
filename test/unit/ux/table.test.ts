import {expect} from 'chai'
import {stdout} from 'stdout-stderr'

import {table} from '../../../src/ux/table.js'

import stripAnsi = require('strip-ansi')

describe('table', function () {
  it('should print the correct table output', function () {
    const data = [
      {baz: 42, foo: 'bar'},
      {baz: 7, foo: 'qux'},
    ]
    const columns = {baz: {header: 'Baz'}, foo: {header: 'Foo'}}
    table(data, columns)
    const actual = stripAnsi(stdout.output)
    expect(actual).to.include('Baz   Foo')
    expect(actual).to.include('42    bar')
    expect(actual).to.include('7     qux')
  })
})
