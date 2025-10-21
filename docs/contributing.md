# Contributing to React Scuba

<div class="feature-card">

Thank you for your interest in contributing! This guide will help you get started with the development workflow.

</div>

## 🚀 Quick Start for Contributors

::: tip Fork & Clone
Start by forking the repository on GitHub, then follow these steps:
:::

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/react-scuba.git
cd react-scuba

# 3. Add upstream remote
git remote add upstream https://github.com/DeanLuus22021994/react-scuba.git

# 4. Create a branch
git checkout -b feature/your-feature-name

# 5. Make your changes
# ... edit files ...

# 6. Test your changes
npm test
npm run lint
npm run format:check

# 7. Commit and push
git add .
git commit -m "feat: add amazing feature"
git push origin feature/your-feature-name

# 8. Open a Pull Request on GitHub
```

## Development Guidelines

### Code Style

We use **ESLint** and **Prettier**:

```bash
npm run lint        # Check for errors
npm run lint:fix    # Auto-fix errors
npm run format      # Format code
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

<div class="quick-links">
  <div class="feature-card">
    <h4><span class="badge badge-success">feat</span></h4>
    <p>New feature</p>
  </div>
  <div class="feature-card">
    <h4><span class="badge badge-purple">fix</span></h4>
    <p>Bug fix</p>
  </div>
  <div class="feature-card">
    <h4><span class="badge badge-info">docs</span></h4>
    <p>Documentation changes</p>
  </div>
  <div class="feature-card">
    <h4><span class="badge badge-warning">style</span></h4>
    <p>Code style changes</p>
  </div>
  <div class="feature-card">
    <h4><span class="badge badge-info">refactor</span></h4>
    <p>Code refactoring</p>
  </div>
  <div class="feature-card">
    <h4><span class="badge badge-success">test</span></h4>
    <p>Adding/updating tests</p>
  </div>
</div>

**Examples:**

```
feat(courses): add advanced certification course
fix(booking): resolve date picker timezone issue
docs(guide): update installation instructions
```

### Component Guidelines

All components must have:

```javascript
import PropTypes from 'prop-types';

const MyComponent = ({ title, count, onClick }) => {
  // Component logic

  return <div className="my-component">{/* JSX */}</div>;
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  onClick: PropTypes.func,
};

export default MyComponent;
```

### Testing Requirements

- Write tests for new features
- Maintain 80%+ code coverage
- All tests must pass before PR

```bash
npm test              # Run tests
npm run test:coverage # Check coverage
```

### ✅ Pull Request Checklist

::: warning Before Submitting
Ensure all items are checked before opening a pull request
:::

- [ ] ✨ Code follows style guidelines
- [ ] 🧪 Tests added/updated and passing
- [ ] 📚 Documentation updated
- [ ] 🚫 No console statements (use logger)
- [ ] 📝 PropTypes defined for all components
- [ ] 🏗️ Build succeeds (`npm run build`)
- [ ] 🎨 Linting passes (`npm run lint`)

## Project Structure

See [Project Structure Guide](/guide/structure) for detailed information.

## Community

- 💬 [Discussions](https://github.com/DeanLuus22021994/react-scuba/discussions)
- 🐛 [Issues](https://github.com/DeanLuus22021994/react-scuba/issues)
- 📧 [Email](mailto:info@example.com)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
