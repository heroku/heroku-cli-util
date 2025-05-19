import {ux} from '@oclif/core'

export function styledJSON(obj: unknown): void {
  ux.stdout(ux.colorizeJson(obj))
}

