/* eslint-disable camelcase */
import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import nock from 'nock'
import {Server} from 'node:net'
import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest'

import {
  bastionKeyPlan,
  fetchBastionConfig,
  getBastionConfig,
  getPsqlConfigs,
  sshTunnel,
} from '../../../../src/utils/pg/bastion.js'
import {
  advancedPrivateDatabaseAttachment,
  advancedShieldDatabaseAttachment,
  defaultAttachment,
  developerAddonAttachment,
  privateDatabaseAttachment,
  shieldDatabaseAttachment,
} from '../../../fixtures/attachment-mocks.js'
import {
  defaultConnectionDetails,
  privateDatabaseConnectionDetails,
  shieldDatabaseConnectionDetails,
} from '../../../fixtures/bastion-mocks.js'
import {
  emptyAppConfigVars,
  myAppConfigVars,
  shieldDatabaseConfigVars,
} from '../../../fixtures/config-var-mocks.js'
import {defaultPsqlConfigs, privateDatabasePsqlConfigs, shieldDatabasePsqlConfigs} from '../../../fixtures/psql-mocks.js'

describe('bastion', function () {
  describe('bastionKeyPlan', function () {
    it('returns true for Classic Private database attachments', function () {
      const result = bastionKeyPlan(privateDatabaseAttachment)
      expect(result).toBe(true)
    })

    it('returns false for Advanced Private database attachments', function () {
      const result = bastionKeyPlan(advancedPrivateDatabaseAttachment)
      expect(result).toBe(false)
    })

    it('returns false for attachments with plan names not containing "private"', function () {
      const result = bastionKeyPlan(defaultAttachment)
      expect(result).toBe(false)
    })

    it('returns false for Classic Shield database attachments', function () {
      const result = bastionKeyPlan(shieldDatabaseAttachment)
      expect(result).toBe(false)
    })

    it('returns false for Advanced Shield databases', function () {
      const result = bastionKeyPlan(advancedShieldDatabaseAttachment)
      expect(result).toBe(false)
    })

    it('returns false for developer addon attachments', function () {
      const result = bastionKeyPlan(developerAddonAttachment)
      expect(result).toBe(false)
    })

    it('returns true for attachments with plans that start with "private" only', function () {
      const attachmentWithPrivateInAddonServiceSlug = {
        ...defaultAttachment,
        addon: {
          ...defaultAttachment.addon,
          plan: {
            ...defaultAttachment.addon.plan,
            name: 'private-postgresql:essential-1',
          },
        },
      }

      const attachmentWithPrivateAtStartOfPlanName = {
        ...defaultAttachment,
        addon: {
          ...defaultAttachment.addon,
          plan: {
            ...defaultAttachment.addon.plan,
            name: 'heroku-postgresql:private-something',
          },
        },
      }

      expect(bastionKeyPlan(attachmentWithPrivateInAddonServiceSlug)).toBe(false)
      expect(bastionKeyPlan(attachmentWithPrivateAtStartOfPlanName)).toBe(true)
    })
  })

  describe('fetchBastionConfig', function () {
    let config: Config
    let heroku: APIClient
    let env: typeof process.env

    beforeEach(async function () {
      config = await Config.load(process.cwd())
      heroku = new APIClient(config)
      env = process.env
    })

    afterEach(function () {
      process.env = env
      vi.restoreAllMocks()
      nock.cleanAll()
    })

    it('returns bastion config when API returns valid host and private_key', async function () {
      process.env = {}

      const bastionConfigResponse = {
        host: '10.7.0.1',
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
      }

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).toEqual({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
      })

      api.done()
    })

    it('returns empty object when API returns response without host', async function () {
      process.env = {}

      const bastionConfigResponse = {
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
      }

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).toEqual({})

      api.done()
    })

    it('returns empty object when API returns response without private_key', async function () {
      process.env = {}

      const bastionConfigResponse = {
        host: '10.7.0.1',
      }

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).toEqual({})

      api.done()
    })

    it('returns empty object when API returns empty response', async function () {
      process.env = {}

      const bastionConfigResponse = {}

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).toEqual({})

      api.done()
    })

    it('returns empty object when API returns response with empty host and private_key', async function () {
      process.env = {}

      const bastionConfigResponse = {
        host: '',
        private_key: '',
      }

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).toEqual({})

      api.done()
    })

    it('uses custom hostname when HEROKU_DATA_HOST environment variable is set', async function () {
      process.env = {
        HEROKU_DATA_HOST: 'custom-data-api.heroku.com',
      }

      const bastionConfigResponse = {
        host: '10.7.0.1',
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
      }

      const api = nock('https://custom-data-api.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).toEqual({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
      })

      api.done()
    })

    it('uses custom hostname when HEROKU_POSTGRESQL_HOST environment variable is set', async function () {
      process.env = {
        HEROKU_POSTGRESQL_HOST: 'custom-postgresql-api.heroku.com',
      }

      const bastionConfigResponse = {
        host: '10.7.0.1',
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
      }

      const api = nock('https://custom-postgresql-api.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).toEqual({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
      })

      api.done()
    })

    it('prioritizes HEROKU_DATA_HOST over HEROKU_POSTGRESQL_HOST', async function () {
      process.env = {
        HEROKU_DATA_HOST: 'data-api.heroku.com',
        HEROKU_POSTGRESQL_HOST: 'postgresql-api.heroku.com',
      }

      const bastionConfigResponse = {
        host: '10.7.0.1',
        private_key: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
      }

      const api = nock('https://data-api.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(200, bastionConfigResponse)

      const result = await fetchBastionConfig(heroku, privateDatabaseAttachment.addon)

      expect(result).toEqual({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----',
      })

      api.done()
    })

    it('handles API errors gracefully', async function () {
      process.env = {}

      const api = nock('https://api.data.heroku.com')
        .get('/client/v11/databases/addon-5/bastion')
        .reply(404, {id: 'not_found', message: 'Couldn\'t find that database.', resource: 'database'})

      await expect(fetchBastionConfig(heroku, privateDatabaseAttachment.addon))
        .rejects.toThrow('Couldn\'t find that database.')

      api.done()
    })
  })

  describe('getBastionConfig', function () {
    it('returns bastion config when both BASTION_KEY and BASTIONS are present', function () {
      const result = getBastionConfig(shieldDatabaseConfigVars, 'DATABASE')

      expect(result).toEqual({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----',
      })
    })

    it('returns empty object when BASTION_KEY is missing', function () {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {DATABASE_BASTION_KEY, ...configWithoutKey} = shieldDatabaseConfigVars

      const result = getBastionConfig(configWithoutKey, 'DATABASE')

      expect(result).toEqual({})
    })

    it('returns empty object when BASTIONS is missing', function () {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {DATABASE_BASTIONS, ...configWithoutBastions} = shieldDatabaseConfigVars

      const result = getBastionConfig(configWithoutBastions, 'DATABASE')

      expect(result).toEqual({})
    })

    it('returns empty object when BASTIONS is empty string', function () {
      const configWithEmptyBastions = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTIONS: '',
      }

      const result = getBastionConfig(configWithEmptyBastions, 'DATABASE')

      expect(result).toEqual({})
    })

    it('returns empty object when BASTION_KEY is empty string', function () {
      const configWithEmptyKey = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTION_KEY: '',
      }

      const result = getBastionConfig(configWithEmptyKey, 'DATABASE')

      expect(result).toEqual({})
    })

    it('returns empty object when both BASTION_KEY and BASTIONS are empty', function () {
      const configWithEmptyValues = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTION_KEY: '',
        DATABASE_BASTIONS: '',
      }

      const result = getBastionConfig(configWithEmptyValues, 'DATABASE')

      expect(result).toEqual({})
    })

    it('returns empty object when config vars are completely empty', function () {
      const result = getBastionConfig(emptyAppConfigVars, 'DATABASE')

      expect(result).toEqual({})
    })

    it('returns empty object for non-shield database config vars', function () {
      const result = getBastionConfig(myAppConfigVars, 'MAIN_DATABASE')

      expect(result).toEqual({})
    })

    it('handles multiple bastion hosts and selects one randomly', function () {
      const configWithMultipleBastions = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTIONS: '10.7.0.1,10.7.0.2,10.7.0.3',
      }

      const result = getBastionConfig(configWithMultipleBastions, 'DATABASE')

      expect(result).toHaveProperty('bastionKey', '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----')
      expect(['10.7.0.1', '10.7.0.2', '10.7.0.3']).toContain(result.bastionHost)
    })

    it('handles single bastion host without commas', function () {
      const configWithSingleBastion = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTIONS: '10.7.0.1',
      }

      const result = getBastionConfig(configWithSingleBastion, 'DATABASE')

      expect(result).toEqual({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----',
      })
    })
  })

  describe('getPsqlConfigs', function () {
    let env: typeof process.env

    beforeEach(function () {
      env = process.env
      process.env = {}
    })

    afterEach(function () {
      process.env = env
    })

    describe('with default connection details (essential plan, no tunnel)', function () {
      it('returns correct psql configs for essential plan without tunnel', function () {
        const result = getPsqlConfigs(defaultConnectionDetails)

        // Verify dbEnv structure
        expect(result.dbEnv).toHaveProperty('PGDATABASE', 'db1')
        expect(result.dbEnv).toHaveProperty('PGHOST', 'main-database.example.com')
        expect(result.dbEnv).toHaveProperty('PGPASSWORD', 'password1')
        expect(result.dbEnv).toHaveProperty('PGPORT', '5432')
        expect(result.dbEnv).toHaveProperty('PGUSER', 'user1')
        expect(result.dbEnv).toHaveProperty('PGAPPNAME', 'psql non-interactive')
        expect(result.dbEnv).toHaveProperty('PGSSLMODE', 'require')

        // Verify dbTunnelConfig structure
        expect(result.dbTunnelConfig).toHaveProperty('dstHost', 'main-database.example.com')
        expect(result.dbTunnelConfig).toHaveProperty('dstPort', 5432)
        expect(result.dbTunnelConfig).toHaveProperty('host')
        expect(result.dbTunnelConfig).toHaveProperty('localHost', '127.0.0.1')
        expect(result.dbTunnelConfig).toHaveProperty('localPort', expect.any(Number))
        expect(result.dbTunnelConfig.localPort).toBeGreaterThanOrEqual(49_152)
        expect(result.dbTunnelConfig.localPort).toBeLessThanOrEqual(65_535)
        expect(result.dbTunnelConfig).toHaveProperty('privateKey')
        expect(result.dbTunnelConfig).toHaveProperty('username', 'bastion')
      })
    })

    describe('with shield database connection details (shield plan, requires tunnel)', function () {
      it('returns correct psql configs for shield plan with tunnel', function () {
        const result = getPsqlConfigs(shieldDatabaseConnectionDetails)

        // Verify dbEnv structure - PGHOST and PGPORT should be adjusted for tunnel
        expect(result.dbEnv).toHaveProperty('PGDATABASE', 'db1')
        expect(result.dbEnv).toHaveProperty('PGHOST', '127.0.0.1') // Adjusted to tunnel local host
        expect(result.dbEnv).toHaveProperty('PGPASSWORD', 'password7')
        expect(typeof result.dbEnv.PGPORT).toBe('string')
        const pgPort = Number.parseInt(result.dbEnv.PGPORT!, 10)
        expect(pgPort).toBeGreaterThanOrEqual(49_152)
        expect(pgPort).toBeLessThanOrEqual(65_535)
        expect(result.dbEnv).toHaveProperty('PGUSER', 'user7')
        expect(result.dbEnv).toHaveProperty('PGAPPNAME', 'psql non-interactive')
        expect(result.dbEnv).toHaveProperty('PGSSLMODE', 'require')

        // Verify dbTunnelConfig structure
        expect(result.dbTunnelConfig).toHaveProperty('dstHost', 'shield-database.example.com')
        expect(result.dbTunnelConfig).toHaveProperty('dstPort', 5432)
        expect(result.dbTunnelConfig).toHaveProperty('host', '10.7.0.1')
        expect(result.dbTunnelConfig).toHaveProperty('localHost', '127.0.0.1')
        expect(result.dbTunnelConfig).toHaveProperty('localPort', expect.any(Number))
        expect(result.dbTunnelConfig.localPort).toBeGreaterThanOrEqual(49_152)
        expect(result.dbTunnelConfig.localPort).toBeLessThanOrEqual(65_535)
        expect(result.dbTunnelConfig).toHaveProperty('privateKey', '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----')
        expect(result.dbTunnelConfig).toHaveProperty('username', 'bastion')

        // Verify that localPort in dbEnv matches localPort in dbTunnelConfig
        expect(result.dbEnv.PGPORT).toBe(result.dbTunnelConfig.localPort!.toString())
      })
    })

    describe('with private database connection details (private plan, requires tunnel)', function () {
      it('returns correct psql configs for private plan with tunnel', function () {
        const result = getPsqlConfigs(privateDatabaseConnectionDetails)

        // Verify dbEnv structure - PGHOST and PGPORT should be adjusted for tunnel
        expect(result.dbEnv).toHaveProperty('PGDATABASE', 'db1')
        expect(result.dbEnv).toHaveProperty('PGHOST', '127.0.0.1') // Adjusted to tunnel local host
        expect(result.dbEnv).toHaveProperty('PGPASSWORD', 'password8')
        expect(typeof result.dbEnv.PGPORT).toBe('string')
        const pgPort = Number.parseInt(result.dbEnv.PGPORT!, 10)
        expect(pgPort).toBeGreaterThanOrEqual(49_152)
        expect(pgPort).toBeLessThanOrEqual(65_535)
        expect(result.dbEnv).toHaveProperty('PGUSER', 'user8')
        expect(result.dbEnv).toHaveProperty('PGAPPNAME', 'psql non-interactive')
        expect(result.dbEnv).toHaveProperty('PGSSLMODE', 'require')

        // Verify dbTunnelConfig structure
        expect(result.dbTunnelConfig).toHaveProperty('dstHost', 'private-database.example.com')
        expect(result.dbTunnelConfig).toHaveProperty('dstPort', 5432)
        expect(result.dbTunnelConfig).toHaveProperty('host', '10.7.0.2')
        expect(result.dbTunnelConfig).toHaveProperty('localHost', '127.0.0.1')
        expect(result.dbTunnelConfig).toHaveProperty('localPort', expect.any(Number))
        expect(result.dbTunnelConfig.localPort).toBeGreaterThanOrEqual(49_152)
        expect(result.dbTunnelConfig.localPort).toBeLessThanOrEqual(65_535)
        expect(result.dbTunnelConfig).toHaveProperty('privateKey', '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----')
        expect(result.dbTunnelConfig).toHaveProperty('username', 'bastion')

        // Verify that localPort in dbEnv matches localPort in dbTunnelConfig
        expect(result.dbEnv.PGPORT).toBe(result.dbTunnelConfig.localPort!.toString())
      })
    })

    describe('SSL mode behavior', function () {
      it('sets PGSSLMODE to require for non-localhost hosts', function () {
        const result = getPsqlConfigs(defaultConnectionDetails)
        expect(result.dbEnv.PGSSLMODE).toBe('require')
      })

      it('sets PGSSLMODE to prefer for localhost hosts', function () {
        const localhostConnectionDetails = {
          ...defaultConnectionDetails,
          host: 'localhost',
        }

        const result = getPsqlConfigs(localhostConnectionDetails)

        expect(result.dbEnv.PGSSLMODE).toBe('prefer')
      })
    })

    describe('environment variable inheritance', function () {
      it('preserves user-defined PGAPPNAME when present in process.env', function () {
        process.env.PGAPPNAME = 'my-custom-app'

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).toHaveProperty('PGAPPNAME', 'my-custom-app')
      })

      it('preserves user-defined PGSSLMODE when present in process.env', function () {
        process.env.PGSSLMODE = 'disable'

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).toHaveProperty('PGSSLMODE', 'disable')
      })

      it('preserves both user-defined PGAPPNAME and PGSSLMODE when present in process.env', function () {
        process.env.PGAPPNAME = 'my-custom-app'
        process.env.PGSSLMODE = 'verify-full'

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).toHaveProperty('PGAPPNAME', 'my-custom-app')
        expect(result.dbEnv).toHaveProperty('PGSSLMODE', 'verify-full')
      })

      it('uses default PGAPPNAME when not defined in process.env', function () {
        delete process.env.PGAPPNAME

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).toHaveProperty('PGAPPNAME', 'psql non-interactive')
      })

      it('uses default PGSSLMODE when not defined in process.env', function () {
        delete process.env.PGSSLMODE

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).toHaveProperty('PGSSLMODE', 'require')
      })
    })
  })

  describe('sshTunnel', function () {
    let createTunnelStub: ReturnType<typeof vi.fn>

    beforeEach(function () {
      createTunnelStub = vi.fn()
      vi.useFakeTimers()
    })

    afterEach(function () {
      vi.restoreAllMocks()
      vi.useRealTimers()
    })

    describe('when no bastion key is provided', function () {
      it('returns undefined immediately', async function () {
        const connectionDetails = defaultConnectionDetails
        const {dbTunnelConfig} = defaultPsqlConfigs

        const result = await sshTunnel(connectionDetails, dbTunnelConfig, 1000, createTunnelStub)

        expect(result).toBeUndefined()
        expect(createTunnelStub).not.toHaveBeenCalled()
      })
    })

    describe('when bastion key is provided', function () {
      it('successfully creates an SSH tunnel', async function () {
        const mockTunnelServer = {} as unknown as Server
        createTunnelStub.mockResolvedValue(mockTunnelServer)

        const connectionDetails = privateDatabaseConnectionDetails
        const {dbTunnelConfig} = privateDatabasePsqlConfigs

        const tunnelPromise = sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        expect(await tunnelPromise).toBe(mockTunnelServer)
        expect(createTunnelStub).toHaveBeenCalledExactlyOnceWith(dbTunnelConfig)
      })

      it('handles tunnel creation timeout', async function () {
        // Resolves to a promise that hangs forever
        createTunnelStub.mockResolvedValue(new Promise(() => {}) as unknown as Server)

        const connectionDetails = privateDatabaseConnectionDetails
        const {dbTunnelConfig} = privateDatabasePsqlConfigs

        const tunnelPromise = sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        // Advance time to trigger timeout
        vi.advanceTimersByTime(100)

        await expect(tunnelPromise).rejects.toThrow('Unable to establish a secure tunnel to your database: Establishing a secure tunnel timed out.')
        expect(createTunnelStub).toHaveBeenCalledOnce()
      })

      it('handles tunnel creation error', async function () {
        const tunnelError = new Error('SSH connection failed')
        createTunnelStub.mockRejectedValue(tunnelError)
        const connectionDetails = privateDatabaseConnectionDetails
        const {dbTunnelConfig} = privateDatabasePsqlConfigs

        const tunnelPromise = sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        // Advance time without triggering timeout
        vi.advanceTimersByTime(10)

        await expect(tunnelPromise).rejects.toThrow('Unable to establish a secure tunnel to your database: SSH connection failed.')
        expect(createTunnelStub).toHaveBeenCalledExactlyOnceWith(dbTunnelConfig)
      })

      it('handles tunnel creation error with unknown error', async function () {
        createTunnelStub.mockRejectedValue(new Error('Error'))
        const connectionDetails = privateDatabaseConnectionDetails
        const {dbTunnelConfig} = privateDatabasePsqlConfigs

        const tunnelPromise = sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        // Advance time without triggering timeout
        vi.advanceTimersByTime(10)

        await expect(tunnelPromise).rejects.toThrow('Unable to establish a secure tunnel to your database: Error.')
        expect(createTunnelStub).toHaveBeenCalledExactlyOnceWith(dbTunnelConfig)
      })

      it('works with shield database connection details', async function () {
        const mockTunnelServer = {} as unknown as Server
        createTunnelStub.mockResolvedValue(mockTunnelServer)

        const connectionDetails = shieldDatabaseConnectionDetails
        const {dbTunnelConfig} = shieldDatabasePsqlConfigs

        const result = await sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        expect(result).toBe(mockTunnelServer)
        expect(createTunnelStub).toHaveBeenCalledExactlyOnceWith(dbTunnelConfig)
      })
    })
  })
})
