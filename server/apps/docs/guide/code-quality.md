# Code Quality

<div class="feature-card">

Comprehensive code quality system using ESLint, Prettier, Husky pre-commit hooks, and automated testing to maintain high standards across the React Scuba codebase.

</div>

## Overview

React Scuba maintains exceptional code quality through a comprehensive tooling ecosystem that includes linting, formatting, automated testing, and pre-commit quality gates. This ensures consistent, maintainable, and bug-free code across the entire application.

## ESLint Configuration

### Modern ESLint Setup

Flat config-based ESLint configuration with React and accessibility plugins:

```javascript
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
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
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
    // Comprehensive rules configuration
  },
];
```

### Rule Categories

#### JavaScript Best Practices

```javascript
rules: {
  'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
  'no-unused-vars': ['warn', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
  }],
  'no-debugger': 'warn',
  'prefer-const': 'warn',
  'no-var': 'error',
}
```

#### React Rules

```javascript
rules: {
  ...react.configs.recommended.rules,
  'react/prop-types': 'warn',
  'react/jsx-no-target-blank': 'error',
  'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
  'react/no-unescaped-entities': 'warn',
  'react/self-closing-comp': 'warn',
}
```

#### React Hooks Rules

```javascript
rules: {
  ...reactHooks.configs.recommended.rules,
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
}
```

#### Accessibility Rules

```javascript
rules: {
  'jsx-a11y/alt-text': 'warn',
  'jsx-a11y/anchor-is-valid': 'warn',
  'jsx-a11y/aria-props': 'warn',
  'jsx-a11y/role-has-required-aria-props': 'warn',
  'jsx-a11y/role-supports-aria-props': 'warn',
}
```

## Prettier Configuration

### Code Formatting

Consistent code formatting with Prettier:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### File Types

Prettier processes multiple file types:

- **JavaScript/JSX**: `.js`, `.jsx`
- **JSON**: `package.json`, config files
- **CSS**: Component styles
- **Markdown**: Documentation files

## Husky Pre-commit Hooks

### Git Hooks Setup

Automated quality checks before commits:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

### Pre-commit Hook

Comprehensive pre-commit validation:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run check && npm test -- --run && npm run test:docs
```

This runs:

1. **Linting and formatting checks**
2. **Unit tests**
3. **Documentation link validation**

## Testing Strategy

### Vitest Configuration

Modern testing framework with comprehensive coverage:

```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    reporters: ['default', './tests/report/vitest.reporter.js'],
  },
});
```

### Test Categories

#### Unit Tests

Component and utility function testing:

```jsx
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});
```

#### Integration Tests

Feature and workflow testing:

```jsx
// Form submission testing
describe('ContactForm', () => {
  it('submits form data correctly', async () => {
    // Test complete form workflow
  });
});
```

#### Accessibility Tests

Automated accessibility validation:

```jsx
// Accessibility testing
it('should have proper ARIA labels', () => {
  render(<WhatsAppButton />);
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('aria-label', 'Chat on WhatsApp');
});
```

### Test Coverage

Comprehensive coverage requirements:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

## NPM Scripts

### Quality Assurance Scripts

```json
{
  "scripts": {
    "lint": "eslint src --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --fix",
    "lint:all": "eslint . --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,json,css,md}\"",
    "check": "npm run lint && npm run format:check",
    "check:all": "npm run lint:all && npm run format:all:check",
    "fix": "npm run lint:fix && npm run format",
    "precommit": "npm run check && npm test -- --run && npm run test:docs"
  }
}
```

### Script Categories

#### Linting

- `lint`: Lint source files only
- `lint:fix`: Auto-fix linting issues
- `lint:all`: Lint entire project

#### Formatting

- `format`: Format source files
- `format:check`: Check formatting without changes
- `format:all`: Format entire project

#### Combined Checks

- `check`: Lint + format check (source only)
- `check:all`: Lint + format check (entire project)
- `fix`: Auto-fix linting + format source files

## Development Workflow

### Pre-commit Quality Gates

Automated quality enforcement:

1. **Pre-commit Hook**: Runs on every commit
2. **CI/CD Pipeline**: Runs on every push/PR
3. **Manual Checks**: Available for local development

### IDE Integration

VS Code workspace configuration:

```json
{
  "eslint.experimental.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Code Review Standards

### Pull Request Requirements

Quality standards for code reviews:

#### Code Style

- [x] ESLint passes with zero warnings
- [x] Prettier formatting applied
- [x] Consistent naming conventions
- [x] Proper TypeScript types (if applicable)

#### Testing

- [x] Unit tests for new functionality
- [x] Integration tests for workflows
- [x] Accessibility tests included
- [x] Test coverage maintained

#### Documentation

- [x] Code comments for complex logic
- [x] README updates for new features
- [x] API documentation updated

#### Performance

- [x] No performance regressions
- [x] Bundle size impact assessed
- [x] Core Web Vitals maintained

## Continuous Integration

### GitHub Actions Workflow

Automated CI pipeline:

```yaml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run check:all
      - run: npm test -- --run --coverage
      - run: npm run test:docs
```

### Quality Metrics

Tracked quality indicators:

- **Code Coverage**: > 80% target
- **ESLint Violations**: 0 allowed
- **Test Pass Rate**: 100% required
- **Bundle Size**: < 500KB limit
- **Performance Score**: > 90 Lighthouse

## Best Practices

### Code Standards

#### Naming Conventions

```javascript
// Components: PascalCase
const UserProfile = () => {};

// Functions: camelCase
const calculateTotal = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Files: kebab-case
// user-profile.jsx, calculate-total.js
```

#### File Organization

```
src/
  components/     # Reusable UI components
  pages/         # Route components
  hooks/         # Custom React hooks
  utils/         # Utility functions
  services/      # API and external services
  data/          # Static data and constants
  layouts/       # Layout components
```

#### Component Patterns

```jsx
// Prefer functional components with hooks
const UserCard = ({ user, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  return <div className="user-card">{/* Component JSX */}</div>;
};

// Use PropTypes or TypeScript for type safety
UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
};
```

### Error Handling

Consistent error handling patterns:

```javascript
// Async error handling
const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user data:', error);
    throw new Error('Unable to load user information');
  }
};

// React error boundaries
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Performance Considerations

Code quality includes performance awareness:

```javascript
// Memoization for expensive computations
const expensiveValue = useMemo(() => {
  return heavyCalculation(props.data);
}, [props.data]);

// Lazy loading for code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Virtual scrolling for large lists
<VirtualizedList items={largeDataset} />;
```

## Documentation

### Code Documentation

JSDoc comments for public APIs:

```javascript
/**
 * Calculates the total price including tax and discounts
 * @param {number} basePrice - The base price before tax
 * @param {number} taxRate - Tax rate as decimal (e.g., 0.15 for 15%)
 * @param {number[]} discounts - Array of discount percentages
 * @returns {number} The final price after tax and discounts
 */
export const calculateTotalPrice = (basePrice, taxRate, discounts) => {
  // Implementation
};
```

### README Documentation

Comprehensive project documentation:

- **Installation**: Step-by-step setup instructions
- **Usage**: Basic usage examples
- **Contributing**: Development guidelines
- **API Reference**: Public API documentation

## Maintenance

### Regular Audits

Scheduled quality maintenance:

#### Weekly

- Dependency updates check
- Security vulnerability scanning
- Performance regression testing

#### Monthly

- Code coverage review
- ESLint rule updates
- Documentation freshness check

#### Quarterly

- Architecture review
- Testing strategy assessment
- Tooling modernization

### Team Training

Ongoing quality education:

- **Code Review Guidelines**: Shared standards
- **Tool Training**: ESLint, Prettier, testing frameworks
- **Best Practices**: Regular knowledge sharing
- **Standards Updates**: Framework and tool changes

This comprehensive code quality system ensures React Scuba maintains high standards of reliability, maintainability, and developer experience throughout its lifecycle.
