import herokuEslintConfig from '@heroku-cli/test-utils/eslint-config'
import vitestEslintConfig from '@heroku-cli/test-utils/eslint-config/vitest'
import vitest from '@vitest/eslint-plugin'

export default [
  ...herokuEslintConfig,
  ...vitestEslintConfig,
  {
    ignores: [
      './dist',
      './lib',
      '**/*.js',
      '**/*.mjs',
    ],
  },
  {
    files: [
      '**/*.ts',
    ],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
    rules: {
      'jsdoc/require-returns-check': 'off'
    },
  },
  {
    // @vitest/eslint-plugin (via @heroku-cli/test-utils 1.0.2) newly enables
    // vitest/no-conditional-expect as an error; downgrade to warn to surface the
    // existing conditional expects without failing CI on this dep bump. Must
    // re-register the vitest plugin here (flat config scopes plugins per object).
    files: [
      'test/**/*.ts',
      'test/**/*.js',
    ],
    plugins: {vitest},
    rules: {
      'vitest/no-conditional-expect': 'warn'
    },
  },
]
