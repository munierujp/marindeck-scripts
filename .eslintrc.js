module.exports = {
  extends: [
    '@munierujp/eslint-config-typescript'
  ],
  plugins: [
    'tsdoc'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  env: {
    browser: true
  },
  rules: {
    'tsdoc/syntax': 'warn'
  }
}
