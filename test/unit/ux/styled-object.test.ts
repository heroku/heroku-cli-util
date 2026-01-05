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
})

