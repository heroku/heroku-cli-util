import {ux} from '@oclif/core'
import tsheredoc from 'tsheredoc'

import * as color from './colors.js'
import {prompt} from './prompt.js'

type ConfirmCommandOptions = {
  abortedMessage?: string
  comparison: string
  confirmation?: string
  promptFunction?: typeof prompt // dependency injection for testing
  warningMessage?: string
}

/**
 * @description Prompts the user to confirm a destructive action by typing a comparison string, or validates a
 * pre-provided confirmation.
 * @param options - Configuration options for the confirmation command.
 * @param options.abortedMessage - Custom message to display when the action is aborted (default: 'Aborted.').
 * @param options.comparison - The string that must be entered to confirm the action (required). Typically the app name,
 * but can be other identifiers like a Private Space name.
 * @param options.confirmation - Pre-provided confirmation string to validate without prompting (optional). If provided
 * and matches comparison, returns immediately without prompting.
 * @param options.promptFunction - Function to use for prompting (default: prompt, used for dependency injection in tests).
 * @param options.warningMessage - Custom warning message to display before prompting (optional). Default message assumes
 * comparison is an app name. Provide a custom message if using a different identifier.
 * @returns Promise that resolves if confirmation matches, or throws an error if it doesn't.
 * @throws {Error} When confirmation doesn't match the comparison string.
 * @example
 *   // Interactive prompt
 *   await confirmCommand({comparison: 'my-app'})
 *
 *   // Pre-provided confirmation (no prompt)
 *   await confirmCommand({comparison: 'my-app', confirmation: 'my-app'})
 *
 *   // Custom messages
 *   await confirmCommand({
 *     comparison: 'my-app',
 *     warningMessage: 'This will delete your database',
 *     abortedMessage: 'Database deletion cancelled.'
 *   })
 */
export async function confirmCommand({
  abortedMessage, comparison, confirmation, promptFunction = prompt, warningMessage,
}: ConfirmCommandOptions) {
  const heredoc = tsheredoc.default

  if (!abortedMessage) {
    abortedMessage = 'Aborted.'
  }

  if (confirmation) {
    if (confirmation === comparison) return
    throw new Error(`Confirmation ${color.bold.red(confirm)} did not match ${color.bold.red(comparison)}. ${abortedMessage}`)
  }

  if (!warningMessage) {
    warningMessage = heredoc`
      Destructive Action
      This command will affect the app ${color.bold.red(comparison)}
    `
  }

  ux.warn(warningMessage)
  process.stderr.write('\n')

  const entered = await promptFunction(
    `To proceed, type ${color.bold.red(comparison)} or re-run this command with ${color.bold.red(`--confirm ${comparison}`)}`,
    {required: true},
  )
  if (entered === comparison) {
    return
  }

  throw new Error(`Confirmation did not match ${color.bold.red(comparison)}. ${abortedMessage}`)
}
