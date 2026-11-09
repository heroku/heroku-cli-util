import {makeTable, printTable, TableOptions} from '@oclif/table'
import {orderBy} from 'natural-orderby'
import {env} from 'node:process'
import {format} from 'node:util'

import parseKeyValue from '../utils/parse-key-value.js'

type Column<T extends Record<string, unknown>> = {
  extended: boolean;
  get(row: T): unknown;
  header: string;
  minWidth: number;
};

type Columns<T extends Record<string, unknown>> = {[key: string]: Partial<Column<T>>};

type TableFlags = {
  columns?: string;     // Comma-separated column identifiers (headers or keys)
  csv?: boolean;        // Enable CSV output
  extended?: boolean;   // Show extended columns
  filter?: string;      // Property=value filter (simple includes matching)
  sort?: string;        // Comma-separated property names (ascending only)
};

/**
 * Finds a column by id (header name or property key), case-insensitively.
 * Returns undefined if no match found.
 */
function getColumnById<T extends Record<string, unknown>>(
  id: string,
  columns: Columns<T>,
): [string, Partial<Column<T>>] | undefined {
  const lowerCaseId = id.toLowerCase();

  for (const [key, col] of Object.entries(columns)) {
    if (col.header?.toLowerCase() === lowerCaseId || key.toLowerCase() === lowerCaseId) {
      return [key, col];
    }
  }

  return undefined;
}

/**
 * Selects columns based on --columns or --extended flags.
 * --columns takes precedence over --extended.
 */
function selectColumns<T extends Record<string, unknown>>(
  columns: Columns<T>,
  flags: {columns?: string; extended?: boolean},
): Columns<T> {
  if (flags.columns) {
    const columnIds = flags.columns.split(',').filter(id => id.trim());
    const uniqueColumnIds = [...new Set(columnIds)];

    const selectedColumns: Columns<T> = {};

    for (const id of uniqueColumnIds) {
      const column = getColumnById(id, columns);
      if (!column) {
        throw new Error('Columns flag has an invalid value.');
      }

      const [key, col] = column;
      selectedColumns[key] = col;
    }

    return selectedColumns;
  }

  if (!flags.extended) {
    const baseColumns: Columns<T> = {};
    for (const [key, col] of Object.entries(columns)) {
      if (!col.extended) {
        baseColumns[key] = col;
      }
    }

    return baseColumns;
  }

  return columns;
}

/**
 * Builds a filter predicate function for substring matching.
 */
function getFilterPredicate<T extends Record<string, unknown>>(
  columns: Columns<T>,
  filter: string,
): (row: Record<string, unknown>) => boolean {
  const {key: columnId, value: searchValue} = parseKeyValue(filter);

  if (!searchValue) {
    throw new Error('Filter flag has an invalid value.');
  }

  const column = getColumnById(columnId, columns);
  if (!column) {
    throw new Error('Filter flag has an invalid value.');
  }

  const [key] = column;
  return (row: Record<string, unknown>) => {
    const cellValue = String(row[key] ?? '');
    return cellValue.includes(searchValue);
  };
}

/**
 * Gets the identifiers for the sort properties.
 */
function getSortIds<T extends Record<string, unknown>>(columns: Columns<T>, sort: string): string[] {
  const sortIds = sort
    .split(',')
    .filter(id => id.trim())
    .map(id => {
      const column = getColumnById(id, columns);
      if (!column) {
        throw new Error('Sort flag has an invalid value.');
      }

      const [key] = column;
      return key;
    });

  if (sortIds.length === 0) {
    throw new Error('Sort flag has an invalid value.');
  }

  return sortIds;
}

function escapeCSV(value: string): string {
  const needsEscaping = /["\n\r,]/.test(value);
  return needsEscaping ? `"${value.replaceAll('"', '""')}"` : value;
}

function renderCSV<T extends Record<string, unknown>>(
  data: Array<Record<string, unknown>>,
  columns: Columns<T>,
): string {
  const columnEntries = Object.entries(columns);
  const columnHeaders = columnEntries.map(([key, col]) => col.header || key);

  const lines = [columnHeaders.join(',')];

  for (const row of data) {
    const values = columnEntries.map(([key]) => {
      const value = row[key];
      return escapeCSV(String(value ?? ''));
    });

    lines.push(values.join(','));
  }

  return lines.join('\n');
}

function isTruthy(value: string | undefined): boolean {
  return value !== '0' && value !== 'false'
}

/**
 * Whether `printTable` would use its plain-text renderer instead of ink: in CI, or at
 * OCLIF_TABLE_LIMIT rows or more. `@oclif/table` doesn't export this check, so it is copied
 * from `printTable` and `shouldUsePlainTable` (@oclif/table 1.0.8, lib/table.js and
 * lib/utils.js), quirks included: `CI=''` counts as CI. The heroku-cli-util 10.x parity tests
 * fail if this drifts from upstream.
 */
function usesPlainRenderer(rowCount: number): boolean {
  const limit = Number.parseInt(env.OCLIF_TABLE_LIMIT ?? env.SF_TABLE_LIMIT ?? '10000', 10)
  if (rowCount >= limit) return true

  if (env.OCLIF_TABLE_SKIP_CI_CHECK && isTruthy(env.OCLIF_TABLE_SKIP_CI_CHECK)) return false
  return isTruthy(env.CI)
    && ('CI' in env || 'CONTINUOUS_INTEGRATION' in env || Object.keys(env).some(key => key.startsWith('CI_')))
}

/**
 * Renders a table to a string, byte-for-byte identical to what `printTable` prints (minus the
 * final newline, which `this.log()` adds back), so output matches heroku-cli-util 10.x.
 *
 * The ink renderer goes through `makeTable`, which is `printTable`'s ink path returning the frame
 * instead of writing it. (ink itself still swaps `console.log` while rendering, its default
 * `patchConsole` behavior, as it did in 10.x.) `makeTable` has no plain-text fallback, and the
 * plain renderer isn't exported, so for that case `printTable` runs with `console.log` (the only
 * way that renderer writes) temporarily replaced to collect its lines. `console.log` is replaced directly, not
 * reached via `process.stdout.write`, because test runners (e.g. vitest by default) swap
 * `console` for one that doesn't write to `process.stdout`.
 *
 * The plain render is synchronous, so asynchronous logs from elsewhere can't land in the capture.
 * Synchronous `console.log` calls made during it (e.g. from a cell value's `toString()`) would.
 */
function renderTable<T extends Record<string, unknown>>(options: TableOptions<T>): string {
  if (!usesPlainRenderer(options.data.length)) return makeTable(options)

  const lines: string[] = []
  const originalLog = console.log
  console.log = (...args: unknown[]) => {
    lines.push(format(...args))
  }

  try {
    printTable(options)
  } finally {
    console.log = originalLog
  }

  // Each line was printed with its own newline; joining drops the final one.
  return lines.join('\n')
}

/**
 * Renders data as a table (or CSV with `csv: true`). Pure: returns the string and writes nothing.
 * Pass the result to `this.log()` so it is suppressed under `--json`.
 */
export function table<T extends Record<string, unknown>>(
  data: T[],
  columns: Columns<T>,
  options?: Omit<TableOptions<T>, 'columns' | 'data' | 'filter' | 'sort'> & TableFlags,
): string {
  const selectedColumns = selectColumns(columns, {
    columns: options?.columns,
    extended: options?.extended,
  });

  let processedData = data.map(row =>
    Object.fromEntries(Object.entries(selectedColumns).map(([key, {get}]) => [
      key,
      get ? get(row) : row[key],
    ]))) as Array<Record<string, unknown>>;

  if (options?.filter) {
    const filterPredicate = getFilterPredicate(selectedColumns, options.filter);
    processedData = processedData.filter(row => filterPredicate(row));
  }

  if (options?.sort) {
    const sortIds = getSortIds(selectedColumns, options.sort);
    processedData = orderBy(processedData, sortIds, ['asc']);
  }

  if (options?.csv) {
    return renderCSV(processedData, selectedColumns);
  }

  const cols = Object.entries(selectedColumns).map(([key, opts]) => {
    if (opts.header) return {key, name: opts.header};
    return key;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {columns: _columns, csv, extended, filter, sort, ...tableOptions} = options || {};

  return renderTable({
    ...(tableOptions?.noStyle
      ? {}
      : {
        borderColor: 'whiteBright',
        borderStyle: 'headers-only-with-underline',
        headerOptions: {
          bold: true,
          color: 'white', // or 'reset' to use default terminal color
        },
      }),
    ...tableOptions,
    columns: cols,
    data: processedData as T[],
  });
}
