/* eslint-disable camelcase */
import {HTTPError} from '@heroku/http-call'
import {APIClient} from '@heroku-cli/command'
import {HerokuAPIError} from '@heroku-cli/command/lib/api-client'
import {Config} from '@oclif/core'
import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'
import sinon from 'sinon'

import {AmbiguousError} from '../../../../src/errors/ambiguous'
import {NotFound} from '../../../../src/errors/not-found'
import AddonAttachmentResolver from '../../../../src/utils/addons/attachment-resolver'
import {configVarsByAppIdCache} from '../../../../src/utils/pg/config-vars'
import DatabaseResolver from '../../../../src/utils/pg/databases'
import {
  advancedDatabase,
  performanceDatabase,
  premiumDatabase,
  standardDatabase,
} from '../../../fixtures/addon-mocks'
import {
  HEROKU_API,
  advancedDatabaseAttachment,
  credentialAttachment,
  defaultAttachment,
  developerAddonAttachment,
  equivalentAttachment,
  followerAttachment,
  foreignAttachment,
  foreignFollowerAttachment,
  miniDatabaseAttachment,
  performanceDatabaseAttachment,
  premiumDatabaseAttachment,
  privateDatabaseAttachment,
  shieldDatabaseAttachment,
} from '../../../fixtures/attachment-mocks'
import {
  myAppConfigVars,
  myOtherAppConfigVars,
  privateDatabaseConfigVars,
  shieldDatabaseConfigVars,
} from '../../../fixtures/config-var-mocks'

const {expect} = chai

chai.use(chaiAsPromised)

describe('DatabaseResolver', function () {
  describe('getAllLegacyDatabases', function () {
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
      // eslint-disable-next-line import/no-named-as-default-member
      nock.cleanAll()
    })

    describe('when the app has no Heroku Postgres databases', function () {
      it('returns an empty array', async function () {
        // Mock the Heroku API to return empty array (no attachments)
        const api = nock(HEROKU_API)
          .get('/apps/app-no-addons/addon-attachments')
          .reply(200, [])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('app-no-addons')
        expect(result).to.deep.equal([])
        api.done()
      })
    })

    describe('when the app has only Advanced-tier databases', function () {
      it('throws an error', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/addon-attachments')
          .reply(200, [
            advancedDatabaseAttachment,
            performanceDatabaseAttachment,
          ])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('my-app')
        expect(result).to.deep.equal([])
        api.done()
      })
    })

    describe('when the app has only non-Advanced-tier databases', function () {
      it('returns an array containing all non-Advanced-tier databases', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/addon-attachments')
          .reply(200, [
            defaultAttachment,
            premiumDatabaseAttachment,
            miniDatabaseAttachment,
          ])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('my-app')
        expect(result).to.deep.equal([
          {...defaultAttachment.addon, attachment_names: ['MAIN_DATABASE']},
          {...premiumDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_PURPLE']},
          {...miniDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_WHITE']},
        ])
        api.done()
      })
    })

    describe('when the app has both Advanced-tier and non-Advanced-tier databases', function () {
      it('returns an array containing only the non-Advanced-tier databases', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/addon-attachments')
          .reply(200, [
            defaultAttachment,
            advancedDatabaseAttachment,
            premiumDatabaseAttachment,
            performanceDatabaseAttachment,
            miniDatabaseAttachment,
          ])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('my-app')
        expect(result).to.deep.equal([
          {...defaultAttachment.addon, attachment_names: ['MAIN_DATABASE']},
          {...premiumDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_PURPLE']},
          {...miniDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_WHITE']},
        ])
        api.done()
      })
    })

    describe('when the app has multiple attachments for the same add-on', function () {
      it('returns an array containing each add-on only once with all its attachment names', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/addon-attachments')
          .reply(200, [
            defaultAttachment,
            credentialAttachment,
            premiumDatabaseAttachment,
          ])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('my-app')
        expect(result).to.deep.equal([
          {...defaultAttachment.addon, attachment_names: ['MAIN_DATABASE', 'MAIN_RO_DATABASE']},
          {...premiumDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_PURPLE']},
        ])
        api.done()
      })
    })
  })

  describe('getArbitraryLegacyDB', function () {
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
      // eslint-disable-next-line import/no-named-as-default-member
      nock.cleanAll()
    })

    describe('when the app has no Heroku Postgres databases', function () {
      it('throws an error', async function () {
        // Mock the Heroku API to return empty array (no attachments)
        const api = nock(HEROKU_API)
          .get('/apps/app-no-addons/addons')
          .reply(200, [])

        await expect(new DatabaseResolver(heroku).getArbitraryLegacyDB('app-no-addons'))
          .to.be.rejectedWith('No Heroku Postgres legacy database on app-no-addons')
        api.done()
      })
    })

    describe('when the app has only Advanced-tier databases', function () {
      it('throws an error', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/addons')
          .reply(200, [
            advancedDatabase,
            performanceDatabase,
          ])

        await expect(new DatabaseResolver(heroku).getArbitraryLegacyDB('my-app'))
          .to.be.rejectedWith('No Heroku Postgres legacy database on my-app')
        api.done()
      })
    })

    describe('when the app has only non-Advanced-tier databases', function () {
      it('resolves to the first database', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/addons')
          .reply(200, [
            standardDatabase,
            premiumDatabase,
          ])

        const resolvedAddon = await new DatabaseResolver(heroku).getArbitraryLegacyDB('my-app')
        expect(resolvedAddon).to.deep.equal(standardDatabase)
        api.done()
      })
    })

    describe('when the app has both Advanced-tier and non-Advanced-tier databases', function () {
      it('resolves to the first non-Advanced-tier database', async function () {
        const api = nock(HEROKU_API)
          .get('/apps/my-app/addons')
          .reply(200, [
            advancedDatabase,
            premiumDatabase,
            performanceDatabase,
            standardDatabase,
          ])

        const resolvedAddon = await new DatabaseResolver(heroku).getArbitraryLegacyDB('my-app')
        expect(resolvedAddon).to.deep.equal(premiumDatabase)
        api.done()
      })
    })
  })

  describe('getAttachment', function () {
    let config: Config
    let heroku: APIClient
    let addonAttachmentResolveStub: sinon.SinonStub
    let env: typeof process.env

    beforeEach(async function () {
      config = await Config.load()
      heroku = new APIClient(config)
      addonAttachmentResolveStub = sinon.stub(AddonAttachmentResolver.prototype, 'resolve')
      env = process.env
    })

    afterEach(function () {
      process.env = env
      sinon.restore()
      // eslint-disable-next-line import/no-named-as-default-member
      nock.cleanAll()
    })

    describe('when matchesHelper returns a single match', function () {
      it('returns the single attachment when matchesHelper finds exactly one match', async function () {
        addonAttachmentResolveStub.resolves(defaultAttachment)

        const result = await new DatabaseResolver(heroku).getAttachment('my-app', 'MAIN_DATABASE')

        expect(result).to.deep.equal(defaultAttachment)
        sinon.assert.calledWith(
          addonAttachmentResolveStub, 'my-app', 'MAIN_DATABASE', {addonService: 'heroku-postgresql', namespace: undefined},
        )
      })

      it('parses app name from database argument when using \'app::attachment\' format', async function () {
        addonAttachmentResolveStub.resolves(foreignAttachment)

        const result = await new DatabaseResolver(heroku).getAttachment('my-app', 'my-other-app::MAIN_DATABASE')

        expect(result).to.deep.equal(foreignAttachment)
        sinon.assert.calledWith(
          addonAttachmentResolveStub, 'my-other-app', 'MAIN_DATABASE', {addonService: 'heroku-postgresql', namespace: undefined},
        )
      })

      it('handles existing namespace', async function () {
        addonAttachmentResolveStub.resolves(credentialAttachment)

        const result = await new DatabaseResolver(heroku).getAttachment('my-app', 'DATABASE', 'read-only')

        expect(result).to.deep.equal(credentialAttachment)
        sinon.assert.calledWith(
          addonAttachmentResolveStub, 'my-app', 'DATABASE', {addonService: 'heroku-postgresql', namespace: 'read-only'},
        )
      })

      it('respects value of HEROKU_POSTGRESQL_ADDON_NAME', async function () {
        process.env = {
          HEROKU_POSTGRESQL_ADDON_NAME: 'heroku-postgresql-devname',
        }
        addonAttachmentResolveStub.resolves(developerAddonAttachment)

        const result = await new DatabaseResolver(heroku).getAttachment('my-app', 'DEV_ADDON_DATABASE')

        expect(result).to.deep.equal(developerAddonAttachment)
        sinon.assert.calledWith(
          addonAttachmentResolveStub, 'my-app', 'DEV_ADDON_DATABASE', {addonService: 'heroku-postgresql-devname', namespace: undefined},
        )
      })
    })

    describe('when matchesHelper returns no matches', function () {
      // Simulate a 404 error from the resolver (no matches found)
      const httpError = {
        body: {id: 'not_found', message: 'Couldn\'t find that add on attachment.', resource: 'addon-attachment'},
        statusCode: 404,
      } as HTTPError
      const notFoundError = new HerokuAPIError(httpError)

      it('throws error when app has no databases', async function () {
        addonAttachmentResolveStub.rejects(notFoundError)

        // Mock the Heroku API to return empty array (no attachments)
        const api = nock(HEROKU_API)
          .get('/apps/app-no-addons/addon-attachments')
          .reply(200, [])

        try {
          await new DatabaseResolver(heroku).getAttachment('app-no-addons', 'MAIN_DATABASE')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            addonAttachmentResolveStub, 'app-no-addons', 'MAIN_DATABASE', {addonService: 'heroku-postgresql', namespace: undefined},
          )
          api.done()
          expect((error as Error).message).to.equal('app-no-addons has no databases')
        }
      })

      it('throws error when app has databases but requested database does not exist', async function () {
        addonAttachmentResolveStub.rejects(notFoundError)

        // Mock the Heroku API to return available attachments
        const api = nock(HEROKU_API)
          .get('/apps/my-app/addon-attachments')
          .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])

        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'NONEXISTENT_DB')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            addonAttachmentResolveStub, 'my-app', 'NONEXISTENT_DB', {addonService: 'heroku-postgresql', namespace: undefined},
          )
          api.done()
          expect((error as Error).message).to.equal(
            'Unknown database: NONEXISTENT_DB. Valid options are: MAIN_DATABASE_URL, MAIN_RO_DATABASE_URL, FOLLOWER_DATABASE_URL',
          )
        }
      })

      it('handles app::database format when no matches found', async function () {
        addonAttachmentResolveStub.rejects(notFoundError)

        // Mock the Heroku API to return available attachments
        const api = nock(HEROKU_API)
          .get('/apps/app-no-addons/addon-attachments')
          .reply(200, [])

        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'app-no-addons::MAIN_DATABASE')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            addonAttachmentResolveStub, 'app-no-addons', 'MAIN_DATABASE', {addonService: 'heroku-postgresql', namespace: undefined},
          )
          api.done()
          expect((error as Error).message).to.equal('app-no-addons has no databases')
        }
      })

      it('handles non-existent namespace', async function () {
        addonAttachmentResolveStub.rejects(new NotFound())

        // In this case, there's no fetching app add-on attachments from Platform API, because the matchesHelper
        // function re-throws the NotFound error received from the resolver.
        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'DATABASE', 'missing-namespace')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            addonAttachmentResolveStub, 'my-app', 'DATABASE', {addonService: 'heroku-postgresql', namespace: 'missing-namespace'},
          )
          expect((error as Error).message).to.equal('Couldn\'t find that addon.')
        }
      })

      it('respects value of HEROKU_POSTGRESQL_ADDON_NAME env var', async function () {
        process.env = {
          HEROKU_POSTGRESQL_ADDON_NAME: 'heroku-postgresql-devname',
        }
        addonAttachmentResolveStub.rejects(notFoundError)

        // Mock the Heroku API to return available attachments for the specified addon service
        nock(HEROKU_API)
          .get('/apps/my-app/addon-attachments')
          .reply(200, [developerAddonAttachment])

        await expect(new DatabaseResolver(heroku).getAttachment('my-app', 'FOLLOWER'))
          .to.be.rejectedWith('Unknown database: FOLLOWER. Valid options are: DEV_ADDON_DATABASE_URL')
        sinon.assert.calledWith(
          addonAttachmentResolveStub, 'my-app', 'FOLLOWER', {addonService: 'heroku-postgresql-devname', namespace: undefined},
        )
      })
    })

    describe('when matchesHelper returns multiple matches', function () {
      beforeEach(function () {
        configVarsByAppIdCache.clear()
      })

      it('throws AmbiguousError when multiple matches are found and they are different add-ons', async function () {
        addonAttachmentResolveStub.rejects(
          new AmbiguousError(
            [defaultAttachment, credentialAttachment, followerAttachment],
            'addon_attachment',
          ),
        )

        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'DATABASE')
        } catch (error: unknown) {
          sinon.assert.calledWith(
            addonAttachmentResolveStub, 'my-app', 'DATABASE', {addonService: 'heroku-postgresql', namespace: undefined},
          )
          expect((error as Error).message).to.equal(
            'Ambiguous identifier; multiple matching add-ons found: MAIN_DATABASE, MAIN_RO_DATABASE, FOLLOWER_DATABASE.',
          )
        }
      })

      it('throws AmbiguousError when multiple matches are found and they are non equivalent attachments (different namespaces)', async function () {
        addonAttachmentResolveStub.rejects(
          new AmbiguousError(
            [defaultAttachment, credentialAttachment],
            'addon_attachment',
          ),
        )

        // Mock the Heroku API to return config vars for the app (to check if the attachments are equivalent)
        const api = nock(HEROKU_API)
          .get('/apps/my-app/config-vars')
          .reply(200, myAppConfigVars)

        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'MAIN')
        } catch (error: unknown) {
          api.done()
          sinon.assert.calledWith(
            addonAttachmentResolveStub, 'my-app', 'MAIN', {addonService: 'heroku-postgresql', namespace: undefined},
          )
          expect((error as Error).message).to.equal(
            'Ambiguous identifier; multiple matching add-ons found: MAIN_DATABASE, MAIN_RO_DATABASE.',
          )
        }
      })

      it('returns the first match when multiple matches are found but they are equivalent', async function () {
        addonAttachmentResolveStub.rejects(
          new AmbiguousError(
            [foreignFollowerAttachment, equivalentAttachment],
            'addon_attachment',
          ),
        )

        // Mock the Heroku API to return config vars for the app (to check if the attachments are equivalent)
        const api = nock(HEROKU_API)
          .get('/apps/my-other-app/config-vars')
          .reply(200, myOtherAppConfigVars)

        const result = await new DatabaseResolver(heroku).getAttachment('my-other-app', 'FOLLOWER')

        expect(result).to.deep.equal(foreignFollowerAttachment)
        api.done()
        sinon.assert.calledWith(
          addonAttachmentResolveStub, 'my-other-app', 'FOLLOWER', {addonService: 'heroku-postgresql', namespace: undefined},
        )
      })
    })
  })

  describe('getDatabase', function () {
    let config: Config
    let heroku: APIClient
    let getAttachmentStub: sinon.SinonStub
    let getConfigStub: sinon.SinonStub
    let fetchBastionConfigStub: sinon.SinonStub

    beforeEach(async function () {
      config = await Config.load()
      heroku = new APIClient(config)
      getAttachmentStub = sinon.stub()
      getConfigStub = sinon.stub()
      fetchBastionConfigStub = sinon.stub()
    })

    afterEach(function () {
      sinon.restore()
    })

    describe('when the attachment resolution step throws an error', function () {
      it('lets the error bubble up', async function () {
        // Setup stubs
        const errorMessage = 'Database not found'
        getAttachmentStub.rejects(new Error(errorMessage))
        getConfigStub.resolves(myAppConfigVars)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        sinon.stub(databaseResolver, 'getAttachment').callsFake(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-app', 'NONEXISTENT_DATABASE'))
          .to.be.rejectedWith(errorMessage)

        // eslint-disable-next-line unicorn/no-useless-undefined
        sinon.assert.calledWith(getAttachmentStub, 'my-app', 'NONEXISTENT_DATABASE', undefined)
      })
    })

    describe('when the get config step throws an error', function () {
      it('lets the error bubble up', async function () {
        // Setup stubs
        const errorMessage = 'Database not found'
        getAttachmentStub.resolves(defaultAttachment)
        getConfigStub.rejects(new Error(errorMessage))
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        sinon.stub(databaseResolver, 'getAttachment').callsFake(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-app', 'MAIN_DATABASE'))
          .to.be.rejectedWith(errorMessage)

        // eslint-disable-next-line unicorn/no-useless-undefined
        sinon.assert.calledWith(getAttachmentStub, 'my-app', 'MAIN_DATABASE', undefined)
      })
    })

    describe('when fetching the bastion config is required but throws an error', function () {
      it('lets the error bubble up', async function () {
        // Setup stubs
        const errorMessage = 'Database not found'
        getAttachmentStub.resolves(privateDatabaseAttachment)
        getConfigStub.resolves(privateDatabaseConfigVars)
        fetchBastionConfigStub.rejects(new Error(errorMessage))
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub, fetchBastionConfigStub)
        sinon.stub(databaseResolver, 'getAttachment').callsFake(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-private-app', 'DATABASE'))
          .to.be.rejectedWith(errorMessage)

        // eslint-disable-next-line unicorn/no-useless-undefined
        sinon.assert.calledWith(getAttachmentStub, 'my-private-app', 'DATABASE', undefined)
      })
    })

    describe('when arguments resolve to a single attachment with valid config vars', function () {
      it('returns correct connection details for an add-on in the Common Runtime', async function () {
        // Setup stubs
        getAttachmentStub.resolves(defaultAttachment)
        getConfigStub.resolves(myAppConfigVars)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        sinon.stub(databaseResolver, 'getAttachment').callsFake(getAttachmentStub)

        const result = await databaseResolver.getDatabase('my-app', 'MAIN_DATABASE')

        // eslint-disable-next-line unicorn/no-useless-undefined
        sinon.assert.calledWith(getAttachmentStub, 'my-app', 'MAIN_DATABASE', undefined)
        sinon.assert.calledWith(getConfigStub, heroku, 'my-app')
        expect(result).to.have.property('attachment', defaultAttachment)
        expect(result).to.have.property('host', 'main-database.example.com')
        expect(result).to.have.property('port', '5432')
        expect(result).to.have.property('database', 'db1')
        expect(result).to.have.property('user', 'user1')
        expect(result).to.have.property('password', 'password1')
        expect(result).to.have.property('url', 'postgres://user1:password1@main-database.example.com:5432/db1')
      })

      it('returns correct connection details for a database add-on in a Shield Private Space', async function () {
        // Setup stubs
        getAttachmentStub.resolves(shieldDatabaseAttachment)
        getConfigStub.resolves(shieldDatabaseConfigVars)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        sinon.stub(databaseResolver, 'getAttachment').callsFake(getAttachmentStub)

        const result = await databaseResolver.getDatabase('my-shield-app', 'DATABASE')

        // eslint-disable-next-line unicorn/no-useless-undefined
        sinon.assert.calledWith(getAttachmentStub, 'my-shield-app', 'DATABASE', undefined)
        sinon.assert.calledWith(getConfigStub, heroku, 'my-shield-app')
        expect(result).to.have.property('attachment', shieldDatabaseAttachment)
        expect(result).to.have.property('host', 'shield-database.example.com')
        expect(result).to.have.property('port', '5432')
        expect(result).to.have.property('database', 'db1')
        expect(result).to.have.property('user', 'user7')
        expect(result).to.have.property('password', 'password7')
        expect(result).to.have.property('bastionHost', '10.7.0.1')
        expect(result).to.have.property('bastionKey', '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----')
      })

      it('returns correct connection details for a database add-on in a non-Shield Private Space', async function () {
        // Setup stubs
        getAttachmentStub.resolves(privateDatabaseAttachment)
        getConfigStub.resolves(privateDatabaseConfigVars)
        fetchBastionConfigStub.resolves({
          bastionHost: '10.7.0.2',
          bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
        })
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub, fetchBastionConfigStub)
        sinon.stub(databaseResolver, 'getAttachment').callsFake(getAttachmentStub)

        const result = await databaseResolver.getDatabase('my-private-app', 'DATABASE')

        // eslint-disable-next-line unicorn/no-useless-undefined
        sinon.assert.calledWith(getAttachmentStub, 'my-private-app', 'DATABASE', undefined)
        sinon.assert.calledWith(getConfigStub, heroku, 'my-private-app')
        expect(result).to.have.property('attachment', privateDatabaseAttachment)
        expect(result).to.have.property('host', 'private-database.example.com')
        expect(result).to.have.property('port', '5432')
        expect(result).to.have.property('database', 'db1')
        expect(result).to.have.property('user', 'user8')
        expect(result).to.have.property('password', 'password8')
        expect(result).to.have.property('bastionHost', '10.7.0.2')
        expect(result).to.have.property('bastionKey', '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----')
      })
    })

    describe('when arguments resolve to a single attachment with invalid config vars', function () {
      it('throws when the expected config var is missing', async function () {
        // Setup stubs
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {MAIN_DATABASE_URL, ...configWithoutMainDatabase} = myAppConfigVars
        getAttachmentStub.resolves(defaultAttachment)
        getConfigStub.resolves(configWithoutMainDatabase)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        sinon.stub(databaseResolver, 'getAttachment').callsFake(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-app', 'MAIN_DATABASE'))
          .to.be.rejectedWith('No config vars found for MAIN_DATABASE; perhaps they were removed')

        // eslint-disable-next-line unicorn/no-useless-undefined
        sinon.assert.calledWith(getAttachmentStub, 'my-app', 'MAIN_DATABASE', undefined)
      })

      it('throws when the expected config var does not contain a valid PostgreSQL connection string', async function () {
        // Setup stubs
        const configWithTamperedValue = {
          ...myAppConfigVars,
          MAIN_DATABASE_URL: 'tampered-value-assigned-by-user',
        }
        getAttachmentStub.resolves(defaultAttachment)
        getConfigStub.resolves(configWithTamperedValue)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        sinon.stub(databaseResolver, 'getAttachment').callsFake(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-app', 'MAIN_DATABASE'))
          .to.be.rejectedWith('No config vars found for MAIN_DATABASE; perhaps they were removed')

        // eslint-disable-next-line unicorn/no-useless-undefined
        sinon.assert.calledWith(getAttachmentStub, 'my-app', 'MAIN_DATABASE', undefined)
      })
    })
  })

  describe('parsePostgresConnectionString', function () {
    let env: typeof process.env

    beforeEach(async function () {
      env = process.env
    })

    afterEach(function () {
      process.env = env
    })

    describe('when parsing full PostgreSQL connection strings', function () {
      it('parses a complete PostgreSQL connection string with all components', function () {
        const connString = 'postgres://user1:password1@host.example.com:5432/database1'
        const result = DatabaseResolver.parsePostgresConnectionString(connString)

        expect(result).to.deep.equal({
          database: 'database1',
          host: 'host.example.com',
          password: 'password1',
          pathname: '/database1',
          port: '5432',
          url: 'postgres://user1:password1@host.example.com:5432/database1',
          user: 'user1',
        })
      })

      it('parses connection string with no port specified', function () {
        const connString = 'postgres://user1:password1@host.example.com/database1'
        const result = DatabaseResolver.parsePostgresConnectionString(connString)

        expect(result).to.deep.equal({
          database: 'database1',
          host: 'host.example.com',
          password: 'password1',
          pathname: '/database1',
          port: '5432',
          url: 'postgres://user1:password1@host.example.com/database1',
          user: 'user1',
        })
      })

      it('parses connection string with custom port', function () {
        const connString = 'postgres://user1:password1@host.example.com:5433/database1'
        const result = DatabaseResolver.parsePostgresConnectionString(connString)

        expect(result).to.deep.equal({
          database: 'database1',
          host: 'host.example.com',
          password: 'password1',
          pathname: '/database1',
          port: '5433',
          url: 'postgres://user1:password1@host.example.com:5433/database1',
          user: 'user1',
        })
      })
    })

    describe('when parsing database names (without connection string format)', function () {
      it('converts database name to full connection string format', function () {
        const dbName = 'my_database'
        const result = DatabaseResolver.parsePostgresConnectionString(dbName)

        expect(result).to.deep.equal({
          database: 'my_database',
          host: '',
          password: '',
          pathname: '/my_database',
          port: '',
          url: 'postgres:///my_database',
          user: '',
        })
      })
    })

    describe('when PGPORT environment variable is set', function () {
      it('uses PGPORT when no port is specified in connection string', function () {
        process.env = {
          PGPORT: '5433',
        }
        const connString = 'postgres://user1:password1@host.example.com/database1'
        const result = DatabaseResolver.parsePostgresConnectionString(connString)

        expect(result.port).to.equal('5433')
      })

      it('uses PGPORT when parsing database name without connection string', function () {
        process.env = {
          PGPORT: '5433',
        }
        const dbName = 'my_database'
        const result = DatabaseResolver.parsePostgresConnectionString(dbName)

        expect(result.port).to.equal('5433')
      })

      it('prioritizes connection string port over PGPORT', function () {
        process.env = {
          PGPORT: '5433',
        }
        const connString = 'postgres://user1:password1@host.example.com:5434/database1'
        const result = DatabaseResolver.parsePostgresConnectionString(connString)

        expect(result.port).to.equal('5434')
      })

      it('uses PGPORT when connection string has no port and no hostname', function () {
        process.env = {
          PGPORT: '5433',
        }
        const dbName = 'my_database'
        const result = DatabaseResolver.parsePostgresConnectionString(dbName)

        expect(result.port).to.equal('5433')
      })
    })

    describe('when PGPORT environment variable is not set', function () {
      it('uses default port 5432 when no port is specified in connection string', function () {
        process.env = {}
        const connString = 'postgres://user1:password1@host.example.com/database1'
        const result = DatabaseResolver.parsePostgresConnectionString(connString)

        expect(result.port).to.equal('5432')
      })

      it('doesn\'t set a port when parsing database name without connection string', function () {
        process.env = {}
        const dbName = 'my_database'
        const result = DatabaseResolver.parsePostgresConnectionString(dbName)

        expect(result.port).to.equal('')
      })

      it('doesn\'t set a port when connection string has no port and no hostname', function () {
        process.env = {}
        const dbName = 'my_database'
        const result = DatabaseResolver.parsePostgresConnectionString(dbName)

        expect(result.port).to.equal('')
      })
    })
  })
})
