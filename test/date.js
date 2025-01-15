'use strict'
/* globals describe it */

const cli = require('..')
const expect = require('chai').expect

describe('date', function () {
  it('formats a date', function () {
    const d = new Date('2011-10-10')
    expect(cli.formatDate(d)).to.equal('2011-10-10T00:00:00.000Z')
  })
})
