import oclif from 'eslint-config-oclif'

export default [
  ...oclif,
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
      '@stylistic/function-paren-newline': 'warn',
      '@stylistic/indent': 'warn',
      '@stylistic/indent-binary-ops': 'warn',
      '@stylistic/lines-between-class-members': 'warn',
      '@stylistic/multiline-ternary': 'warn',
      '@stylistic/object-curly-spacing': 'warn',
      '@stylistic/operator-linebreak': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      camelcase: 'warn',
      'import/namespace': 'warn',
      'mocha/no-mocha-arrows': 'warn',
      'n/shebang': 'warn',
      'no-undef': 'warn',
      'node/no-missing-import': 'off',
      'perfectionist/sort-imports': 'warn',
      'perfectionist/sort-intersection-types': 'warn',
      'perfectionist/sort-named-imports': 'warn',
      'perfectionist/sort-objects': 'warn',
      'perfectionist/sort-union-types': 'warn',
      'prefer-arrow-callback': 'warn',
      'unicorn/no-anonymous-default-export': 'warn',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-useless-undefined': 'warn',
      'unicorn/prefer-node-protocol': 'warn',
      'unicorn/prefer-number-properties': 'warn',
      'unicorn/prefer-structured-clone': 'warn',
    },
  },
]
