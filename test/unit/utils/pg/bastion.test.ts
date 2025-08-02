import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'
import sinon from 'sinon'

import {bastionKeyPlan, fetchBastionConfig, getBastionConfig} from '../../../../src/utils/pg/bastion.js'
import {
  defaultAttachment,
  privateDatabaseAttachment,
  shieldDatabaseAttachment,
  developerAddonAttachment,
} from '../../../fixtures/attachment-mocks.js'
import {
  shieldDatabaseConfigVars,
  myAppConfigVars,
  emptyAppConfigVars,
} from '../../../fixtures/config-var-mocks.js'

const {expect} = chai

chai.use(chaiAsPromised)

describe('bastion', function () {
  describe('bastionKeyPlan', function () {
    it('returns true for attachments with plan names containing "private"', function () {
      const result = bastionKeyPlan(privateDatabaseAttachment)
      expect(result).to.be.true
    })

    it('returns false for attachments with plan names not containing "private"', function () {
      const result = bastionKeyPlan(defaultAttachment)
      expect(result).to.be.false
    })

    it('returns false for shield database attachments', function () {
      const result = bastionKeyPlan(shieldDatabaseAttachment)
      expect(result).to.be.false
    })

    it('returns false for developer addon attachments', function () {
      const result = bastionKeyPlan(developerAddonAttachment)
      expect(result).to.be.false
    })

    it('returns true for attachments with "private" only in the plan name', function () {
      const attachmentWithPrivateInAddonServiceSlug = {
        ...defaultAttachment,
        addon: {
          ...defaultAttachment.addon,
          plan: {
            ...defaultAttachment.addon.plan,
            name: 'private-postgresql:essential-1'
          }
        }
      }

      const attachmentWithPrivateAtEnd = {
        ...defaultAttachment,
        addon: {
          ...defaultAttachment.addon,
          plan: {
            ...defaultAttachment.addon.plan,
            name: 'heroku-postgresql:other-private-plan'
          }
        }
      }

      expect(bastionKeyPlan(attachmentWithPrivateInAddonServiceSlug)).to.be.false
      expect(bastionKeyPlan(attachmentWithPrivateAtEnd)).to.be.true
    })
  })

  describe('fetchBastionConfig', function () {
    let config: Config
    let heroku: APIClient
    let env: typeof process.env

    beforeEach(async function () {
      config = await Config.load()
      heroku = new APIClient(config)
      env = process.env
    })

    afterEach(function () {
      process.env = env
      sinon.restore()
      nock.cleanAll()
    })

    it('returns bastion config when API returns valid host and private_key', async function () {
      process.env = {}
      
      const bastionConfigResponse = {
        host: '10.7.0.1',
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----'
      }

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).to.deep.equal({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----'
      })

      api.done()
    })

    it('returns empty object when API returns response without host', async function () {
      process.env = {}
      
      const bastionConfigResponse = {
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----'
      }

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).to.deep.equal({})

      api.done()
    })

    it('returns empty object when API returns response without private_key', async function () {
      process.env = {}
      
      const bastionConfigResponse = {
        host: '10.7.0.1'
      }

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).to.deep.equal({})

      api.done()
    })

    it('returns empty object when API returns empty response', async function () {
      process.env = {}
      
      const bastionConfigResponse = {}

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).to.deep.equal({})

      api.done()
    })

    it('returns empty object when API returns response with empty host and private_key', async function () {
      process.env = {}
      
      const bastionConfigResponse = {
        host: '',
        private_key: ''
      }

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).to.deep.equal({})

      api.done()
    })

    it('uses custom hostname when HEROKU_DATA_HOST environment variable is set', async function () {
      process.env = {
        HEROKU_DATA_HOST: 'custom-data-api.heroku.com'
      }

      const bastionConfigResponse = {
        host: '10.7.0.1',
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----'
      }

      const api = nock('https://custom-data-api.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).to.deep.equal({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----'
      })

      api.done()
    })

    it('uses custom hostname when HEROKU_POSTGRESQL_HOST environment variable is set', async function () {
      process.env = {
        HEROKU_POSTGRESQL_HOST: 'custom-postgresql-api.heroku.com'
      }

      const bastionConfigResponse = {
        host: '10.7.0.1',
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----'
      }

      const api = nock('https://custom-postgresql-api.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).to.deep.equal({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----'
      })

      api.done()
    })

    it('prioritizes HEROKU_DATA_HOST over HEROKU_POSTGRESQL_HOST', async function () {
      process.env = {
        HEROKU_DATA_HOST: 'data-api.heroku.com',
        HEROKU_POSTGRESQL_HOST: 'postgresql-api.heroku.com'
      }

      const bastionConfigResponse = {
        host: '10.7.0.1',
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----'
      }

      const api = nock('https://data-api.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).to.deep.equal({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----'
      })

      api.done()
    })

    it('handles API errors gracefully', async function () {
      process.env = {}
      
      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that database.', resource: 'database'})

      await expect(fetchBastionConfig(heroku, privateDatabaseAttachment.addon))
        .to.be.rejectedWith('Couldn\'t find that database.')

      api.done()
    })
  })

  describe('getBastionConfig', function () {
    it('returns bastion config when both BASTION_KEY and BASTIONS are present', function () {
      const result = getBastionConfig(shieldDatabaseConfigVars, 'DATABASE')

      expect(result).to.deep.equal({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----'
      })
    })

    it('returns empty object when BASTION_KEY is missing', function () {
      const { DATABASE_BASTION_KEY, ...configWithoutKey } = shieldDatabaseConfigVars

      const result = getBastionConfig(configWithoutKey, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object when BASTIONS is missing', function () {
      const { DATABASE_BASTIONS, ...configWithoutBastions } = shieldDatabaseConfigVars

      const result = getBastionConfig(configWithoutBastions, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object when BASTIONS is empty string', function () {
      const configWithEmptyBastions = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTIONS: ''
      }

      const result = getBastionConfig(configWithEmptyBastions, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object when BASTION_KEY is empty string', function () {
      const configWithEmptyKey = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTION_KEY: ''
      }

      const result = getBastionConfig(configWithEmptyKey, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object when both BASTION_KEY and BASTIONS are empty', function () {
      const configWithEmptyValues = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTION_KEY: '',
        DATABASE_BASTIONS: ''
      }

      const result = getBastionConfig(configWithEmptyValues, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object when config vars are completely empty', function () {
      const result = getBastionConfig(emptyAppConfigVars, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object for non-shield database config vars', function () {
      const result = getBastionConfig(myAppConfigVars, 'MAIN_DATABASE')

      expect(result).to.deep.equal({})
    })

    it('handles multiple bastion hosts and selects one randomly', function () {
      const configWithMultipleBastions = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTIONS: '10.7.0.1,10.7.0.2,10.7.0.3'
      }

      const result = getBastionConfig(configWithMultipleBastions, 'DATABASE')

      expect(result).to.have.property('bastionKey', '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----')
      expect(['10.7.0.1', '10.7.0.2', '10.7.0.3']).to.include(result.bastionHost)
    })

    it('handles single bastion host without commas', function () {
      const configWithSingleBastion = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTIONS: '10.7.0.1'
      }

      const result = getBastionConfig(configWithSingleBastion, 'DATABASE')

      expect(result).to.deep.equal({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----'
      })
    })
  })
})
