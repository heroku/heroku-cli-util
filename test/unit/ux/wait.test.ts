import {describe, expect, it} from 'vitest'

import {wait} from '../../../src/ux/wait.js'

describe('wait', function () {
  it('should actually wait for at least the specified period of time', async function () {
    const duration = 200
    const start = Date.now()
    await wait(duration)
    const elapsed = Date.now() - start
    // Allow a small margin for timing inaccuracy
    expect(elapsed).toBeGreaterThanOrEqual(duration - 30)
    expect(elapsed).toBeLessThanOrEqual(duration + 30)
  })
})
