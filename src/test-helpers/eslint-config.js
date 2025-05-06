module.exports = {
  extends: [
    'oclif',
    'oclif-typescript',
    'plugin:mocha/recommended',
  ],
  overrides: [
    {
      files: ['test/**/*.ts', 'test/**/*.js'],
      rules: {
        'prefer-arrow-callback': 'off',
      },
    },
  ],
  plugins: ['import', 'mocha'],
  rules: {
    camelcase: 'warn',
    'import/namespace': 'warn',
    indent: ['error', 2, {MemberExpression: 1}],
    'no-console': 'off',
    'unicorn/prefer-string-replace-all': 'warn',
  },
}
