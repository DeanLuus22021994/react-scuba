---
title: Development Workflow
description: Comprehensive guide to development workflow, Git practices, CI/CD, and quality assurance processes
---

# Development Workflow

This guide covers the complete development workflow for React Scuba, including Git practices, code quality assurance, testing strategies, and deployment processes.

## Overview

The development workflow is designed for:

- **Quality Assurance** - Automated linting, formatting, and testing
- **Collaborative Development** - Git flow with code reviews and CI/CD
- **Documentation** - Comprehensive guides and automated documentation deployment
- **Performance** - Fast development cycles with optimized tooling

## Development Environment

### Prerequisites

- **Node.js 18+** - Latest LTS version recommended
- **npm** - Package manager (comes with Node.js)
- **Git** - Version control system
- **VS Code** - Recommended editor with React extensions

### Environment Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DeanLuus22021994/react-scuba.git
   cd react-scuba
   ```

2. **Install dependencies:**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

### Development Scripts

The project includes comprehensive npm scripts for development:

```json
{
  "start": "BROWSER=none WDS_SOCKET_PORT=0 vite --port 3000",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "lint": "eslint src --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint src --fix",
  "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
  "format:check": "prettier --check \"src/**/*.{js,jsx,json,css,md}\"",
  "check": "npm run lint && npm run format:check",
  "precommit": "npm run check && npm test -- --run && npm run test:docs"
}
```

## Git Workflow

### Branching Strategy

We follow a **Git Flow** inspired branching model:

```
main (production)
├── feature/feature-name
├── bugfix/bug-description
├── hotfix/critical-fix
└── release/v1.2.0
```

**Branch Types:**

- **`main`** - Production-ready code, always deployable
- **`feature/*`** - New features and enhancements
- **`bugfix/*`** - Bug fixes for existing functionality
- **`hotfix/*`** - Critical fixes for production issues
- **`release/*`** - Release preparation and testing

### Commit Convention

We use **Conventional Commits** for consistent commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

**Commit Types:**

<div class="commit-types">
  <div class="commit-type">
    <code>feat</code>
    <span>New feature</span>
  </div>
  <div class="commit-type">
    <code>fix</code>
    <span>Bug fix</span>
  </div>
  <div class="commit-type">
    <code>docs</code>
    <span>Documentation changes</span>
  </div>
  <div class="commit-type">
    <code>style</code>
    <span>Code style changes (formatting, etc.)</span>
  </div>
  <div class="commit-type">
    <code>refactor</code>
    <span>Code refactoring</span>
  </div>
  <div class="commit-type">
    <code>test</code>
    <span>Adding or updating tests</span>
  </div>
  <div class="commit-type">
    <code>chore</code>
    <span>Maintenance tasks</span>
  </div>
</div>

**Examples:**

```
feat(currency): add multi-currency support with live exchange rates
fix(booking): resolve date picker timezone validation issue
docs(guide): update forms validation documentation
test(contact): add integration tests for form submission
```

### Pull Request Process

1. **Create Feature Branch:**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Changes:**
   - Write clean, tested code
   - Follow coding standards
   - Update documentation

3. **Pre-commit Quality Checks:**

   ```bash
   npm run precommit  # Runs lint, format, test, and docs checks
   ```

4. **Commit Changes:**

   ```bash
   git add .
   git commit -m "feat: implement amazing feature"
   ```

5. **Push and Create PR:**

   ```bash
   git push origin feature/amazing-feature
   # Create Pull Request on GitHub
   ```

6. **Code Review:**
   - Automated checks must pass
   - Peer review required
   - Address review feedback

7. **Merge:**
   - Squash merge for clean history
   - Delete feature branch after merge

## Code Quality Assurance

### Pre-commit Hooks

**Husky** enforces quality checks before commits:

```bash
# .husky/pre-commit
npm run precommit

# Stage generated test reports
git add docs/testing/testing.md docs/testing/test-results.json docs/testing/index.html
```

**Pre-commit checks include:**

- ESLint validation (zero warnings allowed)
- Prettier formatting verification
- Unit and integration tests
- Documentation link checking

### ESLint Configuration

Comprehensive linting with React and accessibility rules:

```javascript
// eslint.config.js
export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // ESLint recommended rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // React specific rules
      'react/prop-types': 'warn',
      'react/jsx-no-target-blank': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
    },
  },
];
```

### Prettier Formatting

Consistent code formatting across the project:

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

**Format checking:**

```bash
npm run format:check  # Check formatting
npm run format        # Auto-format code
```

## Testing Strategy

### Test Framework

**Vitest** with React Testing Library for fast, reliable testing:

```javascript
// vitest.config.js
export default {
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
  },
};
```

### Test Categories

1. **Unit Tests** - Component logic and utilities
2. **Integration Tests** - Component interactions and API calls
3. **E2E Tests** - Full user workflows (future implementation)

### Test Structure

```
tests/
├── components/     # Component tests
├── hooks/         # Custom hook tests
├── utils/         # Utility function tests
├── pages/         # Page component tests
├── services/      # API service tests
└── __mocks__/     # Test mocks
```

### Running Tests

```bash
# Development testing
npm test              # Watch mode
npm run test:ui       # Visual test runner
npm run test:coverage # Coverage report

# CI testing
npm run test:run      # Single run for CI
```

### Test Quality Metrics

- **Coverage Target:** 80%+ code coverage
- **Test Types:** Unit, integration, and accessibility tests
- **Performance:** Tests complete within 30 seconds
- **Reliability:** Zero flaky tests in CI

## Continuous Integration

### GitHub Actions Workflow

Automated CI/CD pipeline for quality assurance:

```yaml
# .github/workflows/docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths: ['docs/**', '.github/workflows/docs.yml']

jobs:
  build:
    runs-on: [self-hosted, linux, react]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci --legacy-peer-deps
      - run: npm run check # Lint & format check
      - run: npm run docs:build # Build documentation

      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: [self-hosted, linux, react]
    steps:
      - uses: actions/deploy-pages@v4
```

### Quality Gates

**Pre-merge requirements:**

- ✅ All tests pass
- ✅ ESLint passes (zero warnings)
- ✅ Prettier formatting correct
- ✅ Build succeeds
- ✅ Code review approved

### Automated Checks

**CI Pipeline includes:**

1. **Dependency installation** with legacy peer deps support
2. **Code quality checks** (lint + format)
3. **Test execution** with coverage reporting
4. **Build verification** for production readiness
5. **Documentation deployment** on successful builds

## Documentation Workflow

### VitePress Documentation

Comprehensive documentation with automated deployment:

```javascript
// docs/.vitepress/config.js
export default {
  title: 'React Scuba',
  description: 'Modern dive center website platform',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Contributing', link: '/contributing/' },
    ],
    sidebar: {
      '/guide/': [
        { text: 'Quick Start', link: '/guide/quick-start' },
        { text: 'Configuration', link: '/guide/configuration' },
        // ... more sections
      ],
    },
  },
};
```

### Documentation Deployment

**Automated documentation updates:**

- Triggered on `docs/` folder changes
- Built with VitePress for optimal performance
- Deployed to GitHub Pages
- Includes interactive test dashboards

### Documentation Standards

**Documentation requirements:**

- ✅ Comprehensive API documentation
- ✅ Code examples with syntax highlighting
- ✅ Interactive examples where applicable
- ✅ Search functionality
- ✅ Mobile-responsive design
- ✅ Automated link checking

## Release Process

### Version Management

**Semantic versioning** with automated changelog:

```bash
# Version bump (manual or automated)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### Release Checklist

**Pre-release verification:**

- [ ] All tests pass in CI
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Breaking changes documented
- [ ] Performance benchmarks met
- [ ] Security audit passed

**Release steps:**

1. Create release branch from main
2. Update version and changelog
3. Run full test suite
4. Create GitHub release
5. Deploy to production
6. Monitor post-deployment

### Deployment Strategy

**Multi-environment deployment:**

- **Development:** Automatic on feature branches
- **Staging:** Manual deployment for testing
- **Production:** Automated on main branch merges

## Performance Monitoring

### Build Performance

**Vite optimization strategies:**

- **Code splitting** by route for faster initial loads
- **Tree shaking** to eliminate unused code
- **Asset optimization** with modern formats
- **Bundle analysis** for size monitoring

### Runtime Performance

**Performance monitoring:**

- **Core Web Vitals** tracking
- **Bundle size** monitoring
- **Runtime errors** logging
- **User experience** metrics

### Development Performance

**Fast development cycles:**

- **Hot module replacement** for instant updates
- **Fast refresh** for React components
- **Parallel processing** for linting and testing
- **Incremental builds** for faster iterations

## Troubleshooting

### Common Issues

**Build Failures:**

```bash
# Clear cache and reinstall
rm -rf node_modules .vite
npm install --legacy-peer-deps
```

**Test Failures:**

```bash
# Run tests with verbose output
npm run test:ui
# Check coverage report
npm run test:coverage
```

**Linting Issues:**

```bash
# Auto-fix linting errors
npm run lint:fix
# Check specific files
npx eslint src/components/MyComponent.jsx
```

### Getting Help

**Support channels:**

- 📧 **Email:** info@mauritius-scuba.com
- 💬 **GitHub Discussions:** For questions and community support
- 🐛 **GitHub Issues:** For bug reports and feature requests
- 📖 **Documentation:** Comprehensive guides and API reference

## Best Practices

### Code Organization

1. **Component Structure** - Clear separation of concerns
2. **File Naming** - Consistent PascalCase for components
3. **Import Order** - External libraries, then internal modules
4. **Error Handling** - Graceful degradation with user feedback

### Collaboration

1. **Clear Communication** - Detailed PR descriptions and comments
2. **Knowledge Sharing** - Document complex implementations
3. **Code Reviews** - Constructive feedback and learning opportunities
4. **Pair Programming** - For complex features and bug fixes

### Quality Assurance

1. **Test-Driven Development** - Write tests before implementation
2. **Continuous Integration** - Never break the build
3. **Performance Budgets** - Monitor and maintain performance targets
4. **Security First** - Regular dependency updates and security audits

This comprehensive workflow ensures high-quality, maintainable code with efficient development processes and reliable deployments.
