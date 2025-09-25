module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 4],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': ['warn', { 'varsIgnorePattern': '^(generate|draw|setup|clear).*' }],
    'no-console': 'off',
    'no-undef': 'error'
  },
  globals: {
    'generateAndDownload': 'readonly',
    'generateCalculatorIcon': 'readonly',
    'generateMouseIcon': 'readonly',
    'generateKeyboardIcon': 'readonly',
    'generateMonitorIcon': 'readonly',
    'drawRoundedRect': 'readonly',
    'setupHighQualityRendering': 'readonly',
    'clearCanvas': 'readonly'
  }
};
