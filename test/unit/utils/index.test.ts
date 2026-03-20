import {expect} from 'chai'

import * as utils from '../../../src/utils/index.js'

describe('utils index exports', function () {
  it('exports AmbiguousError', function () {
    expect(utils.AmbiguousError).to.be.a('function')
  })

  it('exports NotFound', function () {
    expect(utils.NotFound).to.be.a('function')
  })

  it('exports AddonResolver', function () {
    expect(utils.AddonResolver).to.be.a('function')
  })

  it('exports getAddonService', function () {
    expect(utils.getAddonService).to.be.a('function')
  })

  it('exports isAdvancedDatabase', function () {
    expect(utils.isAdvancedDatabase).to.be.a('function')
  })

  it('exports isAdvancedPrivateDatabase', function () {
    expect(utils.isAdvancedPrivateDatabase).to.be.a('function')
  })

  it('exports isEssentialDatabase', function () {
    expect(utils.isEssentialDatabase).to.be.a('function')
  })

  it('exports isLegacyDatabase', function () {
    expect(utils.isLegacyDatabase).to.be.a('function')
  })

  it('exports isLegacyEssentialDatabase', function () {
    expect(utils.isLegacyEssentialDatabase).to.be.a('function')
  })

  it('exports isPostgresAddon', function () {
    expect(utils.isPostgresAddon).to.be.a('function')
  })

  it('exports getPsqlConfigs', function () {
    expect(utils.getPsqlConfigs).to.be.a('function')
  })

  it('exports sshTunnel', function () {
    expect(utils.sshTunnel).to.be.a('function')
  })

  it('exports getConfigVarNameFromAttachment', function () {
    expect(utils.getConfigVarNameFromAttachment).to.be.a('function')
  })

  it('exports DatabaseResolver', function () {
    expect(utils.DatabaseResolver).to.be.a('function')
  })

  it('exports getHost', function () {
    expect(utils.getHost).to.be.a('function')
  })

  it('exports PsqlService', function () {
    expect(utils.PsqlService).to.be.a('function')
  })
})
