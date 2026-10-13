import {captureOutput} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {describe, expect, it} from 'vitest'

import {styledHeader} from '../../../src/ux/styled-header.js'

describe('styledHeader', function () {
  it('should print the correct styled header output', async function () {
    const header = 'My Test Header'
    const {stdout} = await captureOutput(() => styledHeader(header))
    const actual = ansis.strip(stdout)
    expect(actual).toBe('=== My Test Header\n\n')
  })
})
