import {ux} from '@oclif/core'

export function table(
  data: Record<string, unknown>[],
  columns: ux.Table.table.Columns<Record<string, unknown>>,
  options?: ux.Table.table.Options,
): void {
  return ux.table(data, columns, options)
}
