import {ux} from '@oclif/core'

import * as color from './colors.js'

export function styledHeader(header: string): void {
  return ux.stdout(color.label('=== ') + color.label(header) + '\n')
}
