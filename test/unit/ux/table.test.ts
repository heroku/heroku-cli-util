import {stdout} from '@heroku-cli/test-utils'
import {expect} from 'chai'
import stripAnsi from 'strip-ansi'

import {table} from '../../../src/ux/table.js'

const removeAllWhitespace = (str: string): string => stripAnsi(str).replace(/\s+/g, '')

describe('table', function () {
  it('should print the correct table output', function () {
    const data = [
      {baz: 42, foo: 'bar'},
      {baz: 7, foo: 'qux'},
    ]
    const columns = {baz: {header: 'Baz'}, foo: {header: 'Foo'}}
    table(data, columns, {noStyle: true})
    expect(removeAllWhitespace(stdout())).to.include(removeAllWhitespace('Baz   Foo'))
    expect(removeAllWhitespace(stdout())).to.include(removeAllWhitespace('42    bar'))
    expect(removeAllWhitespace(stdout())).to.include(removeAllWhitespace('7     qux'))
  })
})
