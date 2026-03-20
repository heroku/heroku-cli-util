import {captureOutput} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {expect} from 'chai'
import tsheredoc from 'tsheredoc'
const heredoc = tsheredoc.default
import {styledObject} from '../../../src/ux/styled-object.js'

describe('styledObject', function () {
  it('should print the correct styled object output', async function () {
    const obj = {baz: 42, foo: 'bar'}
    const {stdout} = await captureOutput(() => {
      styledObject(obj)
    })
    const expected = heredoc(`
      baz: 42
      foo: bar
    `)
    const actual = ansis.strip(stdout)
    expect(actual).to.equal(expected)
  })

  it('should respect the order of keys array when provided', async function () {
    const obj = {baz: 42, foo: 'bar', qux: 'hello'}
    const {stdout} = await captureOutput(() => {
      styledObject(obj, ['foo', 'qux', 'baz'])
    })
    const expected = heredoc(`
      foo: bar
      qux: hello
      baz: 42
    `)
    const actual = ansis.strip(stdout)
    expect(actual).to.equal(expected)
  })

  it('should only display keys specified in keys array', async function () {
    const obj = {baz: 42, foo: 'bar', qux: 'hello'}
    const {stdout} = await captureOutput(() => {
      styledObject(obj, ['foo', 'baz'])
    })
    const expected = heredoc(`
      foo: bar
      baz: 42
    `)
    const actual = ansis.strip(stdout)
    expect(actual).to.equal(expected)
  })

  it('should skip undefined and null values', async function () {
    const obj = {
      // eslint-disable-next-line perfectionist/sort-objects
      baz: 42, foo: 'bar', empty: null, missing: undefined,
    }
    const {stdout} = await captureOutput(() => {
      styledObject(obj, ['foo', 'empty', 'baz', 'missing'])
    })
    const expected = heredoc(`
      foo: bar
      baz: 42
    `)
    const actual = ansis.strip(stdout)
    expect(actual).to.equal(expected)
  })
})

