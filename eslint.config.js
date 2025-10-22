import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist',
      'build',
      'node_modules',
      '.vitepress/cache',
      '.vitepress/dist',
      'coverage',
      '*.config.js',
      '*.config.ts',
      '.vscode',
      '.github',
      '*.backup',
      '.scrapers',
      '.venv',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // ESLint recommended overrides - increased strictness
      'no-console': ['error', { allow: ['warn', 'error'] }], // Only allow warn/error, not info/debug
      'no-unused-vars': [
        'error', // Changed from warn to error
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-debugger': 'error', // Changed from warn to error
      'prefer-const': 'error', // Changed from warn to error
      'no-var': 'error',

      // Additional strict rules
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'func-call-spacing': ['error', 'never'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'space-before-blocks': 'error',
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never', asyncArrow: 'always' },
      ],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': ['error', 'always'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'dot-location': ['error', 'property'],
      eqeqeq: ['error', 'always'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'keyword-spacing': 'error',
      'max-len': ['error', { code: 140, ignoreUrls: true, ignoreStrings: true }],
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      'no-bitwise': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-nested-ternary': 'error',
      'no-new-object': 'error',
      'no-spaced-func': 'error',
      'no-unneeded-ternary': 'error',
      'operator-assignment': ['error', 'always'],
      'operator-linebreak': ['error', 'before'],
      'quote-props': ['error', 'as-needed'],
      yoda: ['error', 'never'],

      // Additional strict rules for code quality
      'no-param-reassign': ['warn', { props: true }],
      'no-shadow': 'error',
      'no-undef-init': 'error',
      'no-undefined': 'warn',
      'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
      'no-useless-concat': 'error',
      'no-useless-constructor': 'warn',
      'no-useless-return': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-destructuring': ['warn', { array: true, object: true }],
      'prefer-template': 'error',
      'require-await': 'error',
      'sort-vars': 'error',
      strict: ['error', 'never'],

      // React rules - increased strictness
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'error', // Changed from warn to error
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-key': ['error', { checkFragmentShorthand: true }], // Changed from warn to error
      'react/no-unescaped-entities': 'error', // Changed from warn to error
      'react/self-closing-comp': 'error', // Changed from warn to error
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-equals-spacing': ['error', 'never'],
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      'react/jsx-no-bind': 'off',
      'react/jsx-no-comment-textnodes': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'off',
      'react/jsx-tag-spacing': [
        'error',
        { closingSlash: 'never', beforeSelfClosing: 'always', afterOpening: 'never' },
      ],
      'react/jsx-uses-vars': 'error',
      'react/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'parens-new-line',
        },
      ],

      // React Hooks rules - increased strictness
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error', // Changed from warn to error

      // JSX Accessibility rules - increased strictness
      'jsx-a11y/alt-text': 'error', // Changed from warn to error
      'jsx-a11y/anchor-is-valid': 'error', // Changed from warn to error
      'jsx-a11y/aria-props': 'error', // Changed from warn to error
      'jsx-a11y/aria-unsupported-elements': 'error', // Changed from warn to error
      'jsx-a11y/role-has-required-aria-props': 'error', // Changed from warn to error
      'jsx-a11y/role-supports-aria-props': 'error', // Changed from warn to error
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/media-has-caption': 'error',
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
      'jsx-a11y/no-noninteractive-tabindex': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Script files configuration
  {
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
    },
  },
  // Test files configuration
  {
    files: ['**/*.test.{js,jsx}', '**/__tests__/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.vitest,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
