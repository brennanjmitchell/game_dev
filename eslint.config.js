import eslintPluginReact from 'eslint-plugin-react';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        es2021: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      react: eslintPluginReact,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        es2021: true,
      },
    },
    plugins: {
      react: eslintPluginReact,
    },
    rules: {
      'react/prop-types': 'off',
    },
  },
];

export default config;