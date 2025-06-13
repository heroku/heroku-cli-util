import {TableOptions, printTable} from '@oclif/table'

type Column<T extends Record<string, unknown>> = {
  extended: boolean;
  get(row: T): unknown;
  header: string;
  minWidth: number;
};

type Columns<T extends Record<string, unknown>> = { [key: string]: Partial<Column<T>> };

export function table<T extends Record<string, unknown>>(
  data: T[],
  columns: Columns<T>,
  options?: { printLine?(s: unknown): void } & Omit<TableOptions<T>, 'columns' | 'data'>,
) {
  const cols = Object.entries(columns).map(([key, opts]) => {
    if (opts.header) return {key, name: opts.header}
    return key
  })
  const d = data.map(row =>
    Object.fromEntries(Object.entries(columns).map(([key, {get}]) => [key, get ? get(row) : row[key]])),
  ) as Array<Record<string, unknown>>

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {printLine, ...tableOptions} = options || {}

  printTable({
    ...(tableOptions?.noStyle ? {} : {
      borderColor: 'whiteBright',
      borderStyle: 'headers-only-with-underline',
      headerOptions: {
        color: 'rgb(147, 112, 219)',
      },
    }),
    ...tableOptions,
    columns: cols,
    data: d as T[],
  })
}
