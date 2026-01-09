import {expect} from 'chai'

import {toHumanReadableDataSize} from '../../../src/ux/data-size.js'

describe('toHumanReadableDataSize', function () {
  it('handles zero correctly', function () {
    const result = toHumanReadableDataSize(0)
    expect(result).to.equal('0.00 MB')
  })

  it('converts small values to MB', function () {
    const result = toHumanReadableDataSize(0.5)
    expect(result).to.equal('500.00 MB')
  })

  it('converts very small values to MB', function () {
    const result = toHumanReadableDataSize(0.001)
    expect(result).to.equal('1.00 MB')
  })

  it('converts exactly 1 GB to GB', function () {
    const result = toHumanReadableDataSize(1)
    expect(result).to.equal('1.00 GB')
  })

  it('keeps values between 1 and 999.994 GB in GB', function () {
    const result = toHumanReadableDataSize(100)
    expect(result).to.equal('100.00 GB')
  })

  it('keeps values at the boundary (999.994) in GB', function () {
    const result = toHumanReadableDataSize(999.994)
    expect(result).to.equal('999.99 GB')
  })

  it('converts values just over the boundary to TB', function () {
    const result = toHumanReadableDataSize(999.995)
    expect(result).to.equal('1.00 TB')
  })

  it('converts large values to TB', function () {
    const result = toHumanReadableDataSize(2000)
    expect(result).to.equal('2.00 TB')
  })

  it('converts very large values to TB', function () {
    const result = toHumanReadableDataSize(128_000)
    expect(result).to.equal('128.00 TB')
  })
})
