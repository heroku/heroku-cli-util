import {ux} from '@oclif/core'
import {inspect} from 'node:util'

import * as color from './colors.js'

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
  const keyLengths = Object.keys(obj).map(key => key.toString().length)
  const maxKeyLength = Math.max(...keyLengths) + 2

  const logKeyValue = (key: string, value: unknown): string =>
    `${color.label(key)}:` + ' '.repeat(maxKeyLength - key.length - 1) + prettyPrint(value)

  for (const [key, value] of Object.entries(obj)) {
    if (keys && !keys.includes(key)) continue
    if (Array.isArray(value)) {
      if (value.length > 0) {
        output.push(logKeyValue(key, value[0]))
        for (const e of value.slice(1)) {
          output.push(' '.repeat(maxKeyLength) + prettyPrint(e))
        }
      }
    } else if (value !== null && value !== undefined) {
      output.push(logKeyValue(key, value))
    }
  }

  ux.stdout(output.join('\n'))
}
