module.exports = {
  extends: [
    '@munierujp/eslint-config-typescript'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  env: {
    browser: true
  }
}
