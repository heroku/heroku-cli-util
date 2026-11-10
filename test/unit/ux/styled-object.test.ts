import {captureOutput} from '@heroku-cli/test-utils'
import {ux} from '@oclif/core/ux'
import ansis from 'ansis'
import tsheredoc from 'tsheredoc'
import {describe, expect, it} from 'vitest'
const heredoc = tsheredoc.default
import {styledObject} from '../../../src/ux/styled-object.js'
import {expectPure} from '../../helpers/expect-pure.js'

describe('styledObject', function () {
  it('should render the correct styled object output', async function () {
    const obj = {baz: 42, foo: 'bar'}
    const output = await expectPure(() => styledObject(obj))
    const expected = heredoc(`
      baz: 42
      foo: bar
    `)
    const actual = ansis.strip(output)
    expect(actual).toBe(expected.replace(/\n$/, ''))
  })

  it('should respect the order of keys array when provided', async function () {
    const obj = {baz: 42, foo: 'bar', qux: 'hello'}
    const output = await expectPure(() => styledObject(obj, ['foo', 'qux', 'baz']))
    const expected = heredoc(`
      foo: bar
      qux: hello
      baz: 42
    `)
    const actual = ansis.strip(output)
    expect(actual).toBe(expected.replace(/\n$/, ''))
  })

  it('should only display keys specified in keys array', async function () {
    const obj = {baz: 42, foo: 'bar', qux: 'hello'}
    const output = await expectPure(() => styledObject(obj, ['foo', 'baz']))
    const expected = heredoc(`
      foo: bar
      baz: 42
    `)
    const actual = ansis.strip(output)
    expect(actual).toBe(expected.replace(/\n$/, ''))
  })

  it('should skip undefined and null values', async function () {
    const obj = {
      // eslint-disable-next-line perfectionist/sort-objects
      baz: 42, foo: 'bar', empty: null, missing: undefined,
    }
    const output = await expectPure(() => styledObject(obj, ['foo', 'empty', 'baz', 'missing']))
    const expected = heredoc(`
      foo: bar
      baz: 42
    `)
    const actual = ansis.strip(output)
    expect(actual).toBe(expected.replace(/\n$/, ''))
  })

  it('matches the heroku-cli-util 10.x output when logged', async function () {
    const {stdout} = await captureOutput(() => ux.stdout(styledObject({baz: 42, foo: 'bar'})))
    expect(ansis.strip(stdout)).toBe('baz: 42\nfoo: bar\n')
  })

  it('returns primitives as strings', async function () {
    expect(await expectPure(() => styledObject('text'))).toBe('text')
    expect(await expectPure(() => styledObject(3))).toBe('3')
    expect(await expectPure(() => styledObject(false))).toBe('false')
    expect(await expectPure(() => styledObject(null))).toBe('null')
  })
})
