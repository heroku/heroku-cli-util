import {ux} from '@oclif/core/ux'

export function styledJSON(obj: unknown): void {
  ux.stdout(ux.colorizeJson(obj))
}
