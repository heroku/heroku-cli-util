import {captureOutput} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {expect} from 'chai'
import sinon from 'sinon'

import {confirmCommand} from '../../../src/ux/confirm-command.js'

// We would import this from inquirer, but it isn't exported so we need to define it here.
class ExitPromptError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExitPromptError'
  }
}

describe('confirmCommand', function () {
  let promptFunction: sinon.SinonStub

  beforeEach(function () {
    // eslint-disable-next-line import/no-named-as-default-member
    promptFunction = sinon.stub()
  })

  afterEach(function () {
    // eslint-disable-next-line import/no-named-as-default-member
    sinon.restore()
  })

  it('should not error or prompt with confirm flag match', async function () {
    const {stderr, stdout} = await captureOutput(() =>
      confirmCommand({comparison: 'myapp', confirmation: 'myapp'}))
    expect(stderr).to.equal('')
    expect(stdout).to.equal('')
  })

  it('errs on confirm flag mismatch', async function () {
    await confirmCommand({comparison: 'myapp', confirmation: 'nope'})
    .catch((error: Error) => {
      expect(ansis.strip(error.message)).to.equal('Confirmation nope did not match myapp. Aborted.')
    })
  })

  it('errs on confirm prompt match', async function () {
    promptFunction.resolves('myapp')
    const {stderr, stdout} = await captureOutput(() =>
      confirmCommand({comparison: 'myapp', promptFunction}))
    expect(stderr).to.contain('Warning: Destructive Action')
    expect(stdout).to.equal('')
  })

  it('displays custom warning message', async function () {
    promptFunction.resolves('myapp')
    const {stderr, stdout} = await captureOutput(() =>
      confirmCommand({comparison: 'myapp', promptFunction, warningMessage: 'custom message'}))
    expect(stderr).to.contain('custom message')
    expect(stdout).to.equal('')
  })

  it('errs on confirm prompt mismatch', async function () {
    promptFunction.resolves('nope')
    await confirmCommand({comparison: 'myapp', promptFunction})
    .catch((error: Error) => {
      expect(ansis.strip(error.message)).to.equal('Confirmation did not match myapp. Aborted.')
    })
  })

  it('displays custom aborted message', async function () {
    const customMessage = 'custom aborted message'
    await confirmCommand({abortedMessage: customMessage, comparison: 'myapp', confirmation: 'nope'})
    .catch((error: Error) => {
      expect(ansis.strip(error.message)).to.equal(`Confirmation nope did not match myapp. ${customMessage}`)
    })
  })

  it('displays custom aborted message on CTRL+C', async function () {
    const customMessage = 'custom aborted message'

    promptFunction.rejects(new ExitPromptError('SIGINT'))
    await confirmCommand({abortedMessage: customMessage, comparison: 'myapp', promptFunction})
    .catch((error: Error) => {
      expect(ansis.strip(error.message)).to.equal(`Cancelled with CTRL+C. ${customMessage}`)
    })
    expect(stdout()).to.equal('')
  })
})
