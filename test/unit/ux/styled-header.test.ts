import {expect} from 'chai'
import {stdout} from 'stdout-stderr'

import {styledHeader} from '../../../src/ux/styled-header'

import stripAnsi = require('strip-ansi');

describe('styledHeader', function () {
  it('should print the correct styled header output', function () {
    const header = 'My Test Header'
    styledHeader(header)
    const actual = stripAnsi(stdout.output)
    expect(actual).to.equal('=== My Test Header\n\n')
  })
})
