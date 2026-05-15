import {captureOutput} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {describe, expect, it} from 'vitest'

import {table} from '../../../src/ux/table.js'

const removeAllWhitespace = (str: string): string => ansis.strip(str).replaceAll(/\s+/g, '')

describe('table', function () {
  it('should print the correct table output', async function () {
    const data = [
      {baz: 42, foo: 'bar'},
      {baz: 7, foo: 'qux'},
    ]
    const columns = {baz: {header: 'Baz'}, foo: {header: 'Foo'}}
    const {stdout} = await captureOutput(() => table(data, columns, {noStyle: true}))
    expect(removeAllWhitespace(stdout)).toContain(removeAllWhitespace('Baz   Foo'))
    expect(removeAllWhitespace(stdout)).toContain(removeAllWhitespace('42    bar'))
    expect(removeAllWhitespace(stdout)).toContain(removeAllWhitespace('7     qux'))
  })

  it('should respect sort options', async function () {
    const data = [
      {age: 30, name: 'Alice'},
      {age: 25, name: 'Bob'},
      {age: 35, name: 'Charlie'},
    ]
    const columns = {age: {header: 'Age'}, name: {header: 'Name'}}
    const {stdout} = await captureOutput(() =>
      table(data, columns, {
        noStyle: true,
        sort: {age: 'asc'},
      }))
    // Should be sorted by age in ascending order
    expect(removeAllWhitespace(stdout)).toContain(removeAllWhitespace('Age   Name'))
    expect(removeAllWhitespace(stdout)).toContain(removeAllWhitespace('25    Bob'))
    expect(removeAllWhitespace(stdout)).toContain(removeAllWhitespace('30    Alice'))
    expect(removeAllWhitespace(stdout)).toContain(removeAllWhitespace('35    Charlie'))
  })
})
