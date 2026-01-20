import {stderr, stdout} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {expect} from 'chai'
import sinon from 'sinon'

import {confirmCommand} from '../../../src/ux/confirm-command.js'

describe('confirmCommand', function () {
  let promptFunction: sinon.SinonStub

  beforeEach(function () {
    promptFunction = sinon.stub()
  })

  afterEach(function () {
    sinon.restore()
  })

  it('should not error or prompt with confirm flag match', async function () {
    await confirmCommand({comparison: 'myapp', confirmation: 'myapp'})
    expect(stderr()).to.equal('')
    expect(stdout()).to.equal('')
  })

  it('should err on confirm flag mismatch', async function () {
    await confirmCommand({comparison: 'myapp', confirmation: 'nope'})
      .catch((error: Error) => {
        expect(ansis.strip(error.message)).to.equal('Confirmation nope did not match app. Aborted.')
      })
  })

  it('should not err on confirm prompt match', async function () {
    promptFunction.resolves('myapp')
    await confirmCommand({comparison: 'myapp', promptFunction})
    expect(stderr()).to.contain('Warning: Destructive Action')
    expect(stdout()).to.equal('')
  })

  it('should display custom message', async function () {
    promptFunction.resolves('myapp')
    await confirmCommand({comparison: 'myapp', promptFunction, warningMessage: 'custom message'})
    expect(stderr()).to.contain('custom message')
    expect(stdout()).to.equal('')
  })

  it('should err on confirm prompt mismatch', async function () {
    promptFunction.resolves('nope')
    await confirmCommand({comparison: 'myapp', promptFunction})
      .catch((error: Error) => {
        expect(ansis.strip(error.message)).to.equal('Confirmation did not match app. Aborted.')
      })
  })

  it('should display custom aborted message', async function () {
    const customMessage = 'custom aborted message'
    await confirmCommand({abortedMessage: customMessage, comparison: 'myapp', confirmation: 'nope'})
      .catch((error: Error) => {
        expect(ansis.strip(error.message)).to.equal(`Confirmation nope did not match app. ${customMessage}`)
      })
  })
})
