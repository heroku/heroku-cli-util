import {error} from '@oclif/core/errors'

import * as color from './colors.js'

function readChar(): Promise<string> {
  return new Promise(resolve => {
    process.stdin.setEncoding('utf8')
    process.stdin.resume()
    process.stdin.once('data', b => {
      process.stdin.pause()
      const data: string = (typeof b === 'string' ? b : b.toString()).trim()
      resolve(data)
    })
  })
}

export async function anykey(message?: string): Promise<string> {
  const {isRaw, isTTY} = process.stdin
  if (!message) {
    message = isTTY
      ? `Press any key to continue or ${color.ansi.yellow('q')} to exit`
      : `Press enter to continue or ${color.ansi.yellow('q')} to exit`
  }

  if (isTTY) process.stdin.setRawMode(true)

  process.stderr.write(message)
  const char = await readChar()

  if (isTTY) {
    process.stdin.setRawMode(isRaw ?? false)
    process.stderr.write('\n')
  }

  if (char === 'q') error('quit')
  if (char === '\u0003') error('ctrl-c')

  return char
}
