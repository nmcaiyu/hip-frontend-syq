const ruleState = process.env.NODE_ENV === 'production' ? 'warn' : 'off'

module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': ruleState,
    'no-debugger': ruleState,
    'no-empty': ruleState,
    'no-unused-vars': ruleState,
    'vue/no-unused-components': ruleState,
  }
}
