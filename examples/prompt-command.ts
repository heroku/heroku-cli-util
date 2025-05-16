import {Command, ux} from '@oclif/core'

import {prompt} from '../src/ux/prompt.js'

export default class PromptCommand extends Command {
  static description = 'Example command demonstrating prompt usage'

  async run() {
    const name = await prompt('What is your name?', {required: true})
    const favoriteColor = await prompt('What is your favorite color?', {
      default: 'blue',
      required: false,
    })

    ux.stdout(`Hello ${name}! Your favorite color is ${favoriteColor}.`)
  }
}

PromptCommand.run(process.argv.slice(2)).catch(error => {
  console.error('Error:', error)
  throw error
})
