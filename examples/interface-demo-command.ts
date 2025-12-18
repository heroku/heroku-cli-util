import {Command} from '@oclif/core'
import {ux} from '@oclif/core'

import * as color from '../src/ux/colors.js'

export default class InterfaceDemoCommand extends Command {
  static description = 'Demo of the color interface showing both custom Heroku colors and ansis functionality'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  async run(): Promise<void> {
    ux.stdout('\n')
    ux.stdout(color.label('🎨 Heroku CLI Color Interface Demo\n'))
    ux.stdout(color.info('This demo shows how users interact with both custom Heroku colors and ansis functionality.\n\n'))

    // ============================================================================
    // CUSTOM HEROKU COLORS - Semantic, purpose-built functions
    // ============================================================================
    ux.stdout(color.label('🏗️  Custom Heroku Colors (Semantic Functions):\n'))
    ux.stdout(color.info('These are purpose-built functions that apply specific colors and styling for Heroku entities.\n\n'))

    ux.stdout('// App-related entities\n')
    ux.stdout(`  ${color.app('my-awesome-app')}                // Purple, bold with diamond icon\n`)
    ux.stdout(`  ${color.pipeline('awesome-app-pipeline')}         // Purple, normal weight\n`)
    ux.stdout(`  ${color.space('production')}                  // Blue, bold with diamond icon\n`)
    ux.stdout(`  ${color.datastore('postgresql-curly-12345')}  // Yellow, bold with diamond icon\n`)
    ux.stdout(`  ${color.addon('my-papertrail-addon')}         // Yellow, bold\n`)
    ux.stdout(`  ${color.attachment('DATABASE_URL')}           // Yellow, normal weight\n`)
    ux.stdout(`  ${color.name('my-entity')}                    // Magenta, normal weight\n\n`)

    ux.stdout('// Status indicators\n')
    ux.stdout(`  ${color.success('✓ Success!')}           // Green\n`)
    ux.stdout(`  ${color.failure('✗ Failed!')}            // Red\n`)
    ux.stdout(`  ${color.warning('⚠ Warning!')}           // Orange\n`)
    ux.stdout(`  ${color.inactive('inactive')}            // Gray\n\n`)

    ux.stdout('// User/Team entities\n')
    ux.stdout(`  ${color.team('my-team')}                 // Cyan, bold\n`)
    ux.stdout(`  ${color.user('user@example.com')}        // Cyan, normal weight\n\n`)

    ux.stdout('// General purpose\n')
    ux.stdout(`  ${color.label('Label:')}                 // Bold (no color)\n`)
    ux.stdout(`  ${color.info('Info text')}               // Teal\n`)
    ux.stdout(`  ${color.command('heroku apps:list')}     // White on dark gray background\n\n`)

    // ============================================================================
    // ANSIS COLORS - Direct access to all ansis functionality
    // ============================================================================
    ux.stdout(color.label('🌈 ANSIS colors (Direct Access):\n'))
    ux.stdout(color.info('These are direct exports from the ansis library, giving you access to all standard ANSI colors and styling.\n\n'))

    ux.stdout('// Basic colors\n')
    ux.stdout(`  ${color.red('red text')}                 // Standard red\n`)
    ux.stdout(`  ${color.green('green text')}             // Standard green\n`)
    ux.stdout(`  ${color.blue('blue text')}               // Standard blue\n`)
    ux.stdout(`  ${color.yellow('yellow text')}           // Standard yellow\n`)
    ux.stdout(`  ${color.magenta('magenta text')}         // Standard magenta\n`)
    ux.stdout(`  ${color.cyan('cyan text')}               // Standard cyan\n`)
    ux.stdout(`  ${color.white('white text')}             // Standard white\n`)
    ux.stdout(`  ${color.gray('gray text')}               // Standard gray\n\n`)

    ux.stdout('// Bright colors\n')
    ux.stdout(`  ${color.redBright('bright red')}         // Bright red\n`)
    ux.stdout(`  ${color.greenBright('bright green')}     // Bright green\n`)
    ux.stdout(`  ${color.blueBright('bright blue')}       // Bright blue\n`)
    ux.stdout(`  ${color.yellowBright('bright yellow')}   // Bright yellow\n`)
    ux.stdout(`  ${color.magentaBright('bright magenta')} // Bright magenta\n`)
    ux.stdout(`  ${color.cyanBright('bright cyan')}       // Bright cyan\n`)
    ux.stdout(`  ${color.whiteBright('bright white')}     // Bright white\n\n`)

    ux.stdout('// Background colors\n')
    ux.stdout(`  ${color.bgRed('red background')}         // Red background\n`)
    ux.stdout(`  ${color.bgGreen('green background')}     // Green background\n`)
    ux.stdout(`  ${color.bgBlue('blue background')}       // Blue background\n`)
    ux.stdout(`  ${color.bgYellow('yellow background')}   // Yellow background\n`)
    ux.stdout(`  ${color.bgMagenta('magenta background')} // Magenta background\n`)
    ux.stdout(`  ${color.bgCyan('cyan background')}       // Cyan background\n`)
    ux.stdout(`  ${color.bgWhite('white background')}     // White background\n\n`)

    ux.stdout('// Text styling\n')
    ux.stdout(`  ${color.bold('bold text')}               // Bold\n`)
    ux.stdout(`  ${color.dim('dim text')}                 // Dim/faint\n`)
    ux.stdout(`  ${color.italic('italic text')}           // Italic\n`)
    ux.stdout(`  ${color.underline('underlined text')}    // Underlined\n`)
    ux.stdout(`  ${color.strikethrough('strikethrough')}  // Strikethrough\n`)
    ux.stdout(`  ${color.inverse('inverse text')}         // Inverse (swap fg/bg)\n\n`)

    ux.stdout('// Combined styling\n')
    ux.stdout(`  ${color.bold.red('bold red')}            // Bold + red\n`)
    ux.stdout(`  ${color.underline.blue('underlined blue')} // Underlined + blue\n`)
    ux.stdout(`  ${color.bgYellow.black('yellow bg black text')} // Background + foreground\n`)
    ux.stdout(`  ${color.bold.italic.cyan('bold italic cyan')} // Multiple styles\n\n`)

    ux.stdout('// Custom colors (hex values)\n')
    ux.stdout(`  ${color.hex('#FF6B6B')('custom red')}    // Custom hex color\n`)
    ux.stdout(`  ${color.hex('#4ECDC4')('custom teal')}   // Custom hex color\n`)
    ux.stdout(`  ${color.hex('#45B7D1')('custom blue')}   // Custom hex color\n`)
    ux.stdout(`  ${color.hex('#96CEB4')('custom green')}  // Custom hex color\n`)
    ux.stdout(`  ${color.hex('#FFEAA7')('custom yellow')} // Custom hex color\n\n`)

    ux.stdout('// RGB colors\n')
    ux.stdout(`  ${color.rgb(255, 107, 107)('RGB red')}   // RGB color\n`)
    ux.stdout(`  ${color.rgb(78, 205, 196)('RGB teal')}   // RGB color\n`)
    ux.stdout(`  ${color.rgb(69, 183, 209)('RGB blue')}   // RGB color\n\n`)

    // ============================================================================
    // MIXING CUSTOM AND ANSIS COLORS
    // ============================================================================
    ux.stdout(color.label('🔀 Mixing Custom and ANSIS colors:\n'))
    ux.stdout(color.info('You can combine custom Heroku colors with ansis functionality for more complex styling.\n\n'))

    ux.stdout('// Using ansis with custom colors\n')
    ux.stdout(`  ${color.bold(color.app('my-app'))}      // Bold custom app color\n`)
    ux.stdout(`  ${color.underline(color.success('Success!'))} // Underlined success\n`)
    ux.stdout(`  ${color.bgBlue(color.team('my-team'))}  // Team name with blue background\n\n`)

    ux.stdout('// Using custom colors in complex layouts\n')
    ux.stdout(`  ${color.label('Deploying')} ${color.app('my-app')} ${color.info('to')} ${color.space('production')} ${color.success('✓')}\n`)
    ux.stdout(`  ${color.failure('Error:')} ${color.bold('Failed to connect to')} ${color.datastore('DATABASE')}\n`)
    ux.stdout(`  ${color.warning('Warning:')} ${color.italic('This will add charges to your account')}\n\n`)

    // ============================================================================
    // PRACTICAL USAGE EXAMPLES
    // ============================================================================
    ux.stdout(color.label('💡 Practical Usage Examples:\n'))

    ux.stdout(color.info('1. Command output with mixed styling:\n'))
    ux.stdout(`  ${color.label('App:')} ${color.app('my-awesome-app')} ${color.info('|')} ${color.label('Status:')} ${color.success('active')}\n`)
    ux.stdout(`  ${color.label('Pipeline:')} ${color.pipeline('staging')} ${color.info('|')} ${color.label('Space:')} ${color.space('production')}\n\n`)

    ux.stdout(color.info('2. Error handling with context:\n'))
    ux.stdout(`  ${color.failure('✗')} ${color.bold('Deployment failed for')} ${color.app('my-app')}\n`)
    ux.stdout(`  ${color.info('ℹ')}  ${color.italic('Reason:')} ${color.red('Build timeout after 15 minutes')}\n`)
    ux.stdout(`  ${color.info('ℹ')}  ${color.italic('Suggestion:')} ${color.yellow('Try optimizing your build process')}\n\n`)

    ux.stdout(color.info('3. Table-like output:\n'))
    ux.stdout(`  ${color.label('Name')}           ${color.label('Type')}      ${color.label('Status')}\n`)
    ux.stdout(`  ${color.app('my-app')}           ${color.addon('postgresql')} ${color.success('active')}\n`)
    ux.stdout(`  ${color.app('old-app')}          ${color.addon('redis')}     ${color.inactive('inactive')}\n\n`)

    ux.stdout(color.info('4. Interactive prompts:\n'))
    ux.stdout(`  ${color.label('?')} Which ${color.addon('addon')} would you like to add to ${color.app('my-app')}?\n`)
    ux.stdout(`  ${color.info('>')} ${color.underline('heroku-postgresql:essential-0')}\n\n`)

    // ============================================================================
    // INTERFACE SUMMARY
    // ============================================================================
    ux.stdout(color.label('📋 Interface Summary:\n'))
    ux.stdout(color.info('The color interface provides two complementary approaches:\n\n'))

    ux.stdout(`  ${color.bold('Custom Heroku colors:')}\n`)
    ux.stdout(`    • Semantic functions (${color.app('app')}, ${color.success('success')}, etc.)\n`)
    ux.stdout('    • Purpose-built for Heroku CLI consistency\n')
    ux.stdout('    • Include icons and specific styling\n')
    ux.stdout(`    • Use design system colors (${color.colorPalette.app.hex}, ${color.colorPalette.success.hex}, etc.)\n\n`)

    ux.stdout(`  ${color.bold('ANSIS Colors:')}\n`)
    ux.stdout('    • Direct access to all ansis functionality\n')
    ux.stdout(`    • Standard ANSI color (${color.red('red')}, ${color.blue('blue')}, etc.)\n`)
    ux.stdout(`    • Text styling (${color.bold('bold')}, ${color.italic('italic')}, etc.)\n`)
    ux.stdout(`    • Custom colors (${color.hex('#FF6B6B')('hex')}, ${color.rgb(255, 107, 107)('RGB')})\n`)
    ux.stdout('    • Chainable methods for complex styling\n\n')

    ux.stdout(color.info('Both approaches can be used together for maximum flexibility while maintaining Heroku CLI design consistency.\n'))
  }
}

try {
  await InterfaceDemoCommand.run(process.argv.slice(2))
} catch (error) {
  console.error('Error:', error)
  throw error
}
