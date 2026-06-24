import {ux} from '@oclif/core/ux'
import {printTable, TableOptions} from '@oclif/table'
import {orderBy} from 'natural-orderby'

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
    const columnIds = flags.columns.split(',');
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

function outputCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: Columns<T>,
  printLine: (s: string) => void,
): void {
  const columnEntries = Object.entries(columns);
  const columnHeaders = columnEntries.map(([key, col]) => col.header || key);

  printLine(columnHeaders.join(','));

  for (const row of data) {
    const values = columnEntries.map(([key]) => {
      const value = row[key];
      return escapeCSV(String(value ?? ''));
    });

    printLine(values.join(','));
  }
}

export function table<T extends Record<string, unknown>>(
  data: T[],
  columns: Columns<T>,
  options?: Omit<TableOptions<T>, 'columns' | 'data' | 'filter' | 'sort'> & TableFlags & {printLine?(s: unknown): void;},
) {
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
    processedData = orderBy(
      processedData,
      sortIds.map(id => row => row[id]),
      ['asc'],
    );
  }

  if (options?.csv) {
    const printFn = options?.printLine || ux.stdout;
    outputCSV(processedData, selectedColumns, printFn);
  } else {
    const cols = Object.entries(selectedColumns).map(([key, opts]) => {
      if (opts.header) return {key, name: opts.header};
      return key;
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {columns, csv, extended, filter, printLine, sort, ...tableOptions} = options || {};

    printTable({
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
}
