import {Command} from '@oclif/core'

import {table} from '../src/ux/table.js'

export default class TableCommand extends Command {
  static description = 'Example command demonstrating table usage'

  async run() {
    // Sample data to display in the table
    const data = [
      {
        id: 1,
        name: 'John Doe',
        role: 'Developer',
        status: 'Active',
      },
      {
        id: 2,
        name: 'Jane Smith',
        role: 'Designer',
        status: 'On Leave',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        role: 'Manager',
        status: 'Active',
      },
    ]

    // Define the columns configuration
    const columns = {
      id: {
        header: 'ID',
        minWidth: 2,
      },
      name: {
        header: 'Name',
        minWidth: 10,
      },
      role: {
        header: 'Role',
        minWidth: 8,
      },
      status: {
        header: 'Status',
        minWidth: 8,
      },
    }

    // Display the table
    table(data, columns, {
      printLine: this.log.bind(this),
    })
  }
}

// Execute the command
TableCommand.run(process.argv.slice(2)).catch(error => {
  console.error('Error:', error)
  throw error
})
