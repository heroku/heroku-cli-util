/* eslint-disable camelcase */

import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import nock from 'nock'
import {Server} from 'node:net'
import {promisify} from 'node:util'
import sinon from 'sinon'
import * as createTunnel from 'tunnel-ssh'

import {
  bastionKeyPlan,
  fetchBastionConfig,
  getBastionConfig,
  getPsqlConfigs,
  sshTunnel,
} from '../../../../src/utils/pg/bastion'
import {
  defaultAttachment,
  developerAddonAttachment,
  privateDatabaseAttachment,
  shieldDatabaseAttachment,
} from '../../../fixtures/attachment-mocks'
import {
  defaultConnectionDetails,
  privateDatabaseConnectionDetails,
  shieldDatabaseConnectionDetails,
} from '../../../fixtures/bastion-mocks'
import {
  emptyAppConfigVars,
  myAppConfigVars,
  shieldDatabaseConfigVars,
} from '../../../fixtures/config-var-mocks'
import {defaultPsqlConfigs, privateDatabasePsqlConfigs, shieldDatabasePsqlConfigs} from '../../../fixtures/psql-mocks'

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
            name: 'private-postgresql:essential-1',
          },
        },
      }

      const attachmentWithPrivateAtEnd = {
        ...defaultAttachment,
        addon: {
          ...defaultAttachment.addon,
          plan: {
            ...defaultAttachment.addon.plan,
            name: 'heroku-postgresql:other-private-plan',
          },
        },
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
      // eslint-disable-next-line import/no-named-as-default-member
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

      expect(result).to.deep.equal({
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

      expect(result).to.deep.equal({})

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
        private_key: '',
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

      expect(result).to.deep.equal({
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

      expect(result).to.deep.equal({
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

      expect(result).to.deep.equal({
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
        .to.be.rejectedWith('Couldn\'t find that database.')

      api.done()
    })
  })

  describe('getBastionConfig', function () {
    it('returns bastion config when both BASTION_KEY and BASTIONS are present', function () {
      const result = getBastionConfig(shieldDatabaseConfigVars, 'DATABASE')

      expect(result).to.deep.equal({
        bastionHost: '10.7.0.1',
        bastionKey: '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----',
      })
    })

    it('returns empty object when BASTION_KEY is missing', function () {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {DATABASE_BASTION_KEY, ...configWithoutKey} = shieldDatabaseConfigVars

      const result = getBastionConfig(configWithoutKey, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object when BASTIONS is missing', function () {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {DATABASE_BASTIONS, ...configWithoutBastions} = shieldDatabaseConfigVars

      const result = getBastionConfig(configWithoutBastions, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object when BASTIONS is empty string', function () {
      const configWithEmptyBastions = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTIONS: '',
      }

      const result = getBastionConfig(configWithEmptyBastions, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object when BASTION_KEY is empty string', function () {
      const configWithEmptyKey = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTION_KEY: '',
      }

      const result = getBastionConfig(configWithEmptyKey, 'DATABASE')

      expect(result).to.deep.equal({})
    })

    it('returns empty object when both BASTION_KEY and BASTIONS are empty', function () {
      const configWithEmptyValues = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTION_KEY: '',
        DATABASE_BASTIONS: '',
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
        DATABASE_BASTIONS: '10.7.0.1,10.7.0.2,10.7.0.3',
      }

      const result = getBastionConfig(configWithMultipleBastions, 'DATABASE')

      expect(result).to.have.property('bastionKey', '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----')
      expect(['10.7.0.1', '10.7.0.2', '10.7.0.3']).to.include(result.bastionHost)
    })

    it('handles single bastion host without commas', function () {
      const configWithSingleBastion = {
        ...shieldDatabaseConfigVars,
        DATABASE_BASTIONS: '10.7.0.1',
      }

      const result = getBastionConfig(configWithSingleBastion, 'DATABASE')

      expect(result).to.deep.equal({
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
        expect(result.dbEnv).to.have.property('PGDATABASE', 'db1')
        expect(result.dbEnv).to.have.property('PGHOST', 'main-database.example.com')
        expect(result.dbEnv).to.have.property('PGPASSWORD', 'password1')
        expect(result.dbEnv).to.have.property('PGPORT', '5432')
        expect(result.dbEnv).to.have.property('PGUSER', 'user1')
        expect(result.dbEnv).to.have.property('PGAPPNAME', 'psql non-interactive')
        expect(result.dbEnv).to.have.property('PGSSLMODE', 'require')

        // Verify dbTunnelConfig structure
        expect(result.dbTunnelConfig).to.have.property('dstHost', 'main-database.example.com')
        expect(result.dbTunnelConfig).to.have.property('dstPort', 5432)
        expect(result.dbTunnelConfig).to.have.property('host', undefined)
        expect(result.dbTunnelConfig).to.have.property('localHost', '127.0.0.1')
        expect(result.dbTunnelConfig).to.have.property('localPort').that.is.a('number')
        expect(result.dbTunnelConfig.localPort).to.be.at.least(49_152)
        expect(result.dbTunnelConfig.localPort).to.be.at.most(65_535)
        expect(result.dbTunnelConfig).to.have.property('privateKey', undefined)
        expect(result.dbTunnelConfig).to.have.property('username', 'bastion')
      })
    })

    describe('with shield database connection details (shield plan, requires tunnel)', function () {
      it('returns correct psql configs for shield plan with tunnel', function () {
        const result = getPsqlConfigs(shieldDatabaseConnectionDetails)

        // Verify dbEnv structure - PGHOST and PGPORT should be adjusted for tunnel
        expect(result.dbEnv).to.have.property('PGDATABASE', 'db1')
        expect(result.dbEnv).to.have.property('PGHOST', '127.0.0.1') // Adjusted to tunnel local host
        expect(result.dbEnv).to.have.property('PGPASSWORD', 'password7')
        expect(result.dbEnv).to.have.property('PGPORT').that.is.a('string')
        const pgPort = Number.parseInt(result.dbEnv.PGPORT!, 10)
        expect(pgPort).to.be.at.least(49_152)
        expect(pgPort).to.be.at.most(65_535)
        expect(result.dbEnv).to.have.property('PGUSER', 'user7')
        expect(result.dbEnv).to.have.property('PGAPPNAME', 'psql non-interactive')
        expect(result.dbEnv).to.have.property('PGSSLMODE', 'require')

        // Verify dbTunnelConfig structure
        expect(result.dbTunnelConfig).to.have.property('dstHost', 'shield-database.example.com')
        expect(result.dbTunnelConfig).to.have.property('dstPort', 5432)
        expect(result.dbTunnelConfig).to.have.property('host', '10.7.0.1')
        expect(result.dbTunnelConfig).to.have.property('localHost', '127.0.0.1')
        expect(result.dbTunnelConfig).to.have.property('localPort').that.is.a('number')
        expect(result.dbTunnelConfig.localPort).to.be.at.least(49_152)
        expect(result.dbTunnelConfig.localPort).to.be.at.most(65_535)
        expect(result.dbTunnelConfig).to.have.property('privateKey', '-----BEGIN EC PRIVATE KEY-----\nshield-bastion-key\n-----END EC PRIVATE KEY-----')
        expect(result.dbTunnelConfig).to.have.property('username', 'bastion')

        // Verify that localPort in dbEnv matches localPort in dbTunnelConfig
        expect(result.dbEnv.PGPORT).to.equal(result.dbTunnelConfig.localPort!.toString())
      })
    })

    describe('with private database connection details (private plan, requires tunnel)', function () {
      it('returns correct psql configs for private plan with tunnel', function () {
        const result = getPsqlConfigs(privateDatabaseConnectionDetails)

        // Verify dbEnv structure - PGHOST and PGPORT should be adjusted for tunnel
        expect(result.dbEnv).to.have.property('PGDATABASE', 'db1')
        expect(result.dbEnv).to.have.property('PGHOST', '127.0.0.1') // Adjusted to tunnel local host
        expect(result.dbEnv).to.have.property('PGPASSWORD', 'password8')
        expect(result.dbEnv).to.have.property('PGPORT').that.is.a('string')
        const pgPort = Number.parseInt(result.dbEnv.PGPORT!, 10)
        expect(pgPort).to.be.at.least(49_152)
        expect(pgPort).to.be.at.most(65_535)
        expect(result.dbEnv).to.have.property('PGUSER', 'user8')
        expect(result.dbEnv).to.have.property('PGAPPNAME', 'psql non-interactive')
        expect(result.dbEnv).to.have.property('PGSSLMODE', 'require')

        // Verify dbTunnelConfig structure
        expect(result.dbTunnelConfig).to.have.property('dstHost', 'private-database.example.com')
        expect(result.dbTunnelConfig).to.have.property('dstPort', 5432)
        expect(result.dbTunnelConfig).to.have.property('host', '10.7.0.2')
        expect(result.dbTunnelConfig).to.have.property('localHost', '127.0.0.1')
        expect(result.dbTunnelConfig).to.have.property('localPort').that.is.a('number')
        expect(result.dbTunnelConfig.localPort).to.be.at.least(49_152)
        expect(result.dbTunnelConfig.localPort).to.be.at.most(65_535)
        expect(result.dbTunnelConfig).to.have.property('privateKey', '-----BEGIN EC PRIVATE KEY-----\nprivate-bastion-key\n-----END EC PRIVATE KEY-----')
        expect(result.dbTunnelConfig).to.have.property('username', 'bastion')

        // Verify that localPort in dbEnv matches localPort in dbTunnelConfig
        expect(result.dbEnv.PGPORT).to.equal(result.dbTunnelConfig.localPort!.toString())
      })
    })

    describe('SSL mode behavior', function () {
      it('sets PGSSLMODE to require for non-localhost hosts', function () {
        const result = getPsqlConfigs(defaultConnectionDetails)
        expect(result.dbEnv.PGSSLMODE).to.equal('require')
      })

      it('sets PGSSLMODE to prefer for localhost hosts', function () {
        const localhostConnectionDetails = {
          ...defaultConnectionDetails,
          host: 'localhost',
        }

        const result = getPsqlConfigs(localhostConnectionDetails)

        expect(result.dbEnv.PGSSLMODE).to.equal('prefer')
      })
    })

    describe('environment variable inheritance', function () {
      it('preserves user-defined PGAPPNAME when present in process.env', function () {
        process.env.PGAPPNAME = 'my-custom-app'

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).to.have.property('PGAPPNAME', 'my-custom-app')
      })

      it('preserves user-defined PGSSLMODE when present in process.env', function () {
        process.env.PGSSLMODE = 'disable'

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).to.have.property('PGSSLMODE', 'disable')
      })

      it('preserves both user-defined PGAPPNAME and PGSSLMODE when present in process.env', function () {
        process.env.PGAPPNAME = 'my-custom-app'
        process.env.PGSSLMODE = 'verify-full'

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).to.have.property('PGAPPNAME', 'my-custom-app')
        expect(result.dbEnv).to.have.property('PGSSLMODE', 'verify-full')
      })

      it('uses default PGAPPNAME when not defined in process.env', function () {
        delete process.env.PGAPPNAME

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).to.have.property('PGAPPNAME', 'psql non-interactive')
      })

      it('uses default PGSSLMODE when not defined in process.env', function () {
        delete process.env.PGSSLMODE

        const result = getPsqlConfigs(defaultConnectionDetails)

        expect(result.dbEnv).to.have.property('PGSSLMODE', 'require')
      })
    })
  })

  describe('sshTunnel', function () {
    let createTunnelStub: sinon.SinonStub<
      Parameters<typeof createTunnel.default>,
      Promise<ReturnType<typeof createTunnel.default>>
    >
    let clock: sinon.SinonFakeTimers

    beforeEach(function () {
      // Stub the createTunnel.default function
      createTunnelStub = sinon.stub()
      clock = sinon.useFakeTimers()
    })

    afterEach(function () {
      sinon.restore()
      clock.restore()
    })

    describe('when no bastion key is provided', function () {
      it('returns undefined immediately', async function () {
        const connectionDetails = defaultConnectionDetails
        const {dbTunnelConfig} = defaultPsqlConfigs

        const result = await sshTunnel(connectionDetails, dbTunnelConfig, 1000, promisify(createTunnelStub))

        expect(result).to.be.undefined
        expect(createTunnelStub).to.not.have.been.called
      })
    })

    describe('when bastion key is provided', function () {
      it('successfully creates an SSH tunnel', async function () {
        const mockTunnelServer = {} as unknown as Server
        createTunnelStub.resolves(mockTunnelServer)

        const connectionDetails = privateDatabaseConnectionDetails
        const {dbTunnelConfig} = privateDatabasePsqlConfigs

        const tunnelPromise = sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        expect(await tunnelPromise).to.equal(mockTunnelServer)
        expect(createTunnelStub).to.have.been.calledOnceWith(dbTunnelConfig)
      })

      it('handles tunnel creation timeout', async function () {
        // Resolves to a promise that hangs forever
        createTunnelStub.resolves(new Promise(() => {}) as unknown as Server)

        const connectionDetails = privateDatabaseConnectionDetails
        const {dbTunnelConfig} = privateDatabasePsqlConfigs

        const tunnelPromise = sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        // Advance time to trigger timeout
        clock.tick(100)

        await expect(tunnelPromise).to.be.rejectedWith(
          'Unable to establish a secure tunnel to your database: Establishing a secure tunnel timed out.',
        )
        expect(createTunnelStub).to.have.been.calledOnce
      })

      it('handles tunnel creation error', async function () {
        const tunnelError = new Error('SSH connection failed')
        createTunnelStub.rejects(tunnelError)
        const connectionDetails = privateDatabaseConnectionDetails
        const {dbTunnelConfig} = privateDatabasePsqlConfigs

        const tunnelPromise = sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        // Advance time without triggering timeout
        clock.tick(10)

        await expect(tunnelPromise).to.be.rejectedWith(
          'Unable to establish a secure tunnel to your database: SSH connection failed.',
        )
        expect(createTunnelStub).to.have.been.calledOnceWith(dbTunnelConfig)
      })

      it('handles tunnel creation error with unknown error', async function () {
        createTunnelStub.rejects()
        const connectionDetails = privateDatabaseConnectionDetails
        const {dbTunnelConfig} = privateDatabasePsqlConfigs

        const tunnelPromise = sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        // Advance time without triggering timeout
        clock.tick(10)

        await expect(tunnelPromise).to.be.rejectedWith(
          'Unable to establish a secure tunnel to your database: Error.',
        )
        expect(createTunnelStub).to.have.been.calledOnceWith(dbTunnelConfig)
      })

      it('works with shield database connection details', async function () {
        const mockTunnelServer = {} as unknown as Server
        createTunnelStub.resolves(mockTunnelServer)

        const connectionDetails = shieldDatabaseConnectionDetails
        const {dbTunnelConfig} = shieldDatabasePsqlConfigs

        const result = await sshTunnel(connectionDetails, dbTunnelConfig, 100, createTunnelStub)

        expect(result).to.equal(mockTunnelServer)
        expect(createTunnelStub).to.have.been.calledOnceWith(dbTunnelConfig)
      })
    })
  })
})
