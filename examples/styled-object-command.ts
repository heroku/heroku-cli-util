import {Command} from '@oclif/core'

import {styledObject} from '../src/ux/styled-object'

export default class StyledObjectCommand extends Command {
  static description = 'Example command demonstrating styledObject usage'

  async run() {
    // Example data to display
    const data = {
      config: {
        debug: true,
        port: 3000,
      },
      features: ['feature1', 'feature2'],
      name: 'Example App',
      version: '1.0.0',
    }

    // Display the data using styledObject
    styledObject(data)
  }
}

// Execute the command
try {
  await StyledObjectCommand.run(process.argv.slice(2))
} catch (error) {
  console.error('Error:', error)
  throw error
}
