import {expect} from 'chai'

import {stdout} from '../../../src/test-helpers/stub-output'
import {styledHeader} from '../../../src/ux/styled-header'

import stripAnsi = require('strip-ansi');

describe('styledHeader', function () {
  it('should print the correct styled header output', function () {
    const header = 'My Test Header'
    styledHeader(header)
    const actual = stripAnsi(stdout())
    expect(actual).to.match(/^=== My Test Header/)
    expect(actual).to.match(/\n\n$/)
  })
})
