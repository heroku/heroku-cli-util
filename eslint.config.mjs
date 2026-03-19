import herokuEslintConfig from '@heroku-cli/test-utils/eslint-config'

export default [
  ...herokuEslintConfig,
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
    },
  },
]
