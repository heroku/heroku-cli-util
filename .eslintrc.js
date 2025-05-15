module.exports = {
  extends: ['oclif', 'oclif-typescript'],
  overrides: [
    {
      files: ['test/**/*.ts', 'test/**/*.js'],
      rules: {
        'prefer-arrow-callback': 'off',
      },
    },
    {
      files: ['examples/**/*.ts', 'examples/**/*.js'],
      rules: {
        'unicorn/prefer-module': 'off',
        'unicorn/prefer-top-level-await': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    camelcase: 'warn',
    'import/namespace': 'warn',
    indent: ['error', 2, {MemberExpression: 1}],
    'no-console': 'off',
    'unicorn/prefer-string-replace-all': 'warn',
  },
}
