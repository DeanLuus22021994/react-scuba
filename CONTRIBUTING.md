# Contributing to React Scuba

Thank you for your interest in contributing to React Scuba! This guide will help you get started with development and maintaining code quality standards.

## Table of Contents

- [Development Setup](#development-setup)
- [Code Style Guidelines](#code-style-guidelines)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Additional Resources](#additional-resources)

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/DeanLuus22021994/react-scuba.git
   cd react-scuba
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm start
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## Code Style Guidelines

### JavaScript/React

- **ES6+ syntax**: Use modern JavaScript features (arrow functions, destructuring, async/await)
- **Functional components**: Prefer function components with hooks over class components
- **PropTypes**: Always define PropTypes for component props
- **File naming**: Use PascalCase for components (`MyComponent.jsx`), camelCase for utilities (`myUtil.js`)

### Formatting

We use **ESLint** and **Prettier** for code formatting:

```bash
# Check for lint errors
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Code Quality Standards

1. **No console statements in production code**
   - Use the `logger` utility from `src/utils/logger.js`
   - Example: `logger.log('Debug info')` instead of `console.log()`

2. **Error handling**
   - Components should be wrapped in ErrorBoundary when appropriate
   - Use try-catch blocks for async operations
   - Provide user-friendly error messages

3. **Environment variables**
   - All environment variables must be validated in `src/utils/env.js`
   - Use Zod schemas for validation
   - Never commit `.env.local` files

4. **Component structure**

   ```jsx
   import PropTypes from 'prop-types';
   import { logger } from '@/utils';

   const MyComponent = ({ prop1, prop2 }) => {
     // Hooks at the top
     const [state, setState] = useState(null);

     // Effects after hooks
     useEffect(() => {
       // Effect logic
     }, []);

     // Event handlers
     const handleClick = () => {
       logger.log('Button clicked');
     };

     // Render
     return <div>{/* Component JSX */}</div>;
   };

   MyComponent.propTypes = {
     prop1: PropTypes.string.isRequired,
     prop2: PropTypes.number,
   };

   export default MyComponent;
   ```

## Project Structure

```
react-scuba/
├── src/
│   ├── components/       # React components organized by feature
│   │   ├── common/       # Shared components (ErrorBoundary, Loading, etc.)
│   │   ├── about/        # About page components
│   │   ├── courses/      # Courses page components
│   │   ├── dive-sites/   # Dive sites components
│   │   ├── gallery/      # Gallery components
│   │   └── home/         # Home page components
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Page layout components
│   ├── pages/            # Page components
│   ├── services/         # API and external services
│   ├── utils/            # Utility functions
│   ├── data/             # Static data and constants
│   └── styles/           # Global styles and Tailwind config
├── docs/                 # VitePress documentation
│   ├── .vitepress/       # VitePress configuration
│   └── archive/          # Historical/legacy documentation
├── public/               # Static assets
└── .github/              # GitHub Actions workflows

```

### Barrel Exports

Each directory has an `index.js` file for cleaner imports:

```javascript
// Instead of:
import MyComponent from '../../components/common/MyComponent';

// Use:
import { MyComponent } from '@/components/common';
```

## Making Changes

### Branch Naming

- Feature: `feature/description`
- Bug fix: `fix/description`
- Documentation: `docs/description`
- Refactor: `refactor/description`

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(courses): add advanced certification course
fix(booking): resolve date picker timezone issue
docs(readme): update installation instructions
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place test files next to the component: `MyComponent.test.jsx`
- Use React Testing Library for component tests
- Follow the AAA pattern: Arrange, Act, Assert

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    // Arrange
    render(<MyComponent prop="value" />);

    // Act & Assert
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

- Maintain minimum 80% code coverage
- Focus on critical business logic
- Test error scenarios and edge cases

## Pull Request Process

1. **Create a branch** from `main`

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** following the style guidelines

3. **Test your changes**

   ```bash
   npm test
   npm run lint
   npm run format:check
   ```

4. **Commit your changes** with conventional commit messages

5. **Push to your branch**

   ```bash
   git push origin feature/my-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Ensure CI checks pass
   - Request review from maintainers

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated (if applicable)
- [ ] No console statements (use logger utility)
- [ ] PropTypes defined for all components
- [ ] Environment variables validated
- [ ] Build succeeds without warnings
- [ ] Linting passes (`npm run lint`)
- [ ] Formatting passes (`npm run format:check`)

## Additional Resources

### Documentation

- **Project Documentation**: [VitePress Docs](https://deanluus22021994.github.io/react-scuba/)
- **Technical Debt Tracking**: See `DEVELOPMENT_DEBT.md`
- **Recent Changes**: See `CODE_MAINTENANCE_SUMMARY.md`
- **Legacy Documentation**: Available in `docs/archive/`

### Tools & Libraries

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Testing Library](https://testing-library.com/react)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

### Getting Help

- Check existing issues and discussions
- Review the documentation first
- Open a new issue with detailed information
- Join discussions for feature proposals

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

Thank you for contributing to React Scuba! 🤿
