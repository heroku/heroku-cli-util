import {describe, expect, it} from 'vitest'

import * as addons from '../../../../src/utils/addons/index.js'

describe('utils/addons index exports', function () {
  it('exports AddonResolver', function () {
    expect(addons.AddonResolver).toBeTypeOf('function')
  })

  it('exports AttachmentResolver', function () {
    expect(addons.AttachmentResolver).toBeTypeOf('function')
  })

  it('exports getAddonService', function () {
    expect(addons.getAddonService).toBeTypeOf('function')
  })

  it('exports isAdvancedDatabase', function () {
    expect(addons.isAdvancedDatabase).toBeTypeOf('function')
  })

  it('exports isAdvancedPrivateDatabase', function () {
    expect(addons.isAdvancedPrivateDatabase).toBeTypeOf('function')
  })

  it('exports isEssentialDatabase', function () {
    expect(addons.isEssentialDatabase).toBeTypeOf('function')
  })

  it('exports isLegacyDatabase', function () {
    expect(addons.isLegacyDatabase).toBeTypeOf('function')
  })

  it('exports isLegacyEssentialDatabase', function () {
    expect(addons.isLegacyEssentialDatabase).toBeTypeOf('function')
  })

  it('exports isPostgresAddon', function () {
    expect(addons.isPostgresAddon).toBeTypeOf('function')
  })
})
