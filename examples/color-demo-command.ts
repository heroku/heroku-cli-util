import {Command, ux} from '@oclif/core'

import {color} from '../src/index.js'

export default class ColorDemoCommand extends Command {
  static description = 'Demo of the new Heroku CLI color palette using ansis'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> app',
    '<%= config.bin %> <%= command.id %> success',
  ]

  async run(): Promise<void> {
    // Get optional color argument from command line
    const colorName = this.argv[0] as string | undefined

    // Map of color names to their display functions
    const colorMap: Record<string, () => void> = {
      addon() {
        ux.stdout(color.label('📱 Addon Color:\n'))
        ux.stdout(`  ${color.addon('addon')} - Name of an addon (${color.colorPalette.addon.value}, ${color.colorPalette.addon.name}, ${color.colorPalette.addon.style})\n`)
        ux.stdout(`\n  Example: ${color.addon('heroku-postgresql:essential-0')}\n`)
      },
      app() {
        ux.stdout(color.label('📱 App Color:\n'))
        ux.stdout(`  ${color.app('app')} - Name of an app (${color.colorPalette.app.value}, ${color.colorPalette.app.name}, ${color.colorPalette.app.style})\n`)
        ux.stdout(`\n  Example: ${color.app('my-awesome-app')}\n`)
      },
      attachment() {
        ux.stdout(color.label('📱 Attachment Color:\n'))
        ux.stdout(`  ${color.attachment('attachment')} - Name of an attachment (${color.colorPalette.attachment.value}, ${color.colorPalette.attachment.name})\n`)
        ux.stdout(`\n  Example: ${color.attachment('HEROKU_POSTGRESQL_AMBER')}\n`)
      },
      command() {
        ux.stdout(color.label('🔧 Command Color:\n'))
        ux.stdout(`  ${color.command('heroku command --flag')} - Command examples and code blocks (${color.colorPalette.command.value}, ${color.colorPalette.command.name})\n`)
        ux.stdout(`\n  Example: ${color.command('heroku apps:list')}\n`)
      },
      datastore() {
        ux.stdout(color.label('📱 Datastore Color:\n'))
        ux.stdout(`  ${color.datastore('datastore')} - Name of a heroku datastore (${color.colorPalette.datastore.value}, ${color.colorPalette.datastore.name}, ${color.colorPalette.datastore.style})\n`)
        ux.stdout(`\n  Example: ${color.datastore('DATABASE')}\n`)
      },
      failure() {
        ux.stdout(color.label('📊 Failure Color:\n'))
        ux.stdout(`  ${color.failure('failure')} - Failure, error messages and states (${color.colorPalette.failure.value}, ${color.colorPalette.failure.name})\n`)
        ux.stdout(`\n  Example: ${color.failure('✗ Failed to deploy')}\n`)
      },
      inactive() {
        ux.stdout(color.label('📊 Inactive Color:\n'))
        ux.stdout(`  ${color.inactive('inactive')} - Disabled and unknown states (${color.colorPalette.inactive.value}, ${color.colorPalette.inactive.name})\n`)
        ux.stdout(`\n  Example: ${color.inactive('inactive')}\n`)
      },
      info() {
        ux.stdout(color.label('🔧 Info Color:\n'))
        ux.stdout(`  ${color.info('info')} - Help text, soft alerts (${color.colorPalette.info.value}, ${color.colorPalette.info.name})\n`)
        ux.stdout(`\n  Example: ${color.info('ℹ This is informational text')}\n`)
      },
      label() {
        ux.stdout(color.label('🔧 Label Color:\n'))
        ux.stdout(`  ${color.label('label')} - Labels, table headers, keys (${color.colorPalette.label.value}, ${color.colorPalette.label.name}, ${color.colorPalette.label.style})\n`)
        ux.stdout(`\n  Example: ${color.label('Name')}    ${color.label('Status')}\n`)
      },
      name() {
        ux.stdout(color.label('📱 Name Color:\n'))
        ux.stdout(`  ${color.name('name')} - Name of heroku entity without special color (${color.colorPalette.name.value}, ${color.colorPalette.name.name})\n`)
        ux.stdout(`\n  Example: ${color.name('my-entity')}\n`)
      },
      pipeline() {
        ux.stdout(color.label('📱 Pipeline Color:\n'))
        ux.stdout(`  ${color.pipeline('pipeline')} - Name of a pipeline (${color.colorPalette.pipeline.value}, ${color.colorPalette.pipeline.name})\n`)
        ux.stdout(`\n  Example: ${color.pipeline('staging')}\n`)
      },
      space() {
        ux.stdout(color.label('📱 Space Color:\n'))
        ux.stdout(`  ${color.space('space')} - Name of a space (${color.colorPalette.space.value}, ${color.colorPalette.space.name}, ${color.colorPalette.space.style})\n`)
        ux.stdout(`\n  Example: ${color.space('production')}\n`)
      },
      success() {
        ux.stdout(color.label('📊 Success Color:\n'))
        ux.stdout(`  ${color.success('success')} - Success messages and states (${color.colorPalette.success.value}, ${color.colorPalette.success.name})\n`)
        ux.stdout(`\n  Example: ${color.success('✓ Deploy complete')}\n`)
      },
      team() {
        ux.stdout(color.label('👥 Team Color:\n'))
        ux.stdout(`  ${color.team('team')} - Heroku team/org (${color.colorPalette.team.value}, ${color.colorPalette.team.name}, ${color.colorPalette.team.style})\n`)
        ux.stdout(`\n  Example: ${color.team('my-team')}\n`)
      },
      user() {
        ux.stdout(color.label('👥 User Color:\n'))
        ux.stdout(`  ${color.user('user')} - Heroku user/email (${color.colorPalette.user.value}, ${color.colorPalette.user.name})\n`)
        ux.stdout(`\n  Example: ${color.user('developer@company.com')}\n`)
      },
      warning() {
        ux.stdout(color.label('📊 Warning Color:\n'))
        ux.stdout(`  ${color.warning('warning')} - Warning messages (${color.colorPalette.warning.value}, ${color.colorPalette.warning.name})\n`)
        ux.stdout(`\n  Example: ${color.warning('⚠ This will add charges')}\n`)
      },
    }

    // If a specific color is requested, show only that color
    if (colorName) {
      const normalizedColorName = colorName.toLowerCase()
      if (colorMap[normalizedColorName]) {
        ux.stdout('\n')
        colorMap[normalizedColorName]()
        ux.stdout('\n')
        return
      }

      ux.error(`Unknown color: ${colorName}`)
      ux.error(`Available colors: ${Object.keys(colorMap).join(', ')}`)
      this.exit(1)
    }

    // Otherwise, show all colors (original behavior)
    ux.stdout('\n')
    ux.stdout(color.label('🎨 Heroku CLI Color Palette Demo\n'))
    ux.stdout(color.info('This demo showcases all the colors defined in the new Heroku CLI design system.\n\n'))

    // Colors for entities on the Heroku platform
    ux.stdout(color.label('📱 App-Related Colors:\n'))
    ux.stdout(`  ${color.app('app')} - Name of an app (${color.colorPalette.app.value}, ${color.colorPalette.app.name}, ${color.colorPalette.app.style})\n`)
    ux.stdout(`  ${color.pipeline('pipeline')} - Name of a pipeline (${color.colorPalette.pipeline.value}, ${color.colorPalette.pipeline.name})\n`)
    ux.stdout(`  ${color.space('space')} - Name of a space (${color.colorPalette.space.value}, ${color.colorPalette.space.name}, ${color.colorPalette.space.style})\n`)
    ux.stdout(`  ${color.datastore('datastore')} - Name of a heroku datastore (${color.colorPalette.datastore.value}, ${color.colorPalette.datastore.name}, ${color.colorPalette.datastore.style})\n`)
    ux.stdout(`  ${color.addon('addon')} - Name of an addon (${color.colorPalette.addon.value}, ${color.colorPalette.addon.name}, ${color.colorPalette.addon.style})\n`)
    ux.stdout(`  ${color.attachment('attachment')} - Name of an attachment (${color.colorPalette.attachment.value}, ${color.colorPalette.attachment.name})\n`)
    ux.stdout(`  ${color.name('name')} - Name of heroku entity without special color (${color.colorPalette.name.value}, ${color.colorPalette.name.name})\n`)

    ux.stdout('')

    // Status colors
    ux.stdout(color.label('📊 Status Colors:\n'))
    ux.stdout(`  ${color.success('success')} - Success messages and states (${color.colorPalette.success.value}, ${color.colorPalette.success.name})\n`)
    ux.stdout(`  ${color.failure('failure')} - Failure, error messages and states (${color.colorPalette.failure.value}, ${color.colorPalette.failure.name})\n`)
    ux.stdout(`  ${color.warning('warning')} - Warning messages (${color.colorPalette.warning.value}, ${color.colorPalette.warning.name})\n`)
    ux.stdout(`  ${color.inactive('inactive')} - Disabled and unknown states (${color.colorPalette.inactive.value}, ${color.colorPalette.inactive.name})\n`)

    ux.stdout('')

    // User/Team colors
    ux.stdout(color.label('👥 User/Team Colors:\n'))
    ux.stdout(`  ${color.team('team')} - Heroku team/org (${color.colorPalette.team.value}, ${color.colorPalette.team.name}, ${color.colorPalette.team.style})\n`)
    ux.stdout(`  ${color.user('user')} - Heroku user/email (${color.colorPalette.user.value}, ${color.colorPalette.user.name})\n`)

    ux.stdout('')

    // General purpose colors
    ux.stdout(color.label('🔧 General Purpose Colors:\n'))
    ux.stdout(`  ${color.label('label')} - Labels, table headers, keys (${color.colorPalette.label.value}, ${color.colorPalette.label.name}, ${color.colorPalette.label.style})\n`)
    ux.stdout(`  ${color.info('info')} - Help text, soft alerts (${color.colorPalette.info.value}, ${color.colorPalette.info.name})\n`)
    ux.stdout(`  ${color.command('heroku command --flag')} - Command examples and code blocks (${color.colorPalette.command.value}, ${color.colorPalette.command.name})\n`)

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

    // ============================================================================
    // MIXING CUSTOM AND ANSIS COLORS
    // ============================================================================
    ux.stdout(color.label('🔀 Mixing Custom and ANSIS colors:\n'))
    ux.stdout(color.info('You can combine custom Heroku colors with ansis functionality for more complex styling.\n\n'))

    ux.stdout('// Using ansis with custom colors\n')
    ux.stdout(`  ${color.bold(color.app('my-app'))}      // Bold custom app color\n`)
    ux.stdout(`  ${color.underline(color.success('Success!'))} // Underlined success\n`)
    ux.stdout(`  ${color.bgBlue(color.team('my-team'))}  // Team name with blue background\n\n`)

    ux.stdout('// Using custom colors with ansis styling\n')
    ux.stdout(`  ${color.label('Deploying')} ${color.app('my-app')} ${color.info('to')} ${color.space('production')} ${color.success('✓')}\n`)
    ux.stdout(`  ${color.failure('Error:')} ${color.bold('Failed to connect to')} ${color.datastore('DATABASE')}\n`)
    ux.stdout(`  ${color.warning('Warning:')} ${color.italic('This will add charges to your account')}\n\n`)

    // ============================================================================
    // ANSIS FUNCTIONALITY - Direct access to ansis features
    // ============================================================================
    ux.stdout(color.label('🌈 ANSIS Functionality:\n'))
    ux.stdout(color.info('The color interface also provides direct access to ansis functionality for additional styling options.\n\n'))

    ux.stdout('// Text styling\n')
    ux.stdout(`  ${color.bold('bold text')}               // Bold\n`)
    ux.stdout(`  ${color.italic('italic text')}           // Italic\n`)
    ux.stdout(`  ${color.underline('underlined text')}    // Underlined\n\n`)

    ux.stdout('// Combined styling\n')
    ux.stdout(`  ${color.bold.red('bold red')}            // Bold + red\n`)
    ux.stdout(`  ${color.underline.blue('underlined blue')} // Underlined + blue\n`)
    ux.stdout(`  ${color.bold.italic.cyan('bold italic cyan')} // Multiple styles\n\n`)

    ux.stdout('// Custom colors\n')
    ux.stdout(`  ${color.hex('#FF6B6B')('custom hex color')}    // Custom hex color\n`)
    ux.stdout(`  ${color.rgb(255, 107, 107)('RGB color')}   // RGB color\n\n`)

    ux.stdout(color.label('🎯 Color Palette Summary:\n'))
    ux.stdout(color.info('The color interface provides two complementary approaches:\n\n'))

    ux.stdout(`  ${color.bold('Custom Heroku colors:')}\n`)
    ux.stdout(`    • Semantic functions (${color.app('app')}, ${color.success('success')}, etc.)\n`)
    ux.stdout('    • Purpose-built for Heroku CLI consistency\n')
    ux.stdout('    • Include icons and specific styling\n')
    ux.stdout(`    • Use design system colors (${color.colorPalette.app.value}, ${color.colorPalette.success.value}, etc.)\n\n`)

    ux.stdout(`  ${color.bold('ANSIS Colors:')}\n`)
    ux.stdout('    • Direct access to all ansis functionality\n')
    ux.stdout(`    • Standard ANSI colors (${color.red('red')}, ${color.blue('blue')}, etc.)\n`)
    ux.stdout(`    • Text styling (${color.bold('bold')}, ${color.italic('italic')}, etc.)\n`)
    ux.stdout(`    • Custom colors (${color.hex('#FF6B6B')('hex')}, ${color.rgb(255, 107, 107)('RGB')})\n`)
    ux.stdout('    • Chainable methods for complex styling\n\n')

    ux.stdout(color.info('All colors are designed to be accessible and consistent across the Heroku CLI experience.\n'))
    ux.stdout(color.info('Bold styling is used for primary entities (apps, spaces, datastores, addons, teams) and labels.\n'))
    ux.stdout(color.info('Status colors follow semantic conventions: green for success, red for errors, orange for warnings.\n'))
    ux.stdout(color.info('Purple is used for apps and pipelines, magenta for general names, and yellow for addons and datastores.\n'))
    ux.stdout(color.info('Both approaches can be used together for maximum flexibility while maintaining Heroku CLI design consistency.\n\n'))
  }
}

try {
  await ColorDemoCommand.run(process.argv.slice(2))
} catch (error) {
  console.error('Error:', error)
  throw error
}
