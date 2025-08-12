import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {ChildProcess} from 'node:child_process'
import {EventEmitter} from 'node:events'
import {Server} from 'node:net'
import {Readable} from 'node:stream'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import {ConnectionDetailsWithAttachment} from '../../../../src/types/pg/tunnel'
import {PsqlConfigs} from '../../../../src/utils/pg/bastion'
import PsqlService from '../../../../src/utils/pg/psql'
import {defaultConnectionDetails, privateDatabaseConnectionDetails} from '../../../fixtures/bastion-mocks'
import {defaultPsqlConfigs, privateDatabasePsqlConfigs} from '../../../fixtures/psql-mocks'

const {expect} = chai

chai.use(chaiAsPromised)
chai.use(sinonChai)

// Helper function to create a mock tunnel server
describe('PsqlService', function () {
  let psqlService: PsqlService
  let connectionDetails: ConnectionDetailsWithAttachment
  let mockGetPsqlConfigs: sinon.SinonStub
  let mockSpawn: sinon.SinonStub
  let mockChildProcess: {killed: boolean} & ChildProcess
  let psqlConfigs: PsqlConfigs

  // Helper function to create a mock child process
  function createMockChildProcess() {
    // eslint-disable-next-line unicorn/prefer-event-target
    const childProcess = new EventEmitter() as {killed: boolean} & ChildProcess
    childProcess.stdout = new Readable({
      read() {},
    })
    childProcess.stderr = null
    childProcess.kill = sinon.stub().callsFake(() => {
      childProcess.killed = true
    })
    childProcess.killed = false
    return childProcess
  }

  function createMockTunnelServer() {
    // eslint-disable-next-line unicorn/prefer-event-target
    const server = new EventEmitter() as Server
    server.close = sinon.stub().callsFake(() => server.emit('close'))
    server.listen = sinon.stub() as sinon.SinonStub
    return server
  }

  beforeEach(function () {
    mockGetPsqlConfigs = sinon.stub()
    mockChildProcess = createMockChildProcess()
    mockSpawn = sinon.stub()
    mockSpawn.returns(mockChildProcess)
  })

  afterEach(function () {
    sinon.restore()
  })

  describe('execQuery', function () {
    describe('for non-private or shield add-on plans (no tunnel required)', function () {
      beforeEach(function () {
        connectionDetails = defaultConnectionDetails
        psqlConfigs = defaultPsqlConfigs
        mockGetPsqlConfigs.returns(psqlConfigs)
        psqlService = new PsqlService(connectionDetails, mockGetPsqlConfigs, mockSpawn)
      })

      it('executes a query successfully', async function () {
        // Setup query and expected result
        const query = 'SELECT \'t\'::boolean AS it_works;'
        const expectedResult = ' it_works\n----------\n t\n(1 row)\n'

        // Start the query execution
        const queryPromise = psqlService.execQuery(query)

        // Simulate psql process completion
        setTimeout(() => {
          mockChildProcess.emit('spawn')
          mockChildProcess.stdout!.emit('data', Buffer.from(expectedResult))
          mockChildProcess.stdout!.emit('end')
          mockChildProcess.emit('close', 0)
          mockChildProcess.killed = true
        }, 10)

        // Wait for the query to complete
        const result = await queryPromise

        // Verify the result
        expect(result).to.equal(expectedResult)

        // Verify getPsqlConfigs was called with correct parameters
        expect(mockGetPsqlConfigs).to.have.been.calledOnceWith(connectionDetails)

        // Verify spawn was called with correct parameters
        expect(mockSpawn).to.have.been.calledOnceWith('psql', [
          '-c',
          query,
          '--set',
          'sslmode=require',
        ], {
          env: defaultPsqlConfigs.dbEnv,
          stdio: ['ignore', 'pipe', 'inherit'],
        })
      })

      it('executes a query with additional psql arguments', async function () {
        const query = 'SELECT \'t\'::boolean AS it_works;'
        const psqlArgs = ['--tuples-only', '--no-align']
        const expectedResult = 't\n'

        // Start the query execution
        const queryPromise = psqlService.execQuery(query, psqlArgs)

        // Simulate psql process completion
        setTimeout(() => {
          mockChildProcess.emit('spawn')
          mockChildProcess.stdout!.emit('data', Buffer.from(expectedResult))
          mockChildProcess.stdout!.emit('end')
          mockChildProcess.emit('close', 0)
          mockChildProcess.killed = true
        }, 10)

        // Wait for the query to complete
        const result = await queryPromise

        // Verify the result
        expect(result).to.equal(expectedResult)

        // Verify spawn was called with correct parameters including additional args
        expect(mockSpawn).to.have.been.calledOnceWith('psql', [
          '-c',
          query,
          '--set',
          'sslmode=require',
          '--tuples-only',
          '--no-align',
        ], {
          env: defaultPsqlConfigs.dbEnv,
          stdio: ['ignore', 'pipe', 'inherit'],
        })
      })

      it('handles empty query result', async function () {
        // Setup query with no result
        const query = 'VACUUM ANALYZE;'
        const psqlArgs = ['-q']

        // Start the query execution
        const queryPromise = psqlService.execQuery(query, psqlArgs)

        // Simulate psql process completion with no output
        setTimeout(() => {
          mockChildProcess.emit('spawn')
          mockChildProcess.stdout!.emit('end')
          mockChildProcess.emit('close', 0)
          mockChildProcess.killed = true
        }, 10)

        // Wait for the query to complete
        const result = await queryPromise

        // Verify the result is empty string
        expect(result).to.equal('')

        // Verify spawn was called
        expect(mockSpawn).to.have.been.calledOnceWithExactly('psql', [
          '-c',
          query,
          '--set',
          'sslmode=require',
          '-q',
        ], {
          env: defaultPsqlConfigs.dbEnv,
          stdio: ['ignore', 'pipe', 'inherit'],
        })
      })
    })

    describe('for private, non-shielded add-on plans (tunnel required)', function () {
      let mockTunnelServer: Server
      let mockTunnelFn: sinon.SinonStub

      beforeEach(function () {
        connectionDetails = privateDatabaseConnectionDetails
        psqlConfigs = privateDatabasePsqlConfigs
        mockGetPsqlConfigs.returns(psqlConfigs)
        mockTunnelServer = createMockTunnelServer()
      })

      it('executes a query successfully with SSH tunnel', async function () {
        // Setup query and expected result
        const query = 'SELECT \'t\'::boolean AS it_works;'
        const expectedResult = ' it_works\n----------\n t\n(1 row)\n'
        mockTunnelFn = sinon.stub().resolves(mockTunnelServer)
        psqlService = new PsqlService(connectionDetails, mockGetPsqlConfigs, mockSpawn, mockTunnelFn)

        // Start the query execution
        const queryPromise = psqlService.execQuery(query)

        // Simulate tunnel creation and psql process completion
        setTimeout(() => {
          // Simulate tunnel server ready
          mockTunnelServer.emit('listening')

          // Simulate psql process completion
          mockChildProcess.emit('spawn')
          mockChildProcess.stdout!.emit('data', Buffer.from(expectedResult))
          mockChildProcess.stdout!.emit('end')
          mockChildProcess.emit('close', 0)
          mockChildProcess.killed = true
        }, 10)

        // Wait for the query to complete
        const result = await queryPromise

        // Verify the result
        expect(result).to.equal(expectedResult)

        // Verify getPsqlConfigs was called with correct parameters
        expect(mockGetPsqlConfigs).to.have.been.calledOnceWith(connectionDetails)

        // Verify spawn was called with tunnel-adjusted environment
        expect(mockSpawn).to.have.been.calledOnceWith('psql', [
          '-c',
          query,
          '--set',
          'sslmode=require',
        ], {
          env: privateDatabasePsqlConfigs.dbEnv, // Should use tunnel-adjusted env
          stdio: ['ignore', 'pipe', 'inherit'],
        })

        // Verify tunnel server was closed
        expect(mockTunnelServer.close).to.have.been.calledOnce
      })

      it('handles tunnel creation failure', async function () {
        const query = 'SELECT 1;'
        const tunnelError = new Error(
          'Unable to establish a secure tunnel to your database: ssh: Could not resolve hostname.',
        )
        mockTunnelFn = sinon.stub().rejects(tunnelError)
        psqlService = new PsqlService(connectionDetails, mockGetPsqlConfigs, mockSpawn, mockTunnelFn)

        // Start the query execution
        const queryPromise = psqlService.execQuery(query)

        // Execute the query and expect it to throw
        await expect(queryPromise)
          .to.be.rejectedWith(
            'Unable to establish a secure tunnel to your database: ssh: Could not resolve hostname.',
          )
      })

      it('handles psql failure while tunnel is active', async function () {
        const query = 'SELECT * FROM non_existent_table;'
        mockTunnelFn = sinon.stub().resolves(mockTunnelServer)
        psqlService = new PsqlService(connectionDetails, mockGetPsqlConfigs, mockSpawn, mockTunnelFn)

        // Start the query execution
        const queryPromise = psqlService.execQuery(query)

        // Simulate tunnel creation and psql process failure
        setTimeout(() => {
          // Simulate tunnel server ready
          mockTunnelServer.emit('listening')

          // Simulate psql process failure
          mockChildProcess.emit('spawn')
          mockChildProcess.stdout!.emit('end')
          mockChildProcess.emit('close', 1)
          mockChildProcess.killed = true
        }, 10)

        // Execute the query and expect it to throw
        await expect(queryPromise)
          .to.be.rejectedWith('psql exited with code 1')

        // Verify tunnel server was closed even after psql failure
        expect(mockTunnelServer.close).to.have.been.calledOnce
      })

      it('handles tunnel close before psql completion', async function () {
        const query = 'SELECT 1;'
        mockTunnelFn = sinon.stub().resolves(mockTunnelServer)
        psqlService = new PsqlService(connectionDetails, mockGetPsqlConfigs, mockSpawn, mockTunnelFn)

        // Start the query execution
        const queryPromise = psqlService.execQuery(query)

        // Simulate tunnel creation and tunnel close before psql completes
        setTimeout(() => {
          // Simulate tunnel server ready
          mockTunnelServer.emit('listening')

          // Simulate psql process starting
          mockChildProcess.emit('spawn')

          // Simulate tunnel close before psql completes
          mockTunnelServer.emit('error', new Error('Connection closed'))
        }, 10)

        // Execute the query and expect it to throw
        await expect(queryPromise)
          .to.be.rejectedWith('Secure tunnel to your database failed')
      })
    })

    describe('error handling', function () {
      beforeEach(function () {
        connectionDetails = defaultConnectionDetails
        psqlConfigs = defaultPsqlConfigs
        mockGetPsqlConfigs.returns(psqlConfigs)
        psqlService = new PsqlService(connectionDetails, mockGetPsqlConfigs, mockSpawn)
      })

      it('throws error when psql process exits with non-zero code', async function () {
        const query = 'SELECT * FROM non_existent_table;'

        // Start the query execution
        const queryPromise = psqlService.execQuery(query)

        // Simulate psql process failure
        setTimeout(() => {
          mockChildProcess.emit('spawn')
          mockChildProcess.stdout!.emit('end')
          mockChildProcess.emit('close', 1)
          mockChildProcess.killed = true
        }, 10)

        // Execute the query and expect it to throw
        await expect(queryPromise)
          .to.be.rejectedWith('psql exited with code 1')
      })

      it('throws error when psql command is not found', async function () {
        const query = 'SELECT 1;'

        // Start the query execution
        const queryPromise = psqlService.execQuery(query)

        // Simulate ENOENT error
        setTimeout(() => {
          mockChildProcess.emit('error', {code: 'ENOENT'})
          mockChildProcess.killed = true
        }, 10)

        // Execute the query and expect it to throw
        await expect(queryPromise)
          .to.be.rejectedWith(
            'The local psql command could not be located. For help installing psql, see '
            + 'https://devcenter.heroku.com/articles/heroku-postgresql#local-setup',
          )
      })
    })
  })
})
