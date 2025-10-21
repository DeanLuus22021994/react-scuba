# Linting & Code Quality Guide

This project uses modern ESLint (v9) with flat config and Prettier for code quality and consistent formatting.

## 🛠️ Tools

- **ESLint 9.38.0** - JavaScript/React linting with flat config
- **Prettier 3.6.2** - Code formatting
- **eslint-plugin-react 7.37.5** - React-specific rules
- **eslint-plugin-react-hooks 7.0.0** - React Hooks rules
- **eslint-plugin-jsx-a11y 6.10.2** - Accessibility rules

## 📋 Available Commands

### ESLint

```bash
# Check src directory only
npm run lint

# Fix issues in src directory
npm run lint:fix

# Check entire project
npm run lint:all

# Fix issues in entire project
npm run lint:all:fix
```

### Prettier

```bash
# Check formatting (src only)
npm run format:check

# Fix formatting (src only)
npm run format

# Check formatting (all files)
npm run format:all:check

# Fix formatting (all files)
npm run format:all
```

### Combined

```bash
# Check both ESLint and Prettier (src)
npm run check

# Check both linters (entire project)
npm run check:all

# Fix both ESLint and Prettier (src)
npm run fix
```

## ⚙️ Configuration Files

### ESLint Configuration

- **File**: `eslint.config.js` (Flat Config)
- **Ignores**: dist, build, node_modules, .vitepress, coverage, \*.backup
- **Environments**: Browser, Node.js, ES2021
- **Special Rules**:
  - Scripts directory: console statements allowed
  - Test files: Vitest/Jest globals available

### Prettier Configuration

- **File**: `.prettierrc.json`
- **Key Settings**:
  - Single quotes: ✅
  - Semicolons: ✅
  - Print width: 100 characters
  - Tab width: 2 spaces
  - Trailing commas: ES5
  - Line endings: LF (Unix-style)

### Prettier Ignore

- **File**: `.prettierignore`
- **Ignored**: node_modules, dist, build, coverage, backups, logs

## 🎯 ESLint Rules

### Console Statements

Allowed console methods:

- `console.warn()` ✅
- `console.error()` ✅
- `console.info()` ✅
- `console.debug()` ✅
- `console.log()` ⚠️ (warning)

Scripts and tests have console fully enabled.

### React Rules

- No PropTypes required (warning only)
- No React import needed (JSX transform)
- Self-closing components enforced
- JSX keys required with fragment shorthand check
- No unescaped entities (warning)
- No target="\_blank" without rel="noreferrer"

### React Hooks Rules

- Rules of Hooks: ❌ (error)
- Exhaustive deps: ⚠️ (warning)

### Accessibility Rules

- Alt text required
- ARIA props validated
- Link validity checked
- Role requirements enforced

### General Rules

- `prefer-const`: ⚠️ (warning)
- `no-var`: ❌ (error)
- `no-debugger`: ⚠️ (warning)
- Unused variables with `_` prefix: ignored

## 🚀 VS Code Integration

### Tasks Available

Access via `Ctrl+Shift+P` → "Tasks: Run Task":

1. **Consolidate CSS** - Run CSS consolidation tool
2. **Run All Linters** - ESLint + Prettier check
3. **Lint & Fix** - Auto-fix both linters
4. **ESLint Check** - ESLint only
5. **Prettier Check** - Prettier only
6. **Prettier Fix** - Format with Prettier
7. **Full Quality Check** - Lint + Test + Build

See `.vscode/TASKS.md` for details.

### Editor Settings

Configured in `.vscode/settings.json`:

- CSS unknown at-rules: ignored (for Tailwind v4)
- Auto-approve chat tools: enabled

### Keyboard Shortcuts

- Build: `Ctrl+Shift+B`
- Tasks Menu: `Ctrl+Shift+P` → "Tasks: Run Task"

## 📝 Pre-Commit Checklist

Before committing code:

```bash
# 1. Run all checks
npm run check

# 2. Run tests
npm test -- --run

# 3. Build project
npm run build
```

Or use the VS Code task: **Full Quality Check**

## 🔧 Customization

### Adding ESLint Rules

Edit `eslint.config.js`:

```javascript
export default [
  // ... existing config
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'your-rule': 'error', // Add your rule here
    },
  },
];
```

### Adding Prettier Rules

Edit `.prettierrc.json`:

```json
{
  "your-setting": "value"
}
```

### Ignoring Files

**ESLint**: Add to `ignores` array in `eslint.config.js`
**Prettier**: Add patterns to `.prettierignore`

## 🐛 Troubleshooting

### ESLint Not Working

1. Check Node.js version: `node --version` (v22+ recommended)
2. Reinstall dependencies: `npm install`
3. Clear cache: `rm -rf node_modules/.cache`

### Prettier Conflicts

1. Ensure ESLint and Prettier configs don't conflict
2. Format code: `npm run format`
3. Check `.prettierignore` for excluded files

### VS Code Tasks Not Showing

1. Reload VS Code: `Ctrl+Shift+P` → "Reload Window"
2. Check `.vscode/tasks.json` exists
3. Verify tasks.json is valid JSON

## 📚 Resources

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [React Hooks ESLint Plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [JSX A11y Plugin](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [VS Code Tasks](https://code.visualstudio.com/docs/editor/tasks)

## ✅ Current Status

- ✅ ESLint 9 with flat config
- ✅ Prettier 3.6.2 with modern settings
- ✅ React 19 support
- ✅ Accessibility rules enabled
- ✅ VS Code tasks configured
- ✅ All linters passing
- ✅ Zero warnings
- ✅ Code formatting consistent
