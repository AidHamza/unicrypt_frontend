module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'object-curly-spacing': "off",
    'quotes': "off",
    'comma-dangle': "off",
    'eol-last': "off",
    'no-trailing-spaces': "off",
    'key-spacing': "off",
    'comma-spacing': "off",
    'quote-props': "off",
    'camelcase': "off",
    'semi': "off",
    'func-call-spacing': "off",
    'no-tabs': "off",
    // 'no-unused-vars': "off",
    // 'no-unexpected-multiline': "off",
  }
}
