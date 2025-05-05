import {ux} from '@oclif/core'

export function styledObject(obj: unknown, keys?: string[]): void {
  return ux.styledObject(obj, keys)
}
