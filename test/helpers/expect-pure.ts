import {captureOutput} from '@heroku-cli/test-utils'
import {expect} from 'vitest'

/**
 * Calls a pure formatter, asserts it wrote nothing to stdout or stderr, and returns its result.
 * Formatters must return their output so callers can route it through this.log(), which oclif
 * suppresses under --json.
 */
export async function expectPure<T>(fn: () => T): Promise<T> {
  let result: T | undefined
  const {stderr, stdout} = await captureOutput(() => {
    result = fn()
  })
  expect(stdout).toBe('')
  expect(stderr).toBe('')
  return result as T
}
