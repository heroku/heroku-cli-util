import {expect} from 'chai'
import {stdout} from 'stdout-stderr'
import stripAnsi from 'strip-ansi'

import {styledHeader} from '../../../src/ux/styled-header.js'

describe('styledHeader', function () {
  it('should print the correct styled header output', function () {
    const header = 'My Test Header'
    styledHeader(header)
    const actual = stripAnsi(stdout.output)
    expect(actual).to.equal('=== My Test Header\n\n')
  })
})
