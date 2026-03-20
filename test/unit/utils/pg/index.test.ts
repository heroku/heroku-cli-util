import {expect} from 'chai'

import * as pg from '../../../../src/utils/pg/index.js'

describe('utils/pg index exports', function () {
  it('exports getPsqlConfigs', function () {
    expect(pg.getPsqlConfigs).to.be.a('function')
  })

  it('exports sshTunnel', function () {
    expect(pg.sshTunnel).to.be.a('function')
  })

  it('exports getConfigVarNameFromAttachment', function () {
    expect(pg.getConfigVarNameFromAttachment).to.be.a('function')
  })

  it('exports DatabaseResolver', function () {
    expect(pg.DatabaseResolver).to.be.a('function')
  })

  it('exports getHost', function () {
    expect(pg.getHost).to.be.a('function')
  })

  it('exports PsqlService', function () {
    expect(pg.PsqlService).to.be.a('function')
  })
})
