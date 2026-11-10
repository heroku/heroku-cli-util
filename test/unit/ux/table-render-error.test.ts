import {
  afterEach, describe, expect, it, vi,
} from 'vitest'

vi.mock('@oclif/table', async importOriginal => ({
  ...await importOriginal<typeof import('@oclif/table')>(),
  printTable() {
    console.log('partial output')
    throw new Error('render failed')
  },
}))

const {table} = await import('../../../src/ux/table.js')

// Only the plain renderer (CI, or at OCLIF_TABLE_LIMIT) goes through printTable and patches console.log.
describe('table when the plain renderer throws', function () {
  afterEach(function () {
    vi.unstubAllEnvs()
  })

  it('rethrows and restores console.log', function () {
    vi.stubEnv('OCLIF_TABLE_SKIP_CI_CHECK', '')
    vi.stubEnv('CI', 'true')
    const originalLog = console.log
    expect(() => table([{foo: 'bar'}], {foo: {}})).toThrow('render failed')
    expect(console.log).toBe(originalLog)
  })
})
