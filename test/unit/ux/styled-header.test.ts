import {captureOutput} from '@heroku-cli/test-utils'
import {ux} from '@oclif/core/ux'
import ansis from 'ansis'
import {describe, expect, it} from 'vitest'

import {styledHeader} from '../../../src/ux/styled-header.js'
import {expectPure} from '../../helpers/expect-pure.js'

describe('styledHeader', function () {
  it('returns the styled header without writing output', async function () {
    const actual = await expectPure(() => styledHeader('My Test Header'))
    expect(ansis.strip(actual)).toBe('=== My Test Header\n')
  })

  it('keeps the blank line after the header when logged', async function () {
    const {stdout} = await captureOutput(() => ux.stdout(styledHeader('My Test Header')))
    expect(ansis.strip(stdout)).toBe('=== My Test Header\n\n')
  })
})
