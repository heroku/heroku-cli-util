import {
  describe, expect, it, vi,
} from 'vitest'

vi.mock('@oclif/table', async importOriginal => ({
  ...await importOriginal<typeof import('@oclif/table')>(),
  printTable() {
    process.stdout.write('partial output')
    throw new Error('render failed')
  },
}))

const {table} = await import('../../../src/ux/table.js')

describe('table when printTable throws', function () {
  it('rethrows and restores process.stdout.write', function () {
    const originalWrite = process.stdout.write
    expect(() => table([{foo: 'bar'}], {foo: {}})).toThrow('render failed')
    expect(process.stdout.write).toBe(originalWrite)
  })
})
