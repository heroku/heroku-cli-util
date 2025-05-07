import {ux} from '@oclif/core'
import {table as cliTable} from '@oclif/core/lib/cli-ux'

export function table<T extends Record<string, unknown>>(
  data: T[],
  columns: Parameters<typeof cliTable>[1],
  options?: Parameters<typeof cliTable>[2],
): void {
  return ux.table(data, columns, options)
}
