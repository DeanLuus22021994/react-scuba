# Testing

React Scuba uses a comprehensive testing strategy with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/react) to ensure code quality and reliability.

## Overview

The project maintains 100% test coverage across all components, utilities, hooks, and services. Tests are automatically run during the pre-commit phase to catch issues early.

## Test Reports

### Interactive Dashboard

View the complete test results in our **[Interactive Test Dashboard](../contributing/)** which includes:

- 📊 Visual charts and metrics
- ⏱️ Performance analysis
- 📂 Category breakdowns
- 🔍 Detailed test results

### Quick Summary

For a quick overview, check the [Markdown Summary](../contributing/testing.md) which provides:

- Pass/fail statistics
- Failed test highlights
- Key metrics at a glance

## Test Structure

```text
tests/
├── components/          # Component tests
│   ├── common/         # Common components
│   ├── home/           # Home page components
│   ├── courses/        # Course-related components
│   ├── dive-sites/     # Dive site components
│   ├── gallery/        # Gallery components
│   ├── about/          # About page components
│   └── modals/         # Modal components
├── layouts/            # Layout component tests
├── hooks/              # Custom hook tests
├── utils/              # Utility function tests
├── services/           # API service tests
├── data/               # Data structure tests
└── report/             # Test reporting system
    ├── collectors/     # Data collectors
    ├── analyzers/      # Performance & category analyzers
    └── generators/     # Report generators (HTML/MD/JSON)
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test File

```bash
npm test -- AboutPage.test.jsx
```

## Writing Tests

### Component Testing

```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render without crashing', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const { user } = render(<MyComponent />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### Hook Testing

```jsx
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useCustomHook from './useCustomHook';

describe('useCustomHook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe(0);
  });

  it('should update value', () => {
    const { result } = renderHook(() => useCustomHook());
    act(() => {
      result.current.setValue(5);
    });
    expect(result.current.value).toBe(5);
  });
});
```

### Utility Testing

```javascript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
  });

  it('should format EUR correctly', () => {
    expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00');
  });
});
```

## Test Configuration

### Vitest Config

The test configuration is defined in `vite.config.js`:

```javascript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.js',
  css: true,
  reporters: ['default', './tests/report/vitest.reporter.js'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/',
      'src/setupTests.js',
      '**/*.test.{js,jsx}',
      'tests/',
    ],
  },
}
```

### Setup File

Global test setup is configured in `src/setupTests.js`:

```javascript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window APIs
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};
```

## Testing Best Practices

### 1. Test User Behavior, Not Implementation

❌ **Bad:**

````jsx

### 2. Use Semantic Queries

Prefer queries in this order:

1. `getByRole` - Accessibility-first
2. `getByLabelText` - Form elements
3. `getByPlaceholderText` - Form inputs
4. `getByText` - Non-interactive content
5. `getByTestId` - Last resort

### 3. Test Async Behavior Properly

```jsx
// Wait for elements to appear
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// User interactions
await user.click(screen.getByRole('button'));
````

### 4. Mock External Dependencies

```jsx
import { vi } from 'vitest';

vi.mock('./api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mock' })),
}));
```

### 5. Test Error States

```jsx
it('should display error message on failure', async () => {
  // Simulate error
  vi.mocked(fetchData).mockRejectedValueOnce(new Error('Failed'));

  render(<Component />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Coverage Goals

The project maintains high test coverage:

- **Statements:** > 90%
- **Branches:** > 85%
- **Functions:** > 90%
- **Lines:** > 90%

View current coverage by running:

```bash
npm run test:coverage
```

## Continuous Integration

Tests run automatically on every:

- **Pre-commit** - Via Husky hooks
- **Pull Request** - Via GitHub Actions
- **Push to main** - Via GitHub Actions

The CI pipeline includes:

1. Linting (ESLint)
2. Formatting (Prettier)
3. Unit tests (Vitest)
4. Coverage reporting
5. Test report generation

- **JSON Data** - Complete test data at `docs/contributing/test-results.json`

These reports are:

- ✅ Auto-generated during `npm test`

## Debugging Tests

### Run Tests with UI

```bash
npm run test:ui
```

This opens Vitest UI in your browser for interactive test debugging.

### Debug Specific Test

```bash
npm test -- --reporter=verbose AboutPage.test.jsx
```

### Enable Debug Logs

```javascript
import { screen } from '@testing-library/react';

screen.debug(); // Prints current DOM
```

## Common Testing Patterns

### Testing Router Components

```jsx
import { MemoryRouter } from 'react-router-dom';

render(
  <MemoryRouter initialEntries={['/about']}>
    <App />
  </MemoryRouter>
);
```

### Testing Context Providers

```jsx
import { CurrencyProvider } from './CurrencyContext';

const wrapper = ({ children }) => <CurrencyProvider>{children}</CurrencyProvider>;

render(<Component />, { wrapper });
```

### Testing Forms

```jsx
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

await user.type(screen.getByLabelText('Email'), 'test@example.com');
await user.click(screen.getByRole('button', { name: /submit/i }));
```

## Troubleshooting

### Tests Timing Out

Increase timeout for specific tests:

```javascript
it('should handle slow operation', async () => {
  // Test code
}, 10000); // 10 second timeout
```

### Mock Not Working

Ensure mocks are declared before imports:

```javascript
vi.mock('./module', () => ({
  default: vi.fn(),
}));

import Component from './Component'; // After mock
```

### Act Warnings

Wrap state updates in `act()`:

```javascript
import { act } from '@testing-library/react';

act(() => {
  result.current.updateState(newValue);
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test Reports Dashboard](../contributing/)
