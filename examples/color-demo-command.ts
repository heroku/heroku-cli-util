import {Command} from '@oclif/core'
import {ux} from '@oclif/core'

import * as colors from '../src/ux/colors.js'

export default class ColorDemoCommand extends Command {
  static description = 'Demo of the new Heroku CLI color palette using ansis'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  async run(): Promise<void> {
    ux.stdout('\n')
    ux.stdout(colors.label('🎨 Heroku CLI Color Palette Demo\n'))
    ux.stdout(colors.info('This demo showcases all the colors defined in the new Heroku CLI design system.\n\n'))

    // Colors for entities on the Heroku platform
    ux.stdout(colors.label('📱 App-Related Colors:\n'))
    ux.stdout(`  ${colors.app('app')} - Name of an app (${colors.colorPalette.app.hex}, ${colors.colorPalette.app.name}, ${colors.colorPalette.app.style})\n`)
    ux.stdout(`  ${colors.pipeline('pipeline')} - Name of a pipeline (${colors.colorPalette.pipeline.hex}, ${colors.colorPalette.pipeline.name})\n`)
    ux.stdout(`  ${colors.space('space')} - Name of a space (${colors.colorPalette.space.hex}, ${colors.colorPalette.space.name}, ${colors.colorPalette.space.style})\n`)
    ux.stdout(`  ${colors.datastore('datastore')} - Name of a heroku datastore (${colors.colorPalette.datastore.hex}, ${colors.colorPalette.datastore.name}, ${colors.colorPalette.datastore.style})\n`)
    ux.stdout(`  ${colors.addon('addon')} - Name of an addon (${colors.colorPalette.addon.hex}, ${colors.colorPalette.addon.name}, ${colors.colorPalette.addon.style})\n`)
    ux.stdout(`  ${colors.attachment('attachment')} - Name of an attachment (${colors.colorPalette.attachment.hex}, ${colors.colorPalette.attachment.name})\n`)
    ux.stdout(`  ${colors.name('name')} - Name of heroku entity without special color (${colors.colorPalette.name.hex}, ${colors.colorPalette.name.name})\n`)

    ux.stdout('')

    // Status colors
    ux.stdout(colors.label('📊 Status Colors:\n'))
    ux.stdout(`  ${colors.success('success')} - Success messages and states (${colors.colorPalette.success.hex}, ${colors.colorPalette.success.name})\n`)
    ux.stdout(`  ${colors.failure('failure')} - Failure, error messages and states (${colors.colorPalette.failure.hex}, ${colors.colorPalette.failure.name})\n`)
    ux.stdout(`  ${colors.warning('warning')} - Warning messages (${colors.colorPalette.warning.hex}, ${colors.colorPalette.warning.name})\n`)
    ux.stdout(`  ${colors.inactive('inactive')} - Disabled and unknown states (${colors.colorPalette.inactive.hex}, ${colors.colorPalette.inactive.name})\n`)

    ux.stdout('')

    // User/Team colors
    ux.stdout(colors.label('👥 User/Team Colors:\n'))
    ux.stdout(`  ${colors.team('team')} - Heroku team/org (${colors.colorPalette.team.hex}, ${colors.colorPalette.team.name}, ${colors.colorPalette.team.style})\n`)
    ux.stdout(`  ${colors.user('user')} - Heroku user/email (${colors.colorPalette.user.hex}, ${colors.colorPalette.user.name})\n`)

    ux.stdout('')

    // General purpose colors
    ux.stdout(colors.label('🔧 General Purpose Colors:\n'))
    ux.stdout(`  ${colors.label('label')} - Labels, table headers, keys (${colors.colorPalette.label.hex}, ${colors.colorPalette.label.name}, ${colors.colorPalette.label.style})\n`)
    ux.stdout(`  ${colors.info('info')} - Help text, soft alerts (${colors.colorPalette.info.hex}, ${colors.colorPalette.info.name})\n`)
    ux.stdout(`  ${colors.command('heroku command --flag')} - Command examples and code blocks (${colors.colorPalette.command.hex}, ${colors.colorPalette.command.name})\n`)

    ux.stdout('')

    // Example usage scenarios
    ux.stdout(colors.label('💡 Example Usage Scenarios:\n'))

    ux.stdout(colors.info('App deployment status:\n'))
    ux.stdout(`  Deploying ${colors.app('my-awesome-app')} to ${colors.space('production')}...\n`)
    ux.stdout(`  ${colors.success('✓')} Build succeeded\n`)
    ux.stdout(`  ${colors.success('✓')} Release v42 created\n`)
    ux.stdout(`  ${colors.success('✓')} Deploy complete\n\n`)

    ux.stdout(colors.info('Addon management:\n'))
    ux.stdout(`  Adding ${colors.addon('heroku-postgresql:essential-0')} to ${colors.app('my-app')}\n`)
    ux.stdout(`  ${colors.warning('⚠')}  This will add charges to your account\n`)
    ux.stdout(`  ${colors.success('✓')} Addon provisioned\n\n`)

    ux.stdout(colors.info('Pipeline operations:\n'))
    ux.stdout(`  Promoting ${colors.app('staging-app')} from ${colors.pipeline('staging')} to ${colors.pipeline('production')}\n`)
    ux.stdout(`  ${colors.info('ℹ')}  This will deploy to ${colors.space('production')} space\n`)
    ux.stdout(`  ${colors.success('✓')} Promotion complete\n\n`)

    ux.stdout(colors.info('Database operations:\n'))
    ux.stdout(`  Connecting to ${colors.datastore('DATABASE')} on ${colors.app('my-app')}\n`)
    ux.stdout(`  ${colors.success('✓')} Connection established\n`)
    ux.stdout(`  ${colors.info('ℹ')}  Database: ${colors.datastore('postgresql-cylindrical-12345')}\n\n`)

    ux.stdout(colors.info('Error handling:\n'))
    ux.stdout(`  ${colors.failure('✗')} Failed to deploy ${colors.app('my-app')}\n`)
    ux.stdout(`  ${colors.failure('Error:')} Build timeout after 15 minutes\n`)
    ux.stdout(`  ${colors.info('ℹ')}  Try increasing build timeout or optimizing your build process\n\n`)

    ux.stdout(colors.info('Team and user management:\n'))
    ux.stdout(`  Adding ${colors.user('developer@company.com')} to ${colors.team('my-team')}\n`)
    ux.stdout(`  ${colors.success('✓')} User added with collaborator access\n\n`)

    ux.stdout(colors.info('Table headers and labels:\n'))
    ux.stdout(`  ${colors.label('Name')}    ${colors.label('Status')}    ${colors.label('Updated')}\n`)
    ux.stdout(`  ${colors.app('my-app')}     ${colors.success('active')}     2024-01-15\n`)
    ux.stdout(`  ${colors.app('old-app')}    ${colors.inactive('inactive')}   2023-12-01\n\n`)

    ux.stdout(colors.info('Command examples:\n'))
    ux.stdout(`  ${colors.info('To list your apps:')}\n`)
    ux.stdout(`  ${colors.command('heroku apps:list')}\n`)
    ux.stdout(`  ${colors.info('To create a new app:')}\n`)
    ux.stdout(`  ${colors.command('heroku apps:create my-awesome-app')}\n\n`)

    ux.stdout(colors.label('🎯 Color Palette Summary:\n'))
    ux.stdout(colors.info('All colors are designed to be accessible and consistent across the Heroku CLI experience.\n'))
    ux.stdout(colors.info('Bold styling is used for primary entities (apps, spaces, datastores, addons, teams) and labels.\n'))
    ux.stdout(colors.info('Status colors follow semantic conventions: green for success, red for errors, orange for warnings.\n'))
    ux.stdout(colors.info('Purple is used for apps and pipelines, magenta for general names, and yellow for addons and datastores.\n\n'))
  }
}

try {
  await ColorDemoCommand.run(process.argv.slice(2))
} catch (error) {
  console.error('Error:', error)
  throw error
}
