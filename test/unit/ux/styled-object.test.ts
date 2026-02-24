import {stdout} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {expect} from 'chai'
import tsheredoc from 'tsheredoc'
const heredoc = tsheredoc.default
import {styledObject} from '../../../src/ux/styled-object.js'

describe('styledObject', function () {
  it('should print the correct styled object output', function () {
    const obj = {baz: 42, foo: 'bar'}
    styledObject(obj)
    const expected = heredoc(`
      baz: 42
      foo: bar
    `)
    const actual = ansis.strip(stdout())
    expect(actual).to.equal(expected)
  })

  it('should respect the order of keys array when provided', function () {
    const obj = {baz: 42, foo: 'bar', qux: 'hello'}
    styledObject(obj, ['foo', 'qux', 'baz'])
    const expected = heredoc(`
      foo: bar
      qux: hello
      baz: 42
    `)
    const actual = ansis.strip(stdout())
    expect(actual).to.equal(expected)
  })

  it('should only display keys specified in keys array', function () {
    const obj = {baz: 42, foo: 'bar', qux: 'hello'}
    styledObject(obj, ['foo', 'baz'])
    const expected = heredoc(`
      foo: bar
      baz: 42
    `)
    const actual = ansis.strip(stdout())
    expect(actual).to.equal(expected)
  })

  it('should skip undefined and null values', function () {
    const obj = {baz: 42, foo: 'bar', empty: null, missing: undefined}
    styledObject(obj, ['foo', 'empty', 'baz', 'missing'])
    const expected = heredoc(`
      foo: bar
      baz: 42
    `)
    const actual = ansis.strip(stdout())
    expect(actual).to.equal(expected)
  })
})

