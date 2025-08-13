import {expectOutput, stdout} from '@heroku-cli/test-utils'
import stripAnsi from 'strip-ansi'

import {styledHeader} from '../../../src/ux/styled-header'

describe('styledHeader', function () {
  it('should print the correct styled header output', function () {
    const header = 'My Test Header'
    styledHeader(header)
    const actual = stripAnsi(stdout())
    expectOutput(actual, '=== My Test Header\n\n')
  })
})
