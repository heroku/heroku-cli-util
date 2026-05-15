import {captureOutput} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {stdin as mockStdin} from 'mock-stdin'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import {prompt} from '../../../src/ux/prompt.js'

const wait = (ms: number): Promise<void> => new Promise(resolve => {
  setTimeout(resolve, ms)
})

describe('prompt', function () {
  let stdin: ReturnType<typeof mockStdin>

  beforeEach(function () {
    stdin = mockStdin()
  })

  afterEach(function () {
    stdin.restore()
  })

  it('should print the prompt and return the entered value', async function () {
    const {stdout} = await captureOutput(async () => {
      const promptPromise = prompt('Enter something')
      // Give inquirer time to attach to stdin before sending input,
      // since dynamic-import latency in CI can outpace a short setTimeout.
      await wait(2000)
      stdin.send('test-value\n')
      const result = await promptPromise
      expect(result).toBe('test-value')
    })
    const output = ansis.strip(stdout)
    expect(output).toContain('Enter something')
  })
})
