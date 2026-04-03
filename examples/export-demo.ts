#!/usr/bin/env node
import {color} from '../dist/index.js'

console.log('\n=== Export Demo ===\n')

console.log('1. Custom Heroku colors (use custom TTY logic):')
console.log('   color.app("my-app")         →', color.app('my-app'))
console.log('   color.success("Success!")   →', color.success('Success!'))
console.log('')

console.log('2. Via color.ansis (use custom TTY logic):')
console.log('   color.ansis.bold("bold")    →', color.ansis.bold('bold'))
console.log('   color.ansis.red("red")      →', color.ansis.red('red'))
console.log('')

console.log('TTY Status:')
console.log('   process.stdout.isTTY        =', process.stdout.isTTY)
console.log('   process.env.FORCE_COLOR     =', process.env.FORCE_COLOR || 'undefined')
console.log('')

console.log('Ansis level:')
console.log('   color.ansis.level (custom)  =', color.ansis.level)
console.log('')

console.log('KEY INSIGHT:')
console.log('  - color.ansis.bold() ← Uses CUSTOM ansis (your shouldEnableColors logic)')
console.log('  - color.app()        ← Uses CUSTOM ansis (your shouldEnableColors logic)')
console.log('')
console.log('Both respect the custom TTY detection in shouldEnableColors()!')
