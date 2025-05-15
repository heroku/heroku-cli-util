import {expect} from 'chai'
import {stdout} from 'stdout-stderr'

import {table} from '../../../src/ux/table.js'


const removeAllWhitespace = (str: string): string => str.replace(/\s+/g, '')

describe('table', function () {
  it('should print the correct table output', function () {
    const data = [
      {baz: 42, foo: 'bar'},
      {baz: 7, foo: 'qux'},
    ]
    const columns = {baz: {header: 'Baz'}, foo: {header: 'Foo'}}
    table(data, columns)

    expect(removeAllWhitespace(stdout.output)).to.include(removeAllWhitespace('Baz   Foo'))
    expect(removeAllWhitespace(stdout.output)).to.include(removeAllWhitespace('42    bar'))
    expect(removeAllWhitespace(stdout.output)).to.include(removeAllWhitespace('7     qux'))
  })
})
