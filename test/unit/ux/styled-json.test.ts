import {captureOutput} from '@heroku-cli/test-utils'
import {ux} from '@oclif/core/ux'
import ansis from 'ansis'
import tsheredoc from 'tsheredoc'
import {describe, expect, it} from 'vitest'
const heredoc = tsheredoc.default

import {styledJSON} from '../../../src/ux/styled-json.js'
import {expectPure} from '../../helpers/expect-pure.js'

describe('styledJSON', function () {
  it('should render the correct styled object output', async function () {
    const obj = {baz: 42, foo: 'bar', test: {one: 'two'}}
    const output = await expectPure(() => styledJSON(obj))
    const expected = heredoc(`
      {
        "baz": 42,
        "foo": "bar",
        "test": {
          "one": "two"
        }
      }
    `)
    const actual = ansis.strip(output)
    expect(actual).toBe(expected.replace(/\n$/, ''))
  })

  it('matches the pre-v11 output when logged', async function () {
    const obj = {foo: 'bar'}
    const {stdout} = await captureOutput(() => ux.stdout(styledJSON(obj)))
    expect(stdout).toBe(ux.colorizeJson(obj) + '\n')
  })
})
