import {captureOutput} from '@heroku-cli/test-utils'
import {Errors} from '@oclif/core'
import ansis from 'ansis'
import {stdin as mockStdin} from 'mock-stdin'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import {anykey} from '../../../src/ux/any-key.js'

const wait = (ms: number): Promise<void> => new Promise(resolve => {
  setTimeout(resolve, ms)
})

describe('anykey', function () {
  let stdin: ReturnType<typeof mockStdin>

  beforeEach(function () {
    stdin = mockStdin()
  })

  afterEach(function () {
    stdin.restore()
  })

  it('throws a \'quit\' error when the user enters \'q\'', async function () {
    const {stderr} = await captureOutput(async () => {
      const anyKeyPromise = anykey().catch((error: Errors.CLIError) => {
        expect(error.message).toBe('quit')
      })
      await wait(2000)
      stdin.send('q')
      await anyKeyPromise
    })
    const output = ansis.strip(stderr)
    expect(output).toBe('Press enter to continue or q to exit')
  })

  it('throws a \'ctrl-c\' error when the user enters \'ctrl-c\'', async function () {
    const {stderr} = await captureOutput(async () => {
      const anyKeyPromise = anykey().catch((error: Errors.CLIError) => {
        expect(error.message).toBe('ctrl-c')
      })
      await wait(2000)
      stdin.send('\u0003')
      await anyKeyPromise
    })
    const output = ansis.strip(stderr)
    expect(output).toBe('Press enter to continue or q to exit')
  })

  it('should return the key pressed by the user', async function () {
    const {stderr} = await captureOutput(async () => {
      const anyKeyPromise = anykey()
      await wait(2000)
      stdin.send('a')
      const result = await anyKeyPromise
      expect(result).toBe('a')
    })
    const output = ansis.strip(stderr)
    expect(output).toBe('Press enter to continue or q to exit')
  })
})
