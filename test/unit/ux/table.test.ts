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

  it('should respect sort options', function () {
    const data = [
      {age: 30, name: 'Alice'},
      {age: 25, name: 'Bob'},
      {age: 35, name: 'Charlie'},
    ]
    const columns = {age: {header: 'Age'}, name: {header: 'Name'}}
    table(data, columns, {
      noStyle: true,
      sort: {age: 'asc'},
    })
    const output = stdout()
    // Should be sorted by age in ascending order
    expect(removeAllWhitespace(output)).to.include(removeAllWhitespace('Age   Name'))
    expect(removeAllWhitespace(output)).to.include(removeAllWhitespace('25    Bob'))
    expect(removeAllWhitespace(output)).to.include(removeAllWhitespace('30    Alice'))
    expect(removeAllWhitespace(output)).to.include(removeAllWhitespace('35    Charlie'))
  })

  it('should use default styling options', function () {
    const data = [
      {age: 30, name: 'Alice'},
    ]
    const columns = {age: {header: 'Age'}, name: {header: 'Name'}}
    table(data, columns)
    const output = stdout()
    // Should have headers-only-with-underline border style
    expect(output).to.include('─')
    expect(output).to.include('│')
    // Should have whiteBright border color
    expect(output).to.include('\u001B[97m') // ANSI code for whiteBright
    // Should have purple headers
    expect(output).to.include('\u001B[38;2;147;112;219m') // ANSI code for rgb(147, 112, 219)
    // Should contain the data
    expect(removeAllWhitespace(output)).to.include(removeAllWhitespace('Age   Name'))
    expect(removeAllWhitespace(output)).to.include(removeAllWhitespace('30    Alice'))
  })
})
