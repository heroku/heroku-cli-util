import {Command} from '@oclif/core'
import {ux} from '@oclif/core'

import * as colors from '../src/ux/colors.js'

export default class InterfaceDemoCommand extends Command {
  static description = 'Demo of the color interface showing both custom Heroku colors and ansis functionality'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  async run(): Promise<void> {
    ux.stdout('\n')
    ux.stdout(colors.label('🎨 Heroku CLI Color Interface Demo\n'))
    ux.stdout(colors.info('This demo shows how users interact with both custom Heroku colors and ansis functionality.\n\n'))

    // ============================================================================
    // CUSTOM HEROKU COLORS - Semantic, purpose-built functions
    // ============================================================================
    ux.stdout(colors.label('🏗️  Custom Heroku Colors (Semantic Functions):\n'))
    ux.stdout(colors.info('These are purpose-built functions that apply specific colors and styling for Heroku entities.\n\n'))

    ux.stdout('// App-related entities\n')
    ux.stdout(`  ${colors.app('my-awesome-app')}           // Purple, bold with diamond icon\n`)
    ux.stdout(`  ${colors.pipeline('staging-pipeline')}    // Purple, normal weight\n`)
    ux.stdout(`  ${colors.space('production')}             // Blue, bold with diamond icon\n`)
    ux.stdout(`  ${colors.datastore('DATABASE')}           // Yellow, bold with diamond icon\n`)
    ux.stdout(`  ${colors.addon('heroku-postgresql')}      // Yellow, bold\n`)
    ux.stdout(`  ${colors.attachment('DATABASE_URL')}      // Yellow, normal weight\n`)
    ux.stdout(`  ${colors.name('my-entity')}               // Magenta, normal weight\n\n`)

    ux.stdout('// Status indicators\n')
    ux.stdout(`  ${colors.success('✓ Success!')}           // Green\n`)
    ux.stdout(`  ${colors.failure('✗ Failed!')}            // Red\n`)
    ux.stdout(`  ${colors.warning('⚠ Warning!')}           // Orange\n`)
    ux.stdout(`  ${colors.inactive('inactive')}            // Gray\n\n`)

    ux.stdout('// User/Team entities\n')
    ux.stdout(`  ${colors.team('my-team')}                 // Cyan, bold\n`)
    ux.stdout(`  ${colors.user('user@example.com')}        // Cyan, normal weight\n\n`)

    ux.stdout('// General purpose\n')
    ux.stdout(`  ${colors.label('Label:')}                 // Bold (no color)\n`)
    ux.stdout(`  ${colors.info('Info text')}               // Teal\n`)
    ux.stdout(`  ${colors.command('heroku apps:list')}     // White on dark gray background\n\n`)

    // ============================================================================
    // ANSIS COLORS - Direct access to all ansis functionality
    // ============================================================================
    ux.stdout(colors.label('🌈 ANSIS Colors (Direct Access):\n'))
    ux.stdout(colors.info('These are direct exports from the ansis library, giving you access to all standard ANSI colors and styling.\n\n'))

    ux.stdout('// Basic colors\n')
    ux.stdout(`  ${colors.red('red text')}                 // Standard red\n`)
    ux.stdout(`  ${colors.green('green text')}             // Standard green\n`)
    ux.stdout(`  ${colors.blue('blue text')}               // Standard blue\n`)
    ux.stdout(`  ${colors.yellow('yellow text')}           // Standard yellow\n`)
    ux.stdout(`  ${colors.magenta('magenta text')}         // Standard magenta\n`)
    ux.stdout(`  ${colors.cyan('cyan text')}               // Standard cyan\n`)
    ux.stdout(`  ${colors.white('white text')}             // Standard white\n`)
    ux.stdout(`  ${colors.gray('gray text')}               // Standard gray\n\n`)

    ux.stdout('// Bright colors\n')
    ux.stdout(`  ${colors.redBright('bright red')}         // Bright red\n`)
    ux.stdout(`  ${colors.greenBright('bright green')}     // Bright green\n`)
    ux.stdout(`  ${colors.blueBright('bright blue')}       // Bright blue\n`)
    ux.stdout(`  ${colors.yellowBright('bright yellow')}   // Bright yellow\n`)
    ux.stdout(`  ${colors.magentaBright('bright magenta')} // Bright magenta\n`)
    ux.stdout(`  ${colors.cyanBright('bright cyan')}       // Bright cyan\n`)
    ux.stdout(`  ${colors.whiteBright('bright white')}     // Bright white\n\n`)

    ux.stdout('// Background colors\n')
    ux.stdout(`  ${colors.bgRed('red background')}         // Red background\n`)
    ux.stdout(`  ${colors.bgGreen('green background')}     // Green background\n`)
    ux.stdout(`  ${colors.bgBlue('blue background')}       // Blue background\n`)
    ux.stdout(`  ${colors.bgYellow('yellow background')}   // Yellow background\n`)
    ux.stdout(`  ${colors.bgMagenta('magenta background')} // Magenta background\n`)
    ux.stdout(`  ${colors.bgCyan('cyan background')}       // Cyan background\n`)
    ux.stdout(`  ${colors.bgWhite('white background')}     // White background\n\n`)

    ux.stdout('// Text styling\n')
    ux.stdout(`  ${colors.bold('bold text')}               // Bold\n`)
    ux.stdout(`  ${colors.dim('dim text')}                 // Dim/faint\n`)
    ux.stdout(`  ${colors.italic('italic text')}           // Italic\n`)
    ux.stdout(`  ${colors.underline('underlined text')}    // Underlined\n`)
    ux.stdout(`  ${colors.strikethrough('strikethrough')}  // Strikethrough\n`)
    ux.stdout(`  ${colors.inverse('inverse text')}         // Inverse (swap fg/bg)\n\n`)

    ux.stdout('// Combined styling\n')
    ux.stdout(`  ${colors.bold.red('bold red')}            // Bold + red\n`)
    ux.stdout(`  ${colors.underline.blue('underlined blue')} // Underlined + blue\n`)
    ux.stdout(`  ${colors.bgYellow.black('yellow bg black text')} // Background + foreground\n`)
    ux.stdout(`  ${colors.bold.italic.cyan('bold italic cyan')} // Multiple styles\n\n`)

    ux.stdout('// Custom colors (hex values)\n')
    ux.stdout(`  ${colors.hex('#FF6B6B')('custom red')}    // Custom hex color\n`)
    ux.stdout(`  ${colors.hex('#4ECDC4')('custom teal')}   // Custom hex color\n`)
    ux.stdout(`  ${colors.hex('#45B7D1')('custom blue')}   // Custom hex color\n`)
    ux.stdout(`  ${colors.hex('#96CEB4')('custom green')}  // Custom hex color\n`)
    ux.stdout(`  ${colors.hex('#FFEAA7')('custom yellow')} // Custom hex color\n\n`)

    ux.stdout('// RGB colors\n')
    ux.stdout(`  ${colors.rgb(255, 107, 107)('RGB red')}   // RGB color\n`)
    ux.stdout(`  ${colors.rgb(78, 205, 196)('RGB teal')}   // RGB color\n`)
    ux.stdout(`  ${colors.rgb(69, 183, 209)('RGB blue')}   // RGB color\n\n`)

    // ============================================================================
    // MIXING CUSTOM AND ANSIS COLORS
    // ============================================================================
    ux.stdout(colors.label('🔀 Mixing Custom and ANSIS Colors:\n'))
    ux.stdout(colors.info('You can combine custom Heroku colors with ansis functionality for more complex styling.\n\n'))

    ux.stdout('// Using ansis with custom colors\n')
    ux.stdout(`  ${colors.bold(colors.app('my-app'))}      // Bold custom app color\n`)
    ux.stdout(`  ${colors.underline(colors.success('Success!'))} // Underlined success\n`)
    ux.stdout(`  ${colors.bgBlue(colors.team('my-team'))}  // Team name with blue background\n\n`)

    ux.stdout('// Using custom colors in complex layouts\n')
    ux.stdout(`  ${colors.label('Deploying')} ${colors.app('my-app')} ${colors.info('to')} ${colors.space('production')} ${colors.success('✓')}\n`)
    ux.stdout(`  ${colors.failure('Error:')} ${colors.bold('Failed to connect to')} ${colors.datastore('DATABASE')}\n`)
    ux.stdout(`  ${colors.warning('Warning:')} ${colors.italic('This will add charges to your account')}\n\n`)

    // ============================================================================
    // PRACTICAL USAGE EXAMPLES
    // ============================================================================
    ux.stdout(colors.label('💡 Practical Usage Examples:\n'))

    ux.stdout(colors.info('1. Command output with mixed styling:\n'))
    ux.stdout(`  ${colors.label('App:')} ${colors.app('my-awesome-app')} ${colors.info('|')} ${colors.label('Status:')} ${colors.success('active')}\n`)
    ux.stdout(`  ${colors.label('Pipeline:')} ${colors.pipeline('staging')} ${colors.info('|')} ${colors.label('Space:')} ${colors.space('production')}\n\n`)

    ux.stdout(colors.info('2. Error handling with context:\n'))
    ux.stdout(`  ${colors.failure('✗')} ${colors.bold('Deployment failed for')} ${colors.app('my-app')}\n`)
    ux.stdout(`  ${colors.info('ℹ')}  ${colors.italic('Reason:')} ${colors.red('Build timeout after 15 minutes')}\n`)
    ux.stdout(`  ${colors.info('ℹ')}  ${colors.italic('Suggestion:')} ${colors.yellow('Try optimizing your build process')}\n\n`)

    ux.stdout(colors.info('3. Table-like output:\n'))
    ux.stdout(`  ${colors.label('Name')}           ${colors.label('Type')}      ${colors.label('Status')}\n`)
    ux.stdout(`  ${colors.app('my-app')}           ${colors.addon('postgresql')} ${colors.success('active')}\n`)
    ux.stdout(`  ${colors.app('old-app')}          ${colors.addon('redis')}     ${colors.inactive('inactive')}\n\n`)

    ux.stdout(colors.info('4. Interactive prompts:\n'))
    ux.stdout(`  ${colors.label('?')} Which ${colors.addon('addon')} would you like to add to ${colors.app('my-app')}?\n`)
    ux.stdout(`  ${colors.info('>')} ${colors.underline('heroku-postgresql:essential-0')}\n\n`)

    // ============================================================================
    // INTERFACE SUMMARY
    // ============================================================================
    ux.stdout(colors.label('📋 Interface Summary:\n'))
    ux.stdout(colors.info('The color interface provides two complementary approaches:\n\n'))

    ux.stdout(`  ${colors.bold('Custom Heroku Colors:')}\n`)
    ux.stdout(`    • Semantic functions (${colors.app('app')}, ${colors.success('success')}, etc.)\n`)
    ux.stdout('    • Purpose-built for Heroku CLI consistency\n')
    ux.stdout('    • Include icons and specific styling\n')
    ux.stdout(`    • Use design system colors (${colors.colorPalette.app.hex}, ${colors.colorPalette.success.hex}, etc.)\n\n`)

    ux.stdout(`  ${colors.bold('ANSIS Colors:')}\n`)
    ux.stdout('    • Direct access to all ansis functionality\n')
    ux.stdout(`    • Standard ANSI colors (${colors.red('red')}, ${colors.blue('blue')}, etc.)\n`)
    ux.stdout(`    • Text styling (${colors.bold('bold')}, ${colors.italic('italic')}, etc.)\n`)
    ux.stdout(`    • Custom colors (${colors.hex('#FF6B6B')('hex')}, ${colors.rgb(255, 107, 107)('RGB')})\n`)
    ux.stdout('    • Chainable methods for complex styling\n\n')

    ux.stdout(colors.info('Both approaches can be used together for maximum flexibility while maintaining Heroku CLI design consistency.\n'))
  }
}

try {
  await InterfaceDemoCommand.run(process.argv.slice(2))
} catch (error) {
  console.error('Error:', error)
  throw error
}
