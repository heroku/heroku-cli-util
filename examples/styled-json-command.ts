import {Command} from '@oclif/core'

import {styledJSON} from '../src/ux/styled-json.js'

export default class StyledJSONCommand extends Command {
  static description = 'Example command demonstrating styledJSON usage'

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

    // Display the data using styledJS
    styledJSON(data)
  }
}

// Execute the command
try {
  await StyledJSONCommand.run(process.argv.slice(2))
} catch (error) {
  console.error('Error:', error)
  throw error
}
