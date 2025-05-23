// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier/flat';

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    rules: {
      // Add or override rules here
      'no-console': 'off',
      'no-unused-vars': 'warn',
      "camelcase": "off",
      "prettier/prettier": "error",
      "newline-before-return": "error",
      "no-constant-binary-expression": "error",
      "sort-imports": [
        "error",
        {
          "ignoreCase": true,
          "ignoreMemberSort": false,
          "ignoreDeclarationSort": true
        }
      ],
    },
  },
  prettierConfig,
];