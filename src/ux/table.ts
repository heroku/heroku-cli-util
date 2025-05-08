import {ux} from '@oclif/core'

export function table<T extends Record<string, unknown>>(
  data: T[],
  columns: ux.Table.table.Columns<T>,
  options?: ux.Table.table.Options,
): void {
  return ux.table<T>(data, columns, options)
}
