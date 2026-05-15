import {captureOutput} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest'

import {confirmCommand} from '../../../src/ux/confirm-command.js'

// We would import this from inquirer, but it isn't exported so we need to define it here.
class ExitPromptError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExitPromptError'
  }
}

describe('confirmCommand', function () {
  let promptFunction: ReturnType<typeof vi.fn>

  beforeEach(function () {
    promptFunction = vi.fn()
  })

  afterEach(function () {
    vi.restoreAllMocks()
  })

  it('should not error or prompt with confirm flag match', async function () {
    const {stderr, stdout} = await captureOutput(() =>
      confirmCommand({comparison: 'myapp', confirmation: 'myapp'}))
    expect(stderr).toBe('')
    expect(stdout).toBe('')
  })

  it('errs on confirm flag mismatch', async function () {
    await confirmCommand({comparison: 'myapp', confirmation: 'nope'})
      .catch((error: Error) => {
        expect(ansis.strip(error.message)).toBe('Confirmation nope did not match myapp. Aborted.')
      })
  })

  it('errs on confirm prompt match', async function () {
    promptFunction.mockResolvedValue('myapp')
    const {stderr, stdout} = await captureOutput(() =>
      confirmCommand({comparison: 'myapp', promptFunction}))
    expect(stderr).toContain('Warning: Destructive Action')
    expect(stdout).toBe('')
  })

  it('displays custom warning message', async function () {
    promptFunction.mockResolvedValue('myapp')
    const {stderr, stdout} = await captureOutput(() =>
      confirmCommand({comparison: 'myapp', promptFunction, warningMessage: 'custom message'}))
    expect(stderr).toContain('custom message')
    expect(stdout).toBe('')
  })

  it('errs on confirm prompt mismatch', async function () {
    promptFunction.mockResolvedValue('nope')
    await confirmCommand({comparison: 'myapp', promptFunction})
      .catch((error: Error) => {
        expect(ansis.strip(error.message)).toBe('Confirmation did not match myapp. Aborted.')
      })
  })

  it('displays custom aborted message', async function () {
    const customMessage = 'custom aborted message'
    await confirmCommand({abortedMessage: customMessage, comparison: 'myapp', confirmation: 'nope'})
      .catch((error: Error) => {
        expect(ansis.strip(error.message)).toBe(`Confirmation nope did not match myapp. ${customMessage}`)
      })
  })

  it('displays custom aborted message on CTRL+C', async function () {
    const customMessage = 'custom aborted message'

    promptFunction.mockRejectedValue(new ExitPromptError('SIGINT'))
    const {stdout} = await captureOutput(() =>
      confirmCommand({abortedMessage: customMessage, comparison: 'myapp', promptFunction})
        .catch((error: Error) => {
          expect(ansis.strip(error.message)).toBe(`Cancelled with CTRL+C. ${customMessage}`)
        }))
    expect(stdout).toBe('')
  })
})
