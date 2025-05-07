module.exports = {
  env: {
    node: true,
  },
  extends: ['./src/test-helpers/eslint-config.js'],
  overrides: [
    {
      files: ['./src/test-helpers/**/*.ts', 'test-helpers/**/*.js'],
      rules: {
        'mocha/no-exports': 'off',
        'prefer-arrow-callback': 'off',
      },
    },
  ],
}
