import {captureOutput} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {stdin as mockStdin} from 'mock-stdin'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import {confirm} from '../../../src/ux/confirm.js'

const wait = (ms: number): Promise<void> => new Promise(resolve => {
  setTimeout(resolve, ms)
})

describe('confirm', function () {
  let stdin: ReturnType<typeof mockStdin>

  beforeEach(function () {
    stdin = mockStdin()
  })

  afterEach(function () {
    stdin.restore()
  })

  it('should print the prompt and return true for yes', async function () {
    const {stdout} = await captureOutput(async () => {
      const confirmPromise = confirm('Are you sure')
      await wait(2000)
      stdin.send('y\n')
      const result = await confirmPromise
      expect(result).toBe(true)
    })
    const output = ansis.strip(stdout)
    expect(output).toContain('Are you sure')
  })

  it('should print the prompt and return false for no', async function () {
    const {stdout} = await captureOutput(async () => {
      const confirmPromise = confirm('Are you sure')
      await wait(2000)
      stdin.send('n\n')
      const result = await confirmPromise
      expect(result).toBe(false)
    })
    const output = ansis.strip(stdout)
    expect(output).toContain('Are you sure')
  })

  it('should use default answer when timed out', async function () {
    const {stdout} = await captureOutput(async () => {
      const confirmPromise = confirm('Are you sure', {ms: 1000})
      await wait(2000) // Wait longer than the timeout
      const result = await confirmPromise
      expect(result).toBe(false) // Default answer is false
    })
    const output = ansis.strip(stdout)
    expect(output).toContain('Are you sure')
  })

  it('should use custom default answer when timed out', async function () {
    const {stdout} = await captureOutput(async () => {
      const confirmPromise = confirm('Are you sure', {defaultAnswer: true, ms: 1000})
      await wait(2000) // Wait longer than the timeout
      const result = await confirmPromise
      expect(result).toBe(true) // Custom default answer is true
    })
    const output = ansis.strip(stdout)
    expect(output).toContain('Are you sure')
  })
})
