import color from '@heroku-cli/color'
import {ux} from '@oclif/core'

export function styledHeader(header: string): void {
  return ux.stdout(color.dim('=== ') + color.bold(header) + '\n')
}
