import type {APIClient} from '@heroku-cli/command'

import {expect} from 'chai'
import * as sinon from 'sinon'

import * as resolve from '../../../../src/utils/addons/resolve.js'
import * as configVars from '../../../../src/utils/pg/config-vars.js'
import {getDatabase} from '../../../../src/utils/pg/databases.js'

const mockHeroku = {} as APIClient
const mockAttachment = {
  addon: {
    addon: {id: 'addon-id', plan: {name: 'heroku-postgresql:standard-0'}},
    config_vars: ['DATABASE_URL'],
    id: 'addon-id',
    plan: {name: 'heroku-postgresql:standard-0'},
  },
  app: {name: 'test-app'},
  config_vars: ['DATABASE_URL'],
}
const mockConfig = {
  DATABASE_URL: 'postgres://user:pass@localhost:5432/dbname',
}

describe('getDatabase', function () {
  let appAttachmentStub: sinon.SinonStub
  let getConfigStub: sinon.SinonStub

  before(function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    appAttachmentStub = sinon.stub(resolve, 'appAttachment').resolves(mockAttachment as any)
    getConfigStub = sinon.stub(configVars, 'getConfig').resolves(mockConfig)
  })

  after(function () {
    appAttachmentStub.restore()
    getConfigStub.restore()
  })

  it('returns connection details for a valid attachment', async function () {
    const result = await getDatabase(mockHeroku, 'test-app', 'DATABASE_URL')
    expect(result).to.deep.equal({
      attachment: mockAttachment,
      database: 'dbname',
      host: 'localhost',
      password: 'pass',
      pathname: '/dbname',
      port: '5432',
      url: 'postgres://user:pass@localhost:5432/dbname',
      user: 'user',
    })
  })
})
