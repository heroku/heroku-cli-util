import {describe, expect, it} from 'vitest'

import * as utils from '../../../src/utils/index.js'

describe('utils index exports', function () {
  it('exports AmbiguousError', function () {
    expect(utils.AmbiguousError).toBeTypeOf('function')
  })

  it('exports NotFound', function () {
    expect(utils.NotFound).toBeTypeOf('function')
  })

  it('exports AddonResolver', function () {
    expect(utils.AddonResolver).toBeTypeOf('function')
  })

  it('exports getAddonService', function () {
    expect(utils.getAddonService).toBeTypeOf('function')
  })

  it('exports isAdvancedDatabase', function () {
    expect(utils.isAdvancedDatabase).toBeTypeOf('function')
  })

  it('exports isAdvancedPrivateDatabase', function () {
    expect(utils.isAdvancedPrivateDatabase).toBeTypeOf('function')
  })

  it('exports isEssentialDatabase', function () {
    expect(utils.isEssentialDatabase).toBeTypeOf('function')
  })

  it('exports isLegacyDatabase', function () {
    expect(utils.isLegacyDatabase).toBeTypeOf('function')
  })

  it('exports isLegacyEssentialDatabase', function () {
    expect(utils.isLegacyEssentialDatabase).toBeTypeOf('function')
  })

  it('exports isPostgresAddon', function () {
    expect(utils.isPostgresAddon).toBeTypeOf('function')
  })

  it('exports getPsqlConfigs', function () {
    expect(utils.getPsqlConfigs).toBeTypeOf('function')
  })

  it('exports sshTunnel', function () {
    expect(utils.sshTunnel).toBeTypeOf('function')
  })

  it('exports getConfigVarNameFromAttachment', function () {
    expect(utils.getConfigVarNameFromAttachment).toBeTypeOf('function')
  })

  it('exports DatabaseResolver', function () {
    expect(utils.DatabaseResolver).toBeTypeOf('function')
  })

  it('exports getHost', function () {
    expect(utils.getHost).toBeTypeOf('function')
  })

  it('exports PsqlService', function () {
    expect(utils.PsqlService).toBeTypeOf('function')
  })
})
