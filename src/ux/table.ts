import { ux } from '@oclif/core';

export function table<T extends Record<string, unknown>>(
  data: T[],
  columns: Parameters<typeof ux.table>[1],
  options?: Parameters<typeof ux.table>[2]
): void {
  return ux.table(data, columns, options);
} 
