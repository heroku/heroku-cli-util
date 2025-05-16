import {Command, ux} from '@oclif/core'

import {confirm} from '../src/ux/confirm.js'

export default class ConfirmCommand extends Command {
  static description = 'Example command demonstrating confirm usage'

  async run() {
    const shouldProceed = await confirm('Do you want to proceed with this action?')

    if (shouldProceed) {
      ux.stdout('User confirmed the action!')
    } else {
      ux.stdout('User declined or timed out.')
    }
  }
}

ConfirmCommand.run(process.argv.slice(2)).catch(error => {
  console.error('Error:', error)
  throw error
})
