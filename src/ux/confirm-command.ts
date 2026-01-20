import {ux} from '@oclif/core'
import tsheredoc from 'tsheredoc'

import * as color from './colors.js'
import {prompt} from './prompt.js'

type ConfirmCommandOptions = {
  abortedMessage?: string
  app: string
  confirm?: string
  promptFunction?: typeof prompt // dependency injection for testing
  warningMessage?: string
}

export async function confirmCommand({
  abortedMessage, app, confirm, promptFunction = prompt, warningMessage,
}: ConfirmCommandOptions) {
  const heredoc = tsheredoc.default

  if (!abortedMessage) {
    abortedMessage = 'Aborted.'
  }

  if (confirm) {
    if (confirm === app) return
    throw new Error(`Confirmation ${color.bold.red(confirm)} did not match ${color.bold.red(app)}. ${abortedMessage}`)
  }

  if (!warningMessage) {
    warningMessage = heredoc`
      Destructive Action
      This command will affect the app ${color.bold.red(app)}
    `
  }

  ux.warn(warningMessage)
  process.stderr.write('\n')

  const entered = await promptFunction(
    `To proceed, type ${color.bold.red(app)} or re-run this command with ${color.bold.red(`--confirm ${app}`)}`,
    {required: true},
  )
  if (entered === app) {
    return
  }

  throw new Error(`Confirmation did not match ${color.bold.red(app)}. ${abortedMessage}`)
}
