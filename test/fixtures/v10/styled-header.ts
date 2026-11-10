// Verbatim copy of src/ux/styled-header.ts from the heroku-cli-util-v10.10.2 release tag (the last release
// before helpers returned strings). Golden reference for test/unit/ux/v10-parity.test.ts.
// Only import paths are rewritten. Delete once heroku/cli v12 has shipped on heroku-cli-util v11.
import {ux} from '@oclif/core/ux'

import * as color from '../../../src/ux/colors.js'

export function styledHeader(header: string): void {
  return ux.stdout(color.label('=== ') + color.label(header) + '\n')
}
