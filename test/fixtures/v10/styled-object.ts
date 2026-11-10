// Verbatim copy of src/ux/styled-object.ts from the heroku-cli-util-v10.10.2 release tag (the last release
// before helpers returned strings). Golden reference for test/unit/ux/v10-parity.test.ts.
// Only import paths are rewritten. Delete once heroku/cli v12 has shipped on heroku-cli-util v11.
import {ux} from '@oclif/core/ux'
import {inspect} from 'node:util'

import * as color from '../../../src/ux/colors.js'

function prettyPrint(obj: unknown): string {
  if (!obj) return inspect(obj)
  if (typeof obj === 'string') return obj
  if (typeof obj === 'number') return obj.toString()
  if (typeof obj === 'boolean') return obj.toString()
  if (typeof obj === 'object') {
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${inspect(value)}`)
      .join(', ')
  }

  return inspect(obj)
}

export function styledObject(obj: unknown, keys?: string[]) {
  if (!obj) return inspect(obj)
  if (typeof obj === 'string') return obj
  if (typeof obj === 'number') return obj.toString()
  if (typeof obj === 'boolean') return obj.toString()

  const output: string[] = []
  const keysToIterate = keys || Object.keys(obj)

  // Only calculate max key length for keys that will actually be displayed
  const displayableKeys = keysToIterate.filter(key => {
    const value = (obj as Record<string, unknown>)[key]
    return value !== null && value !== undefined && (!Array.isArray(value) || value.length > 0)
  })
  const keyLengths = displayableKeys.map(key => key.toString().length)
  const maxKeyLength = keyLengths.length > 0 ? Math.max(...keyLengths) + 2 : 0

  const logKeyValue = (key: string, value: unknown): string =>
    `${color.label(key)}:` + ' '.repeat(maxKeyLength - key.length - 1) + prettyPrint(value)

  for (const key of keysToIterate) {
    const value = (obj as Record<string, unknown>)[key]
    if (value === null || value === undefined) continue
    if (Array.isArray(value)) {
      if (value.length > 0) {
        output.push(logKeyValue(key, value[0]))
        for (const e of value.slice(1)) {
          output.push(' '.repeat(maxKeyLength) + prettyPrint(e))
        }
      }
    } else {
      output.push(logKeyValue(key, value))
    }
  }

  ux.stdout(output.join('\n'))
}
