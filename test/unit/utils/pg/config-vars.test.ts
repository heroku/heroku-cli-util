import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'
import sinon from 'sinon'

import {getConfig, configVarsByAppIdCache, getConfigVarNameFromAttachment, getConfigVarName} from '../../../../src/utils/pg/config-vars.js'
import {HEROKU_API, shieldDatabaseAttachment, defaultAttachment} from '../../../fixtures/attachment-mocks.js'
import {
  myAppConfigVars,
  emptyAppConfigVars,
  myOtherAppConfigVars,
} from '../../../fixtures/config-var-mocks.js'

const {expect} = chai

chai.use(chaiAsPromised)

describe('config-vars', function () {
  beforeEach(function () {
    configVarsByAppIdCache.clear()
  })

  describe('getConfig', function () {
    let config: Config
    let heroku: APIClient

    beforeEach(async function () {
      config = await Config.load()
      heroku = new APIClient(config)
    })

    afterEach(function () {
      sinon.restore()
      nock.cleanAll()
    })

    describe('when fetching config vars for the first time', function () {
      it('fetches config vars from the API and returns them', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/config-vars')
          .reply(200, myAppConfigVars)

        const result = await getConfig(heroku, 'my-app')

        expect(result).to.deep.equal(myAppConfigVars)
        api.done()
      })

      it('returns undefined when API returns no config vars', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/empty-app/config-vars')
          .reply(200, emptyAppConfigVars)

        const result = await getConfig(heroku, 'empty-app')

        expect(result).to.deep.equal(emptyAppConfigVars)
        api.done()
      })

      it('handles API errors gracefully', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/config-vars')
          .reply(404, {id: 'not_found', message: 'Couldn\'t find that app.', resource: 'app'})

        await expect(getConfig(heroku, 'my-app'))
          .to.be.rejectedWith('Couldn\'t find that app.')
        
        api.done()
      })
    })

    describe('when fetching config vars for the same app multiple times', function () {
      it('caches the result and does not make duplicate API calls', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/config-vars')
          .reply(200, myAppConfigVars)

        // First call - should make API request
        const result1 = await getConfig(heroku, 'my-app')
        expect(result1).to.deep.equal(myAppConfigVars)

        // Verify API was only called once
        api.done()

        // Second call - should use cached result
        const result2 = await getConfig(heroku, 'my-app')
        expect(result2).to.deep.equal(myAppConfigVars)
      })

      it('caches different apps separately', async function () {
        const api1 = nock(HEROKU_API)
          .get('/apps/my-app/config-vars')
          .reply(200, myAppConfigVars)

        const api2 = nock(HEROKU_API)
          .get('/apps/my-other-app/config-vars')
          .reply(200, myOtherAppConfigVars)

        // Fetch config vars for both apps
        const result1 = await getConfig(heroku, 'my-app')
        const result2 = await getConfig(heroku, 'my-other-app')

        expect(result1).to.deep.equal(myAppConfigVars)
        expect(result2).to.deep.equal(myOtherAppConfigVars)

        api1.done()
        api2.done()

        // Fetch again - should use cache
        const result1Cached = await getConfig(heroku, 'my-app')
        const result2Cached = await getConfig(heroku, 'my-other-app')

        expect(result1Cached).to.deep.equal(myAppConfigVars)
        expect(result2Cached).to.deep.equal(myOtherAppConfigVars)
      })
    })
  })

  describe('getConfigVarName', function () {
    it('returns the first config var name that ends with _URL', function () {
      const configVars = shieldDatabaseAttachment.config_vars
      const result = getConfigVarName(configVars)
      expect(result).to.equal('DATABASE_URL')
    })

    it('throws error when no config vars end with _URL', function () {
      const configVars = ['DATABASE']
      expect(() => getConfigVarName(configVars)).to.throw('Database URL not found for this addon')
    })

    it('returns the first _URL config var when multiple exist', function () {
      const configVars = ['DATABASE_BASTION_KEY', 'DATABASE_URL', 'DATABASE_FOLLOWER_URL']
      const result = getConfigVarName(configVars)
      expect(result).to.equal('DATABASE_URL')
    })
  })

  describe('getConfigVarNameFromAttachment', function () {
    it('throws error when defaultAttachment doesn\'t have config var names', function () {
      const attachmentWithoutConfigVars = {
        ...defaultAttachment,
        config_vars: []
      }

      expect(() => getConfigVarNameFromAttachment(attachmentWithoutConfigVars, myAppConfigVars))
        .to.throw('No config vars found for MAIN_DATABASE; perhaps they were removed')
    })

    it('throws error when defaultAttachment config var is missing from config', function () {
      // Create config without MAIN_DATABASE_URL (which defaultAttachment should've set)
      const { MAIN_DATABASE_URL, ...configWithoutMainDatabase } = myAppConfigVars

      expect(() => getConfigVarNameFromAttachment(defaultAttachment, configWithoutMainDatabase))
        .to.throw('No config vars found for MAIN_DATABASE; perhaps they were removed')
    })

    it('throws error when defaultAttachment config var exists but is not a PostgreSQL connection string', function () {
      // Create config with MAIN_DATABASE_URL but overwrite it with dummy text
      const configWithTamperedValue = {
        ...myAppConfigVars,
        MAIN_DATABASE_URL: 'tampered-value-assigned-by-user'
      }

      expect(() => getConfigVarNameFromAttachment(defaultAttachment, configWithTamperedValue))
        .to.throw('No config vars found for MAIN_DATABASE; perhaps they were removed')
    })

    it('returns the default config var name when it exists and contains a PostgreSQL connection string', function () {
      const result = getConfigVarNameFromAttachment(defaultAttachment, myAppConfigVars)

      expect(result).to.equal('MAIN_DATABASE_URL')
    })

    it('returns the first _URL config var when default config var name is not in attachment config vars', function () {
      // Modify defaultAttachment to use MAIN_DB_URL instead of MAIN_DATABASE_URL
      const attachmentWithDifferentConfigVar = {
        ...defaultAttachment,
        config_vars: ['MAIN_DB_URL']
      }

      // Modify myAppConfigVars to use MAIN_DB_URL instead of MAIN_DATABASE_URL
      const { MAIN_DATABASE_URL, ...configWithoutMainDatabase } = myAppConfigVars
      const configWithDifferentConfigVar = {
        ...configWithoutMainDatabase,
        MAIN_DB_URL: 'postgres://user1:password1@main-database.example.com:5432/db1'
      }

      const result = getConfigVarNameFromAttachment(attachmentWithDifferentConfigVar, configWithDifferentConfigVar)

      expect(result).to.equal('MAIN_DB_URL')
    })
  })
})
