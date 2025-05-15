import {Command} from '@oclif/core'

import {styledHeader} from '../src/ux/styled-header.js'

export default class StyledJSONCommand extends Command {
  static description = 'Example command demonstrating styledJSON usage'

  async run() {
    const header = 'My Test Header'
    styledHeader(header)
  }
}

StyledJSONCommand.run(process.argv.slice(2)).catch(error => {
  console.error('Error:', error)
  throw error
})
