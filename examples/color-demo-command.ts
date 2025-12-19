import {Command} from '@oclif/core'
import {ux} from '@oclif/core'

import {color} from '../src/index.js'

export default class ColorDemoCommand extends Command {
  static description = 'Demo of the new Heroku CLI color palette using ansis'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  async run(): Promise<void> {
    ux.stdout('\n')
    ux.stdout(color.label('🎨 Heroku CLI Color Palette Demo\n'))
    ux.stdout(color.info('This demo showcases all the colors defined in the new Heroku CLI design system.\n\n'))

    // Colors for entities on the Heroku platform
    ux.stdout(color.label('📱 App-Related Colors:\n'))
    ux.stdout(`  ${color.app('app')} - Name of an app (${color.colorPalette.app.hex}, ${color.colorPalette.app.name}, ${color.colorPalette.app.style})\n`)
    ux.stdout(`  ${color.pipeline('pipeline')} - Name of a pipeline (${color.colorPalette.pipeline.hex}, ${color.colorPalette.pipeline.name})\n`)
    ux.stdout(`  ${color.space('space')} - Name of a space (${color.colorPalette.space.hex}, ${color.colorPalette.space.name}, ${color.colorPalette.space.style})\n`)
    ux.stdout(`  ${color.datastore('datastore')} - Name of a heroku datastore (${color.colorPalette.datastore.hex}, ${color.colorPalette.datastore.name}, ${color.colorPalette.datastore.style})\n`)
    ux.stdout(`  ${color.addon('addon')} - Name of an addon (${color.colorPalette.addon.hex}, ${color.colorPalette.addon.name}, ${color.colorPalette.addon.style})\n`)
    ux.stdout(`  ${color.attachment('attachment')} - Name of an attachment (${color.colorPalette.attachment.hex}, ${color.colorPalette.attachment.name})\n`)
    ux.stdout(`  ${color.name('name')} - Name of heroku entity without special color (${color.colorPalette.name.hex}, ${color.colorPalette.name.name})\n`)

    ux.stdout('')

    // Status colors
    ux.stdout(color.label('📊 Status Colors:\n'))
    ux.stdout(`  ${color.success('success')} - Success messages and states (${color.colorPalette.success.hex}, ${color.colorPalette.success.name})\n`)
    ux.stdout(`  ${color.failure('failure')} - Failure, error messages and states (${color.colorPalette.failure.hex}, ${color.colorPalette.failure.name})\n`)
    ux.stdout(`  ${color.warning('warning')} - Warning messages (${color.colorPalette.warning.hex}, ${color.colorPalette.warning.name})\n`)
    ux.stdout(`  ${color.inactive('inactive')} - Disabled and unknown states (${color.colorPalette.inactive.hex}, ${color.colorPalette.inactive.name})\n`)

    ux.stdout('')

    // User/Team colors
    ux.stdout(color.label('👥 User/Team Colors:\n'))
    ux.stdout(`  ${color.team('team')} - Heroku team/org (${color.colorPalette.team.hex}, ${color.colorPalette.team.name}, ${color.colorPalette.team.style})\n`)
    ux.stdout(`  ${color.user('user')} - Heroku user/email (${color.colorPalette.user.hex}, ${color.colorPalette.user.name})\n`)

    ux.stdout('')

    // General purpose colors
    ux.stdout(color.label('🔧 General Purpose Colors:\n'))
    ux.stdout(`  ${color.label('label')} - Labels, table headers, keys (${color.colorPalette.label.hex}, ${color.colorPalette.label.name}, ${color.colorPalette.label.style})\n`)
    ux.stdout(`  ${color.info('info')} - Help text, soft alerts (${color.colorPalette.info.hex}, ${color.colorPalette.info.name})\n`)
    ux.stdout(`  ${color.command('heroku command --flag')} - Command examples and code blocks (${color.colorPalette.command.hex}, ${color.colorPalette.command.name})\n`)

    ux.stdout('')

    // Example usage scenarios
    ux.stdout(color.label('💡 Example Usage Scenarios:\n'))

    ux.stdout(color.info('App deployment status:\n'))
    ux.stdout(`  Deploying ${color.app('my-awesome-app')} to ${color.space('production')}...\n`)
    ux.stdout(`  ${color.success('✓')} Build succeeded\n`)
    ux.stdout(`  ${color.success('✓')} Release v42 created\n`)
    ux.stdout(`  ${color.success('✓')} Deploy complete\n\n`)

    ux.stdout(color.info('Addon management:\n'))
    ux.stdout(`  Adding ${color.addon('heroku-postgresql:essential-0')} to ${color.app('my-app')}\n`)
    ux.stdout(`  ${color.warning('⚠')}  This will add charges to your account\n`)
    ux.stdout(`  ${color.success('✓')} Addon provisioned\n\n`)

    ux.stdout(color.info('Pipeline operations:\n'))
    ux.stdout(`  Promoting ${color.app('staging-app')} from ${color.pipeline('staging')} to ${color.pipeline('production')}\n`)
    ux.stdout(`  ${color.info('ℹ')}  This will deploy to ${color.space('production')} space\n`)
    ux.stdout(`  ${color.success('✓')} Promotion complete\n\n`)

    ux.stdout(color.info('Database operations:\n'))
    ux.stdout(`  Connecting to ${color.datastore('DATABASE')} on ${color.app('my-app')}\n`)
    ux.stdout(`  ${color.success('✓')} Connection established\n`)
    ux.stdout(`  ${color.info('ℹ')}  Database: ${color.datastore('postgresql-cylindrical-12345')}\n\n`)

    ux.stdout(color.info('Error handling:\n'))
    ux.stdout(`  ${color.failure('✗')} Failed to deploy ${color.app('my-app')}\n`)
    ux.stdout(`  ${color.failure('Error:')} Build timeout after 15 minutes\n`)
    ux.stdout(`  ${color.info('ℹ')}  Try increasing build timeout or optimizing your build process\n\n`)

    ux.stdout(color.info('Team and user management:\n'))
    ux.stdout(`  Adding ${color.user('developer@company.com')} to ${color.team('my-team')}\n`)
    ux.stdout(`  ${color.success('✓')} User added with collaborator access\n\n`)

    ux.stdout(color.info('Table headers and labels:\n'))
    ux.stdout(`  ${color.label('Name')}    ${color.label('Status')}    ${color.label('Updated')}\n`)
    ux.stdout(`  ${color.app('my-app')}     ${color.success('active')}     2024-01-15\n`)
    ux.stdout(`  ${color.app('old-app')}    ${color.inactive('inactive')}   2023-12-01\n\n`)

    ux.stdout(color.info('Command examples:\n'))
    ux.stdout(`  ${color.info('To list your apps:')}\n`)
    ux.stdout(`  ${color.command('heroku apps:list')}\n`)
    ux.stdout(`  ${color.info('To create a new app:')}\n`)
    ux.stdout(`  ${color.command('heroku apps:create my-awesome-app')}\n\n`)

    ux.stdout(color.label('🎯 Color Palette Summary:\n'))
    ux.stdout(color.info('All colors are designed to be accessible and consistent across the Heroku CLI experience.\n'))
    ux.stdout(color.info('Bold styling is used for primary entities (apps, spaces, datastores, addons, teams) and labels.\n'))
    ux.stdout(color.info('Status colors follow semantic conventions: green for success, red for errors, orange for warnings.\n'))
    ux.stdout(color.info('Purple is used for apps and pipelines, magenta for general names, and yellow for addons and datastores.\n\n'))
  }
}

try {
  await ColorDemoCommand.run(process.argv.slice(2))
} catch (error) {
  console.error('Error:', error)
  throw error
}
