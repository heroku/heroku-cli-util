import {expect} from 'chai'

import * as addons from '../../../../src/utils/addons/index.js'

describe('utils/addons index exports', function () {
  it('exports AddonResolver', function () {
    expect(addons.AddonResolver).to.be.a('function')
  })

  it('exports AttachmentResolver', function () {
    expect(addons.AttachmentResolver).to.be.a('function')
  })

  it('exports getAddonService', function () {
    expect(addons.getAddonService).to.be.a('function')
  })

  it('exports isAdvancedDatabase', function () {
    expect(addons.isAdvancedDatabase).to.be.a('function')
  })

  it('exports isAdvancedPrivateDatabase', function () {
    expect(addons.isAdvancedPrivateDatabase).to.be.a('function')
  })

  it('exports isEssentialDatabase', function () {
    expect(addons.isEssentialDatabase).to.be.a('function')
  })

  it('exports isLegacyDatabase', function () {
    expect(addons.isLegacyDatabase).to.be.a('function')
  })

  it('exports isLegacyEssentialDatabase', function () {
    expect(addons.isLegacyEssentialDatabase).to.be.a('function')
  })

  it('exports isPostgresAddon', function () {
    expect(addons.isPostgresAddon).to.be.a('function')
  })
})
