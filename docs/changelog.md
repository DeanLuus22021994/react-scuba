# Changelog

All notable changes to React Scuba will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Coming Soon

- TypeScript migration
- Component Storybook
- E2E testing with Playwright
- Internationalization (i18n)

## [0.1.0] - 2025-10-21

### Added

- **Phase 2 Code Maintenance:**
  - Barrel exports for utils, hooks, and services
  - Comprehensive CONTRIBUTING.md documentation
  - Enhanced README with full script documentation
  - `.eslintignore` and `.prettierignore` files
  - ESLint and Prettier with React plugins
  - New npm scripts: `lint`, `format`, `test:ui`, `test:coverage`
  - Formatted entire codebase with Prettier
  - CODE_MAINTENANCE_SUMMARY_PHASE2.md documentation

- **Documentation Enhancement:**
  - Completely redesigned VitePress documentation
  - Removed archive directory (obsolete docs)
  - Modern, comprehensive documentation structure
  - Enhanced navigation and sidebar
  - Quick Start guide
  - Contributing guide
  - Changelog

### Changed

- Updated VitePress config with better UX
- Reorganized documentation from "Getting Started" to "Guide"
- Enhanced homepage with modern feature cards
- Improved search functionality

### Removed

- Archive directory with 5 legacy documentation files
- Redundant ADWORDS.md and SETUP.md files
- Empty API, deployment, contributing directories

### Fixed

- ESLint configuration (downgraded to v8 for .eslintrc.json support)
- PropTypes warnings on multiple components
- Code formatting inconsistencies

## [0.0.9] - 2025-10-21

### Added

- **Phase 1 Code Maintenance:**
  - Logger utility (`src/utils/logger.js`)
  - ErrorBoundary component (`src/components/common/ErrorBoundary.jsx`)
  - Environment variable validation (`src/utils/env.js`)
  - ESLint configuration (`.eslintrc.json`)
  - Prettier configuration (`.prettierrc.json`)
  - Test infrastructure fixes (`setupTests.js`)
  - CODE_MAINTENANCE_SUMMARY.md

### Changed

- Replaced all `console.*` calls with logger utility
- Enhanced .gitignore with editor and OS file patterns

### Removed

- Dead code: `BookingForm.jsx` (234 lines)
- Dead code: `DateTimeSelector.jsx` (68 lines)

## [0.0.8] - 2025-10-21

### Added

- GitHub Pages deployment via workflow
- Self-hosted Linux runner configuration
- Documentation archive structure

### Changed

- Updated CI/CD workflow to use self-hosted runner
- Archived legacy documentation files

### Fixed

- GitHub Pages deployment workflow
- Runner configuration for Linux environment

## [Earlier Versions]

### [0.0.7] - Initial VitePress Documentation

- Added VitePress documentation structure
- Created initial guides and component docs

### [0.0.6] - Testing Infrastructure

- Added Vitest configuration
- Testing Library setup
- Browser API mocks

### [0.0.5] - Core Features

- Multi-currency support
- Google Analytics integration
- SEO optimization
- Contact and booking modals

### [0.0.1] - Initial Release

- React 19 setup
- Vite 6 configuration
- Tailwind CSS styling
- 5 main pages
- 30+ components
- Basic routing
- Mobile-responsive design

---

## Version Naming Convention

- **Major (X.0.0):** Breaking changes
- **Minor (0.X.0):** New features, backward compatible
- **Patch (0.0.X):** Bug fixes, backward compatible

## Contributing

See [CONTRIBUTING.md](/contributing) for details on our code of conduct and the process for submitting pull requests.

[Unreleased]: https://github.com/DeanLuus22021994/react-scuba/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/DeanLuus22021994/react-scuba/releases/tag/v0.1.0
