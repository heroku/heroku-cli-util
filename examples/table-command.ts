import {Command, Flags} from '@oclif/core'

import {table} from '../src/ux/table.js'

export default class TableCommand extends Command {
  static description = 'Example command demonstrating table usage with flags'
  static flags = {
    columns: Flags.string({description: 'Only show specified columns (comma-separated)'}),
    csv: Flags.boolean({description: 'Output in CSV format'}),
    extended: Flags.boolean({description: 'Show extended columns'}),
    filter: Flags.string({description: 'Filter rows by property=value'}),
    sort: Flags.string({description: 'Sort by property (comma-separated for multi-column)'}),
  }

  async run() {
    const {flags} = await this.parse(TableCommand)

    // Sample data to display in the table
    const data = [
      {
        email: 'john@example.com',
        id: 1,
        name: 'John Doe',
        role: 'Developer',
        status: 'Active',
      },
      {
        email: 'jane@example.com',
        id: 2,
        name: 'Jane Smith',
        role: 'Designer',
        status: 'On Leave',
      },
      {
        email: 'bob@example.com',
        id: 3,
        name: 'Bob Johnson',
        role: 'Manager',
        status: 'Active',
      },
    ]

    // Define the columns configuration
    const columns = {
      email: {
        extended: true,  // Hidden by default, shown with --extended
        header: 'Email',
        minWidth: 15,
      },
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

    // Display the table with flags
    table(data, columns, {
      ...flags,  // Pass all flags to table function
      printLine: this.log.bind(this),
    })
  }
}

// Execute the command
try {
  await TableCommand.run(process.argv.slice(2))
} catch (error) {
  console.error('Error:', error)
  throw error
}
