const INLINE_ELEMENTS = require('eslint-plugin-vue/lib/utils/inline-non-void-elements.json')

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'no-console': process.env.NODE_ENV === 'production'
      ? ['error', {
          allow: ['error']
        }]
      : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // custom styles
    // 'operator-linebreak': ['error', 'before'],
    // 'vue/html-indent': ['error', 4],
    // 'indent': ['error', 4],
    // 'vue/multiline-html-element-content-newline': ['warn', {
    //     'ignoreWhenEmpty': true,
    //     'ignores': ['p'],
    //     'allowEmptyLines': false
    // }],
    'vue/singleline-html-element-content-newline': ['warn', {
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
      ignores: ['pre', 'textarea', ...INLINE_ELEMENTS, 'td']
    }]
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
