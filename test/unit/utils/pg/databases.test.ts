/* eslint-disable camelcase */
import {APIClient} from '@heroku-cli/command'
import {HerokuAPIError} from '@heroku-cli/command/lib/api-client.js'
import {HTTPError} from '@heroku/http-call'
import {Config} from '@oclif/core'
import ansis from 'ansis'
import nock from 'nock'
import {
  afterEach, beforeEach, describe, expect, it, MockInstance, vi,
} from 'vitest'

import {AmbiguousError} from '../../../../src/errors/ambiguous.js'
import {NotFound} from '../../../../src/errors/not-found.js'
import AddonAttachmentResolver from '../../../../src/utils/addons/attachment-resolver.js'
import {configVarsByAppIdCache} from '../../../../src/utils/pg/config-vars.js'
import DatabaseResolver from '../../../../src/utils/pg/databases.js'
import {
  advancedDatabase,
  performanceDatabase,
  premiumDatabase,
  standardDatabase,
} from '../../../fixtures/addon-mocks.js'
import {
  advancedDatabaseAttachment,
  credentialAttachment,
  defaultAttachment,
  developerAddonAttachment,
  equivalentAttachment,
  followerAttachment,
  foreignAttachment,
  foreignFollowerAttachment,
  HEROKU_API,
  miniDatabaseAttachment,
  performanceDatabaseAttachment,
  premiumDatabaseAttachment,
  privateDatabaseAttachment,
  shieldDatabaseAttachment,
} from '../../../fixtures/attachment-mocks.js'
import {
  myAppConfigVars,
  myOtherAppConfigVars,
  privateDatabaseConfigVars,
  shieldDatabaseConfigVars,
} from '../../../fixtures/config-var-mocks.js'

describe('DatabaseResolver', function () {
  describe('getAllLegacyDatabases', function () {
    let config: Config
    let heroku: APIClient
    let env: typeof process.env
    let herokuApi: nock.Scope

    beforeEach(async function () {
      config = await Config.load(process.cwd())
      heroku = new APIClient(config)
      env = process.env
      herokuApi = nock(HEROKU_API)
    })

    afterEach(function () {
      process.env = env
      vi.restoreAllMocks()
      nock.cleanAll()
      herokuApi.done()
    })

    describe('when the app has no Heroku Postgres databases', function () {
      it('returns an empty array', async function () {
        // Mock the Heroku API to return empty array (no attachments)
        herokuApi
          .get('/apps/app-no-addons/addon-attachments')
          .reply(200, [])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('app-no-addons')
        expect(result).toEqual([])
      })
    })

    describe('when the app has only Advanced-tier databases', function () {
      it('throws an error', async function () {
        herokuApi
          .get('/apps/my-app/addon-attachments')
          .reply(200, [
            advancedDatabaseAttachment,
            performanceDatabaseAttachment,
          ])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('my-app')
        expect(result).toEqual([])
      })
    })

    describe('when the app has only non-Advanced-tier databases', function () {
      it('returns an array containing all non-Advanced-tier databases', async function () {
        herokuApi
          .get('/apps/my-app/addon-attachments')
          .reply(200, [
            defaultAttachment,
            premiumDatabaseAttachment,
            miniDatabaseAttachment,
          ])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('my-app')
        expect(result).toEqual([
          {...defaultAttachment.addon, attachment_names: ['MAIN_DATABASE']},
          {...premiumDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_PURPLE']},
          {...miniDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_WHITE']},
        ])
      })
    })

    describe('when the app has both Advanced-tier and non-Advanced-tier databases', function () {
      it('returns an array containing only the non-Advanced-tier databases', async function () {
        herokuApi
          .get('/apps/my-app/addon-attachments')
          .reply(200, [
            defaultAttachment,
            advancedDatabaseAttachment,
            premiumDatabaseAttachment,
            performanceDatabaseAttachment,
            miniDatabaseAttachment,
          ])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('my-app')
        expect(result).toEqual([
          {...defaultAttachment.addon, attachment_names: ['MAIN_DATABASE']},
          {...premiumDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_PURPLE']},
          {...miniDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_WHITE']},
        ])
      })
    })

    describe('when the app has multiple attachments for the same add-on', function () {
      it('returns an array containing each add-on only once with all its attachment names', async function () {
        herokuApi
          .get('/apps/my-app/addon-attachments')
          .reply(200, [
            defaultAttachment,
            credentialAttachment,
            premiumDatabaseAttachment,
          ])

        const result = await new DatabaseResolver(heroku).getAllLegacyDatabases('my-app')
        expect(result).toEqual([
          {...defaultAttachment.addon, attachment_names: ['MAIN_DATABASE', 'MAIN_RO_DATABASE']},
          {...premiumDatabaseAttachment.addon, attachment_names: ['HEROKU_POSTGRESQL_PURPLE']},
        ])
      })
    })
  })

  describe('getArbitraryLegacyDB', function () {
    let config: Config
    let heroku: APIClient
    let env: typeof process.env
    let herokuApi: nock.Scope

    beforeEach(async function () {
      config = await Config.load(process.cwd())
      heroku = new APIClient(config)
      env = process.env
      herokuApi = nock(HEROKU_API)
    })

    afterEach(function () {
      process.env = env
      vi.restoreAllMocks()
      nock.cleanAll()
      herokuApi.done()
    })

    describe('when the app has no Heroku Postgres databases', function () {
      it('throws an error', async function () {
        // Mock the Heroku API to return empty array (no attachments)
        herokuApi
          .get('/apps/app-no-addons/addons')
          .reply(200, [])

        await expect(new DatabaseResolver(heroku).getArbitraryLegacyDB('app-no-addons'))
          .rejects.toThrow('No Heroku Postgres legacy database on app-no-addons')
      })
    })

    describe('when the app has only Advanced-tier databases', function () {
      it('throws an error', async function () {
        herokuApi
          .get('/apps/my-app/addons')
          .reply(200, [
            advancedDatabase,
            performanceDatabase,
          ])

        await expect(new DatabaseResolver(heroku).getArbitraryLegacyDB('my-app'))
          .rejects.toThrow('No Heroku Postgres legacy database on my-app')
      })
    })

    describe('when the app has only non-Advanced-tier databases', function () {
      it('resolves to the first database', async function () {
        herokuApi
          .get('/apps/my-app/addons')
          .reply(200, [
            standardDatabase,
            premiumDatabase,
          ])

        const resolvedAddon = await new DatabaseResolver(heroku).getArbitraryLegacyDB('my-app')
        expect(resolvedAddon).toEqual(standardDatabase)
      })
    })

    describe('when the app has both Advanced-tier and non-Advanced-tier databases', function () {
      it('resolves to the first non-Advanced-tier database', async function () {
        herokuApi
          .get('/apps/my-app/addons')
          .reply(200, [
            advancedDatabase,
            premiumDatabase,
            performanceDatabase,
            standardDatabase,
          ])

        const resolvedAddon = await new DatabaseResolver(heroku).getArbitraryLegacyDB('my-app')
        expect(resolvedAddon).toEqual(premiumDatabase)
      })
    })
  })

  describe('getAttachment', function () {
    let config: Config
    let heroku: APIClient
    let addonAttachmentResolveStub: MockInstance
    let env: typeof process.env
    let herokuApi: nock.Scope

    beforeEach(async function () {
      config = await Config.load(process.cwd())
      heroku = new APIClient(config)
      addonAttachmentResolveStub = vi.spyOn(AddonAttachmentResolver.prototype, 'resolve')
      env = process.env
      herokuApi = nock(HEROKU_API)
      configVarsByAppIdCache.clear()
    })

    afterEach(function () {
      process.env = env
      vi.restoreAllMocks()
      nock.cleanAll()
      herokuApi.done()
    })

    describe('when matchesHelper returns a single match', function () {
      it('returns the single attachment when matchesHelper finds exactly one match', async function () {
        addonAttachmentResolveStub.mockResolvedValue(defaultAttachment)

        const result = await new DatabaseResolver(heroku).getAttachment('my-app', 'MAIN_DATABASE')

        expect(result).toEqual(defaultAttachment)
        expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-app', 'MAIN_DATABASE', {addonService: 'heroku-postgresql', namespace: undefined})
      })

      it('parses app name from database argument when using \'app::attachment\' format', async function () {
        addonAttachmentResolveStub.mockResolvedValue(foreignAttachment)

        const result = await new DatabaseResolver(heroku).getAttachment('my-app', 'my-other-app::MAIN_DATABASE')

        expect(result).toEqual(foreignAttachment)
        expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-other-app', 'MAIN_DATABASE', {addonService: 'heroku-postgresql', namespace: undefined})
      })

      it('handles existing namespace', async function () {
        addonAttachmentResolveStub.mockResolvedValue(credentialAttachment)

        const result = await new DatabaseResolver(heroku).getAttachment('my-app', 'DATABASE', 'read-only')

        expect(result).toEqual(credentialAttachment)
        expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-app', 'DATABASE', {addonService: 'heroku-postgresql', namespace: 'read-only'})
      })

      it('respects value of HEROKU_POSTGRESQL_ADDON_NAME', async function () {
        process.env = {
          HEROKU_POSTGRESQL_ADDON_NAME: 'heroku-postgresql-devname',
        }
        addonAttachmentResolveStub.mockResolvedValue(developerAddonAttachment)

        const result = await new DatabaseResolver(heroku).getAttachment('my-app', 'DEV_ADDON_DATABASE')

        expect(result).toEqual(developerAddonAttachment)
        expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-app', 'DEV_ADDON_DATABASE', {addonService: 'heroku-postgresql-devname', namespace: undefined})
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
        addonAttachmentResolveStub.mockRejectedValue(notFoundError)

        // Mock the Heroku API to return empty array (no attachments)
        herokuApi
          .get('/apps/app-no-addons/addon-attachments')
          .reply(200, [])

        try {
          await new DatabaseResolver(heroku).getAttachment('app-no-addons', 'MAIN_DATABASE')
        } catch (error: unknown) {
          expect(addonAttachmentResolveStub).toHaveBeenCalledWith('app-no-addons', 'MAIN_DATABASE', {addonService: 'heroku-postgresql', namespace: undefined})
          // Symbol (⬢) is only included when TTY supports ANSI256, so just check the app name
          expect(ansis.strip((error as Error).message)).toMatch(/app-no-addons has no databases/)
        }
      })

      it('throws error when app has databases but requested database does not exist', async function () {
        addonAttachmentResolveStub.mockRejectedValue(notFoundError)

        // Mock the Heroku API to return available attachments
        herokuApi
          .get('/apps/my-app/addon-attachments')
          .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])
          .get('/apps/my-app/config-vars')
          .reply(200, myAppConfigVars)

        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'NONEXISTENT_DB')
        } catch (error: unknown) {
          expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-app', 'NONEXISTENT_DB', {addonService: 'heroku-postgresql', namespace: undefined})
          expect((error as Error).message).toBe('Unknown database: NONEXISTENT_DB. Valid options are: MAIN_DATABASE, MAIN_RO_DATABASE, FOLLOWER_DATABASE')
        }
      })

      it('handles app::database format when no matches found', async function () {
        addonAttachmentResolveStub.mockRejectedValue(notFoundError)

        // Mock the Heroku API to return available attachments
        herokuApi
          .get('/apps/app-no-addons/addon-attachments')
          .reply(200, [])

        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'app-no-addons::MAIN_DATABASE')
        } catch (error: unknown) {
          expect(addonAttachmentResolveStub).toHaveBeenCalledWith('app-no-addons', 'MAIN_DATABASE', {addonService: 'heroku-postgresql', namespace: undefined})
          // Symbol (⬢) is only included when TTY supports ANSI256, so just check the app name
          expect(ansis.strip((error as Error).message)).toMatch(/app-no-addons has no databases/)
        }
      })

      it('handles non-existent namespace', async function () {
        addonAttachmentResolveStub.mockRejectedValue(new NotFound())

        // In this case, there's no fetching app add-on attachments from Platform API, because the matchesHelper
        // function re-throws the NotFound error received from the resolver.
        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'DATABASE', 'missing-namespace')
        } catch (error: unknown) {
          expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-app', 'DATABASE', {addonService: 'heroku-postgresql', namespace: 'missing-namespace'})
          expect((error as Error).message).toBe('Couldn\'t find that addon.')
        }
      })

      it('respects value of HEROKU_POSTGRESQL_ADDON_NAME env var', async function () {
        process.env = {
          HEROKU_POSTGRESQL_ADDON_NAME: 'heroku-postgresql-devname',
        }
        addonAttachmentResolveStub.mockRejectedValue(notFoundError)

        // Mock the Heroku API to return available attachments for the specified addon service
        herokuApi
          .get('/apps/my-app/addon-attachments')
          .reply(200, [developerAddonAttachment])
          .get('/apps/my-app/config-vars')
          .reply(200, myAppConfigVars)

        await expect(new DatabaseResolver(heroku).getAttachment('my-app', 'FOLLOWER'))
          .rejects.toThrow('Unknown database: FOLLOWER. Valid options are: DEV_ADDON_DATABASE')
        expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-app', 'FOLLOWER', {addonService: 'heroku-postgresql-devname', namespace: undefined})
      })

      it('returns any matches found via config var names', async function () {
        addonAttachmentResolveStub.mockRejectedValue(notFoundError)

        // Mock the Heroku API to return available attachments
        herokuApi
          .get('/apps/my-app/addon-attachments')
          .reply(200, [defaultAttachment, credentialAttachment, followerAttachment])
          .get('/apps/my-app/config-vars')
          .reply(200, myAppConfigVars)

        const result = await new DatabaseResolver(heroku).getAttachment('my-app', 'MAIN_DATABASE')
        expect(result).toEqual(defaultAttachment)
      })
    })

    describe('when matchesHelper returns multiple matches', function () {
      beforeEach(function () {
        configVarsByAppIdCache.clear()
      })

      it('throws AmbiguousError when multiple matches are found and they are different add-ons', async function () {
        addonAttachmentResolveStub.mockRejectedValue(new AmbiguousError(
          [defaultAttachment, credentialAttachment, followerAttachment],
          'addon_attachment',
        ))

        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'DATABASE')
        } catch (error: unknown) {
          expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-app', 'DATABASE', {addonService: 'heroku-postgresql', namespace: undefined})
          expect((error as Error).message).toBe('Ambiguous identifier; multiple matching add-ons found: MAIN_DATABASE, MAIN_RO_DATABASE, FOLLOWER_DATABASE.')
        }
      })

      it('throws AmbiguousError when multiple matches are found and they are non equivalent attachments (different namespaces)', async function () {
        addonAttachmentResolveStub.mockRejectedValue(new AmbiguousError(
          [defaultAttachment, credentialAttachment],
          'addon_attachment',
        ))

        // Mock the Heroku API to return config vars for the app (to check if the attachments are equivalent)
        herokuApi
          .get('/apps/my-app/config-vars')
          .reply(200, myAppConfigVars)

        try {
          await new DatabaseResolver(heroku).getAttachment('my-app', 'MAIN')
        } catch (error: unknown) {
          expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-app', 'MAIN', {addonService: 'heroku-postgresql', namespace: undefined})
          expect((error as Error).message).toBe('Ambiguous identifier; multiple matching add-ons found: MAIN_DATABASE, MAIN_RO_DATABASE.')
        }
      })

      it('returns the first match when multiple matches are found but they are equivalent', async function () {
        addonAttachmentResolveStub.mockRejectedValue(new AmbiguousError(
          [foreignFollowerAttachment, equivalentAttachment],
          'addon_attachment',
        ))

        // Mock the Heroku API to return config vars for the app (to check if the attachments are equivalent)
        herokuApi
          .get('/apps/my-other-app/config-vars')
          .reply(200, myOtherAppConfigVars)

        const result = await new DatabaseResolver(heroku).getAttachment('my-other-app', 'FOLLOWER')

        expect(result).toEqual(foreignFollowerAttachment)
        expect(addonAttachmentResolveStub).toHaveBeenCalledWith('my-other-app', 'FOLLOWER', {addonService: 'heroku-postgresql', namespace: undefined})
      })
    })
  })

  describe('getDatabase', function () {
    let config: Config
    let heroku: APIClient
    let getAttachmentStub: ReturnType<typeof vi.fn>
    let getConfigStub: ReturnType<typeof vi.fn>
    let fetchBastionConfigStub: ReturnType<typeof vi.fn>

    beforeEach(async function () {
      config = await Config.load(process.cwd())
      heroku = new APIClient(config)
      getAttachmentStub = vi.fn()
      getConfigStub = vi.fn()
      fetchBastionConfigStub = vi.fn()
    })

    afterEach(function () {
      vi.restoreAllMocks()
    })

    describe('when the attachment resolution step throws an error', function () {
      it('lets the error bubble up', async function () {
        // Setup stubs
        const errorMessage = 'Database not found'
        getAttachmentStub.mockRejectedValue(new Error(errorMessage))
        getConfigStub.mockResolvedValue(myAppConfigVars)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        vi.spyOn(databaseResolver, 'getAttachment').mockImplementation(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-app', 'NONEXISTENT_DATABASE'))
          .rejects.toThrow(errorMessage)

        expect(getAttachmentStub).toHaveBeenCalledWith('my-app', 'NONEXISTENT_DATABASE', undefined)
      })
    })

    describe('when the get config step throws an error', function () {
      it('lets the error bubble up', async function () {
        // Setup stubs
        const errorMessage = 'Database not found'
        getAttachmentStub.mockResolvedValue(defaultAttachment)
        getConfigStub.mockRejectedValue(new Error(errorMessage))
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        vi.spyOn(databaseResolver, 'getAttachment').mockImplementation(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-app', 'MAIN_DATABASE'))
          .rejects.toThrow(errorMessage)

        expect(getAttachmentStub).toHaveBeenCalledWith('my-app', 'MAIN_DATABASE', undefined)
      })
    })

    describe('when fetching the bastion config is required but throws an error', function () {
      it('lets the error bubble up', async function () {
        // Setup stubs
        const errorMessage = 'Database not found'
        getAttachmentStub.mockResolvedValue(privateDatabaseAttachment)
        getConfigStub.mockResolvedValue(privateDatabaseConfigVars)
        fetchBastionConfigStub.mockRejectedValue(new Error(errorMessage))
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub, fetchBastionConfigStub)
        vi.spyOn(databaseResolver, 'getAttachment').mockImplementation(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-private-app', 'DATABASE'))
          .rejects.toThrow(errorMessage)

        expect(getAttachmentStub).toHaveBeenCalledWith('my-private-app', 'DATABASE', undefined)
      })
    })

    describe('when arguments resolve to a single attachment with valid config vars', function () {
      it('returns correct connection details for an add-on in the Common Runtime', async function () {
        // Setup stubs
        getAttachmentStub.mockResolvedValue(defaultAttachment)
        getConfigStub.mockResolvedValue(myAppConfigVars)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        vi.spyOn(databaseResolver, 'getAttachment').mockImplementation(getAttachmentStub)

        const result = await databaseResolver.getDatabase('my-app', 'MAIN_DATABASE')

        expect(getAttachmentStub).toHaveBeenCalledWith('my-app', 'MAIN_DATABASE', undefined)
        expect(getConfigStub).toHaveBeenCalledWith(heroku, 'my-app')
        expect(result).toHaveProperty('attachment', defaultAttachment)
        expect(result).toHaveProperty('host', 'main-database.example.com')
        expect(result).toHaveProperty('port', '5432')
        expect(result).toHaveProperty('database', 'db1')
        expect(result).toHaveProperty('user', 'user1')
        expect(result).toHaveProperty('password', 'password1')
        expect(result).toHaveProperty('url', 'postgres://user1:password1@main-database.example.com:5432/db1')
      })

      it('returns correct connection details for a database add-on in a Shield Private Space', async function () {
        // Setup stubs
        getAttachmentStub.mockResolvedValue(shieldDatabaseAttachment)
        getConfigStub.mockResolvedValue(shieldDatabaseConfigVars)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        vi.spyOn(databaseResolver, 'getAttachment').mockImplementation(getAttachmentStub)

        const result = await databaseResolver.getDatabase('my-shield-app', 'DATABASE')

        expect(getAttachmentStub).toHaveBeenCalledWith('my-shield-app', 'DATABASE', undefined)
        expect(getConfigStub).toHaveBeenCalledWith(heroku, 'my-shield-app')
        expect(result).toHaveProperty('attachment', shieldDatabaseAttachment)
        expect(result).toHaveProperty('host', 'shield-database.example.com')
        expect(result).toHaveProperty('port', '5432')
        expect(result).toHaveProperty('database', 'db1')
        expect(result).toHaveProperty('user', 'user7')
        expect(result).toHaveProperty('password', 'password7')
        expect(result).toHaveProperty('bastionHost', '10.7.0.1')
        expect(result).toHaveProperty('bastionKey', '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----')
      })

      it('returns correct connection details for a database add-on in a non-Shield Private Space', async function () {
        // Setup stubs
        getAttachmentStub.mockResolvedValue(privateDatabaseAttachment)
        getConfigStub.mockResolvedValue(privateDatabaseConfigVars)
        fetchBastionConfigStub.mockResolvedValue({
          bastionHost: '10.7.0.2',
          bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
        })
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub, fetchBastionConfigStub)
        vi.spyOn(databaseResolver, 'getAttachment').mockImplementation(getAttachmentStub)

        const result = await databaseResolver.getDatabase('my-private-app', 'DATABASE')

        expect(getAttachmentStub).toHaveBeenCalledWith('my-private-app', 'DATABASE', undefined)
        expect(getConfigStub).toHaveBeenCalledWith(heroku, 'my-private-app')
        expect(result).toHaveProperty('attachment', privateDatabaseAttachment)
        expect(result).toHaveProperty('host', 'private-database.example.com')
        expect(result).toHaveProperty('port', '5432')
        expect(result).toHaveProperty('database', 'db1')
        expect(result).toHaveProperty('user', 'user8')
        expect(result).toHaveProperty('password', 'password8')
        expect(result).toHaveProperty('bastionHost', '10.7.0.2')
        expect(result).toHaveProperty('bastionKey', '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----')
      })
    })

    describe('when arguments resolve to a single attachment with invalid config vars', function () {
      it('throws when the expected config var is missing', async function () {
        // Setup stubs
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {MAIN_DATABASE_URL, ...configWithoutMainDatabase} = myAppConfigVars
        getAttachmentStub.mockResolvedValue(defaultAttachment)
        getConfigStub.mockResolvedValue(configWithoutMainDatabase)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        vi.spyOn(databaseResolver, 'getAttachment').mockImplementation(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-app', 'MAIN_DATABASE'))
          .rejects.toThrow('No config vars found for MAIN_DATABASE; perhaps they were removed')

        expect(getAttachmentStub).toHaveBeenCalledWith('my-app', 'MAIN_DATABASE', undefined)
      })

      it('throws when the expected config var does not contain a valid PostgreSQL connection string', async function () {
        // Setup stubs
        const configWithTamperedValue = {
          ...myAppConfigVars,
          MAIN_DATABASE_URL: 'tampered-value-assigned-by-user',
        }
        getAttachmentStub.mockResolvedValue(defaultAttachment)
        getConfigStub.mockResolvedValue(configWithTamperedValue)
        const databaseResolver = new DatabaseResolver(heroku, getConfigStub)
        vi.spyOn(databaseResolver, 'getAttachment').mockImplementation(getAttachmentStub)

        await expect(databaseResolver.getDatabase('my-app', 'MAIN_DATABASE'))
          .rejects.toThrow('No config vars found for MAIN_DATABASE; perhaps they were removed')

        expect(getAttachmentStub).toHaveBeenCalledWith('my-app', 'MAIN_DATABASE', undefined)
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

        expect(result).toEqual({
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

        expect(result).toEqual({
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

        expect(result).toEqual({
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

        expect(result).toEqual({
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

        expect(result.port).toBe('5433')
      })

      it('uses PGPORT when parsing database name without connection string', function () {
        process.env = {
          PGPORT: '5433',
        }
        const dbName = 'my_database'
        const result = DatabaseResolver.parsePostgresConnectionString(dbName)

        expect(result.port).toBe('5433')
      })

      it('prioritizes connection string port over PGPORT', function () {
        process.env = {
          PGPORT: '5433',
        }
        const connString = 'postgres://user1:password1@host.example.com:5434/database1'
        const result = DatabaseResolver.parsePostgresConnectionString(connString)

        expect(result.port).toBe('5434')
      })

      it('uses PGPORT when connection string has no port and no hostname', function () {
        process.env = {
          PGPORT: '5433',
        }
        const dbName = 'my_database'
        const result = DatabaseResolver.parsePostgresConnectionString(dbName)

        expect(result.port).toBe('5433')
      })
    })

    describe('when PGPORT environment variable is not set', function () {
      it('uses default port 5432 when no port is specified in connection string', function () {
        process.env = {}
        const connString = 'postgres://user1:password1@host.example.com/database1'
        const result = DatabaseResolver.parsePostgresConnectionString(connString)

        expect(result.port).toBe('5432')
      })

      it('doesn\'t set a port when parsing database name without connection string', function () {
        process.env = {}
        const dbName = 'my_database'
        const result = DatabaseResolver.parsePostgresConnectionString(dbName)

        expect(result.port).toBe('')
      })

      it('doesn\'t set a port when connection string has no port and no hostname', function () {
        process.env = {}
        const dbName = 'my_database'
        const result = DatabaseResolver.parsePostgresConnectionString(dbName)

        expect(result.port).toBe('')
      })
    })
  })
})
