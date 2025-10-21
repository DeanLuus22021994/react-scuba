# VS Code Tasks Documentation

This workspace includes several pre-configured VS Code tasks to streamline your development workflow.

## 📋 Available Tasks

### Quality & Linting

- **Run All Linters** - Run ESLint and Prettier checks on the entire codebase
- **Lint & Fix** - Run ESLint and Prettier with automatic fixes
- **ESLint Check** - Run ESLint on src directory only
- **Prettier Check** - Check code formatting with Prettier
- **Prettier Fix** - Format code with Prettier

### CSS Management

- **Consolidate CSS** - Run CSS consolidation tool to merge CSS files

### Build & Test

- **Build Project** ⌨️ `Ctrl+Shift+B` - Build production bundle with Vite (default build task)
- **Run Tests** - Run all tests with Vitest (default test task)
- **Test Coverage** - Run tests with coverage report

### Quality Assurance

- **Full Quality Check** - Run linters, tests, and build in sequence

## 🚀 How to Use

### Method 1: Command Palette
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Tasks: Run Task"
3. Select the task you want to run

### Method 2: Keyboard Shortcuts
- **Build**: `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)
- **Test**: `Ctrl+Shift+T` (configured if using Test Explorer)

### Method 3: Terminal Menu
1. Go to **Terminal** → **Run Task...**
2. Select the desired task

## 💡 Task Details

### Consolidate CSS
Runs the CSS consolidation script that merges multiple CSS files into a single file with proper Tailwind v4 structure.

**When to use:**
- After editing CSS files in `src/styles/`
- Before committing CSS changes
- To fix PostCSS @import warnings

**Equivalent CLI:**
```bash
npm run consolidate:css
```

### Run All Linters
Executes both ESLint and Prettier checks to ensure code quality and formatting standards.

**Equivalent CLI:**
```bash
npm run lint && npm run format:check
```

### Lint & Fix
Automatically fixes ESLint and Prettier issues where possible.

**Equivalent CLI:**
```bash
npm run lint:fix && npm run format
```

### Full Quality Check
Comprehensive check that runs:
1. All linters (ESLint + Prettier)
2. All tests (Vitest)
3. Production build (Vite)

This is perfect for running before pushing code or creating a PR.

**Equivalent CLI:**
```bash
npm run check && npm test -- --run && npm run build
```

## 🎨 Task Icons

Each task has a color-coded icon for easy identification:
- 🔵 Blue - ESLint
- 💜 Magenta - Prettier
- 🟡 Yellow - Linters/Tests
- 🟢 Green - Build/Fix
- 🔴 Cyan - CSS/Coverage

## ⚙️ Customization

To add or modify tasks:
1. Open `.vscode/tasks.json`
2. Add/edit task configuration
3. Refer to [VS Code Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)

## 📝 NPM Scripts Reference

| Task | NPM Script |
|------|------------|
| Consolidate CSS | `npm run consolidate:css` |
| ESLint Check | `npm run lint` |
| ESLint Fix | `npm run lint:fix` |
| ESLint All Files | `npm run lint:all` |
| ESLint Fix All | `npm run lint:all:fix` |
| Prettier Check | `npm run format:check` |
| Prettier Fix | `npm run format` |
| Prettier All | `npm run format:all` |
| Check All | `npm run check:all` |
| Fix All | `npm run fix` |
| Build | `npm run build` |
| Test | `npm test -- --run` |
| Test Coverage | `npm run test:coverage` |
