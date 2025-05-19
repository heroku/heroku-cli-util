import type {AddOnAttachment} from '@heroku-cli/schema'

import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import {expect} from 'chai'
import nock from 'nock'

import type {AddOnAttachmentWithConfigVarsAndPlan} from '../../../../src/types/pg/data-api.js'

import {getDatabase} from '../../../../src/utils/pg/databases.js'

const HEROKU_API = 'https://api.heroku.com'
const plan = {
  addon_service: {id: 'postgres', name: 'heroku-postgresql'},
  created_at: '2024-01-01T00:00:00Z',
  default: false,
  description: 'Standard 0',
  id: 'plan-id',
  name: 'heroku-postgresql:standard-0',
  price: {cents: 0, unit: 'month'},
  space: null,
  state: 'public',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockAttachment = {
  addon: {
    addon: {
      addon_service: {id: 'postgres', name: 'heroku-postgresql'},
      app: {id: 'app-id', name: 'test-app'},
      config_vars: ['DATABASE_URL'],
      id: 'addon-id',
      name: 'heroku-postgresql',
      plan,
    },
    addon_service: {id: 'postgres', name: 'heroku-postgresql'},
    app: {id: 'app-id', name: 'test-app'},
    config_vars: ['DATABASE_URL'],
    created_at: '2024-01-01T00:00:00Z',
    id: 'addon-id',
    log_input_url: 'https://log-input-url.com',
    name: 'heroku-postgresql',
    namespace: null,
    plan,
    updated_at: '2024-01-01T00:00:00Z',
    web_url: 'https://web-url.com',
  },
  app: {id: 'app-id', name: 'test-app'},
  config_vars: ['DATABASE_URL'],
  created_at: '2024-01-01T00:00:00Z',
  id: 'attachment-id',
  name: 'DATABASE',
  namespace: null,
  plan,
  updated_at: '2024-01-01T00:00:00Z',
} as { addon: AddOnAttachmentWithConfigVarsAndPlan } & AddOnAttachment

// Add a runtime assertion to ensure plan exists
if (!mockAttachment.addon.addon?.plan) throw new Error('mockAttachment.addon.addon.plan is missing')

const mockConfig = {
  DATABASE_URL: 'postgres://user:pass@localhost:5432/dbname',
}

describe('getDatabase', function () {
  let config: Config
  let heroku: APIClient

  beforeEach(async function () {
    config = await Config.load()
    heroku = new APIClient(config)
  })

  afterEach(function () {
    nock.cleanAll()
  })

  it('returns connection details for a valid attachment', async function () {
    nock(HEROKU_API)
      .post('/actions/addon-attachments/resolve')
      .reply(200, [mockAttachment])
    nock(HEROKU_API)
      .get('/apps/test-app/config-vars')
      .reply(200, mockConfig)

    // Debug log to inspect the object passed to bastionKeyPlan
    console.log('DEBUG attached.addon:', mockAttachment.addon)

    const result = await getDatabase(heroku, 'test-app', 'DATABASE_URL')
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
