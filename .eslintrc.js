module.exports = {
  env: {
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended', 
    'plugin:@typescript-eslint/recommended', 
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: "all",
        bracketSpacing: true,
        bracketSameLine: false,
        tabWidth: 2,
        endOfLine:"auto"
      },
    ],
  },
}