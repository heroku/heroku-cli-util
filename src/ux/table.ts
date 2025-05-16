import {printTable} from '@oclif/table'

type Column<T extends Record<string, unknown>> = {
  extended: boolean;
  get(row: T): unknown;
  header: string;
  minWidth: number;
};

type Columns<T extends Record<string, unknown>> = { [key: string]: Partial<Column<T>> };

type Options = {
  columns?: string;
  extended?: boolean;
  filter?: string;
  'no-header'?: boolean;
  'no-truncate'?: boolean;
  printLine?(s: unknown): void;
  rowStart?: string;
  sort?: string;
  title?: string;
}

export function table<T extends Record<string, unknown>>(
  data: T[],
  columns: Columns<T>,
  options?: Options,
) {
  const cols = Object.entries(columns).map(([key, opts]) => {
    if (opts.header) return {key, name: opts.header}
    return key
  })
  const d = data.map(row =>
    Object.fromEntries(Object.entries(columns).map(([key, {get}]) => [key, get ? get(row) : row[key]])),
  ) as Array<Record<string, unknown>>

  printTable({
    borderStyle: 'headers-only-with-underline',
    columns: cols,
    data: d,
    title: options?.title,
  })
}
