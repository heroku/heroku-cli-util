module.exports = {
  extends: ['oclif', 'oclif-typescript'],
  overrides: [
    {
      files: ['test/**/*.ts', 'test/**/*.js'],
      rules: {
        'prefer-arrow-callback': 'off',
      },
    },
  ],
  rules: {
    camelcase: 'warn',
    'import/namespace': 'warn',
    indent: ['error', 2, {MemberExpression: 1}],
    'no-console': 'off',
    'unicorn/prefer-string-replace-all': 'warn',
  },
}
