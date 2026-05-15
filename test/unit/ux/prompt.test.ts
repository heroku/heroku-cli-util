import {captureOutput} from '@heroku-cli/test-utils'
import ansis from 'ansis'
import {stdin as mockStdin} from 'mock-stdin'
import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest'

import {prompt} from '../../../src/ux/prompt.js'

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
      setTimeout(() => {
        stdin.send('test-value\n')
      }, 10)
      const result = await prompt('Enter something')
      expect(result).toBe('test-value')
    })
    const output = ansis.strip(stdout)
    expect(output).toContain('Enter something')
  })
})
