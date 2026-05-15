import {describe, expect, it} from 'vitest'

import * as pg from '../../../../src/utils/pg/index.js'

describe('utils/pg index exports', function () {
  it('exports getPsqlConfigs', function () {
    expect(pg.getPsqlConfigs).toBeTypeOf('function')
  })

  it('exports sshTunnel', function () {
    expect(pg.sshTunnel).toBeTypeOf('function')
  })

  it('exports getConfigVarNameFromAttachment', function () {
    expect(pg.getConfigVarNameFromAttachment).toBeTypeOf('function')
  })

  it('exports DatabaseResolver', function () {
    expect(pg.DatabaseResolver).toBeTypeOf('function')
  })

  it('exports getHost', function () {
    expect(pg.getHost).toBeTypeOf('function')
  })

  it('exports PsqlService', function () {
    expect(pg.PsqlService).toBeTypeOf('function')
  })
})
