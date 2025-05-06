import expectOutput from '../../../src/test-helpers/expect-output'
import {stdout} from '../../../src/test-helpers/stub-output'
import {styledHeader} from '../../../src/ux/styled-header'

import stripAnsi = require('strip-ansi');

describe('styledHeader', function () {
  it('should print the correct styled header output', function () {
    const header = 'My Test Header'
    styledHeader(header)
    const actual = stripAnsi(stdout())
    expectOutput(actual, '=== My Test Header\n\n')
  })
})
