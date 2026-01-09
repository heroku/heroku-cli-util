import {expect} from 'chai'

import {formatPrice} from '../../../src/ux/format-price.js'

describe('formatPrice', function () {
  it('returns "free" for zero rate', function () {
    const result = formatPrice(0)
    expect(result).to.equal('free')
  })

  it('formats monthly rate pricing correctly with cents', function () {
    const result = formatPrice(1050)
    expect(result).to.equal('$10.50')
  })

  it('formats monthly rate pricing correctly without cents', function () {
    const result = formatPrice(1000)
    expect(result).to.equal('$10')
  })

  it('formats hourly rate pricing correctly', function () {
    const result = formatPrice(1000, true)
    expect(result).to.equal('~$0.014')
  })

  it('formats hourly rate pricing correctly for really low rates', function () {
    const result = formatPrice(71, true)
    expect(result).to.equal('~$0.000')
  })
})
