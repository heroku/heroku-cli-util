import {expect} from 'chai'

import * as hux from '../../../src/ux/index.js'

describe('ux index exports', function () {
  it('exports ago', function () {
    expect(hux.ago).to.be.a('function')
  })

  it('exports alignColumns', function () {
    expect(hux.alignColumns).to.be.a('function')
  })

  it('exports anykey', function () {
    expect(hux.anykey).to.be.a('function')
  })

  it('exports color', function () {
    expect(hux.color).to.exist
    expect(typeof hux.color).to.equal('object')
  })

  it('exports confirmCommand', function () {
    expect(hux.confirmCommand).to.be.a('function')
  })

  it('exports confirm', function () {
    expect(hux.confirm).to.be.a('function')
  })

  it('exports toHumanReadableDataSize', function () {
    expect(hux.toHumanReadableDataSize).to.be.a('function')
  })

  it('exports formatPrice', function () {
    expect(hux.formatPrice).to.be.a('function')
  })

  it('exports openUrl', function () {
    expect(hux.openUrl).to.be.a('function')
  })

  it('exports prompt', function () {
    expect(hux.prompt).to.be.a('function')
  })

  it('exports styledHeader', function () {
    expect(hux.styledHeader).to.be.a('function')
  })

  it('exports styledJSON', function () {
    expect(hux.styledJSON).to.be.a('function')
  })

  it('exports styledObject', function () {
    expect(hux.styledObject).to.be.a('function')
  })

  it('exports table', function () {
    expect(hux.table).to.be.a('function')
  })

  it('exports toTitleCase', function () {
    expect(hux.toTitleCase).to.be.a('function')
  })

  it('exports wait', function () {
    expect(hux.wait).to.be.a('function')
  })
})
