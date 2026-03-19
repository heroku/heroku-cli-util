#!/usr/bin/env node

/**
 * Test that the new package exports work correctly
 */

console.log('Testing @heroku/heroku-cli-util exports...\n')

let passed = 0
let failed = 0

// Test 1: Import from main entry point
console.log('1. Testing main entry point import...')
try {
  const mainImport = await import('./dist/index.js')
  console.log('   ✓ Main import works')
  console.log('   - Has hux:', !!mainImport.hux)
  console.log('   - Has utils:', !!mainImport.utils)
  console.log('   - Has color:', !!mainImport.color)
  passed++
} catch (error) {
  console.log('   ✗ Main import failed:', error.message)
  failed++
}

// Test 2: Import color directly
console.log('\n2. Testing direct color import...')
try {
  const colorImport = await import('./dist/ux/colors.js')
  console.log('   ✓ Direct color import works')
  console.log('   - Has app():', typeof colorImport.app === 'function')
  console.log('   - Has success():', typeof colorImport.success === 'function')
  console.log('   - Test color.app():', colorImport.app('test-app'))
  passed++
} catch (error) {
  console.log('   ✗ Direct color import failed:', error.message)
  failed++
}

// Test 3: Import hux module
console.log('\n3. Testing hux module import...')
try {
  const huxImport = await import('./dist/ux/index.js')
  console.log('   ✓ hux module import works')
  console.log('   - Has confirm():', typeof huxImport.confirm === 'function')
  console.log('   - Has table():', typeof huxImport.table === 'function')
  console.log('   - Has color:', !!huxImport.color)
  passed++
} catch (error) {
  console.log('   ✗ hux module import failed:', error.message)
  failed++
}

// Test 4: Import utils module
console.log('\n4. Testing utils module import...')
try {
  const utilsImport = await import('./dist/utils/index.js')
  console.log('   ✓ utils module import works')
  console.log('   - Has AddonResolver:', typeof utilsImport.AddonResolver === 'function')
  console.log('   - Has DatabaseResolver:', typeof utilsImport.DatabaseResolver === 'function')
  console.log('   - Has getAddonService():', typeof utilsImport.getAddonService === 'function')
  passed++
} catch (error) {
  console.log('   ✗ utils module import failed:', error.message)
  failed++
}

// Test 5: Import utils/pg module
console.log('\n5. Testing utils/pg module import...')
try {
  const pgImport = await import('./dist/utils/pg/index.js')
  console.log('   ✓ utils/pg module import works')
  console.log('   - Has DatabaseResolver:', typeof pgImport.DatabaseResolver === 'function')
  console.log('   - Has PsqlService:', typeof pgImport.PsqlService === 'function')
  console.log('   - Has getPsqlConfigs():', typeof pgImport.getPsqlConfigs === 'function')
  passed++
} catch (error) {
  console.log('   ✗ utils/pg module import failed:', error.message)
  failed++
}

// Test 6: Import utils/addons module
console.log('\n6. Testing utils/addons module import...')
try {
  const addonsImport = await import('./dist/utils/addons/index.js')
  console.log('   ✓ utils/addons module import works')
  console.log('   - Has AddonResolver:', typeof addonsImport.AddonResolver === 'function')
  console.log('   - Has isPostgresAddon():', typeof addonsImport.isPostgresAddon === 'function')
  passed++
} catch (error) {
  console.log('   ✗ utils/addons module import failed:', error.message)
  failed++
}

console.log(`\n${failed === 0 ? '✅' : '❌'} Tests: ${passed} passed, ${failed} failed`)

if (failed === 0) {
  console.log('\nNext steps:')
  console.log('  1. npm link (in heroku-cli-util)')
  console.log('  2. npm link @heroku/heroku-cli-util (in consuming project)')
  console.log('  3. Update imports to use granular paths:')
  console.log('     - import * as color from "@heroku/heroku-cli-util/color"')
  console.log('     - import {confirm, table} from "@heroku/heroku-cli-util/hux"')
  console.log('     - import {DatabaseResolver} from "@heroku/heroku-cli-util/utils/pg"')
  console.log('     - import {AddonResolver} from "@heroku/heroku-cli-util/utils/addons"')
}

process.exit(failed > 0 ? 1 : 0)
