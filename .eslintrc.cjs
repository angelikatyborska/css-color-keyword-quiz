module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended'],
  plugins: ['svelte3'],
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte', '*.ts'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      plugins: ['svelte3', '@typescript-eslint'],
    },
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    },
    {
      files: ['*.spec.js', '*.spec.ts'],
      globals: {
        'test': true,
        'describe': true,
        'expect': true
      }
    }
  ],
  settings: {
    'svelte3/typescript': () => require('typescript')
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  rules: {
    "indent": ["error", 2],
    "semi": [2],
  }
};
