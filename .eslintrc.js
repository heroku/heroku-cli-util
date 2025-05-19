module.exports = {
  env: {
    node: true,
  },
  extends: ['./node_modules/@heroku-cli/test-utils/dist/eslint-config.js'],
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
