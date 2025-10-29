---
title: "Technology Stack Overview"
domain: modernization
category: technology
audience: ai-copilot
ai_hints:
  - bleeding-edge-stack
  - modern-tooling
  - framework-versions
  - build-system
related:
  - build-optimizations.md
  - modernization-achievements.md
last_updated: 2025-10-29
---

# Technology Stack Overview

## Frontend Technology Stack

### Core Framework

**React**: Version 19.2.0 with concurrent rendering capabilities
**Compilation Target**: ESNext for modern browser features
**Module System**: ES modules with bundler resolution

### Build Tooling

**Vite**: Version 7.1.12 for cutting-edge build performance
**Compiler**: SWC Rust-based transpilation for maximum speed
**Minification**: esbuild for production optimization

### Styling System

**Tailwind CSS**: Version 4.1.16 utility-first framework
**PostCSS**: Version 8+ with autoprefixer plugin
**Vendor Prefixing**: Autoprefixer 10.4.22 for browser compatibility

### State Management

**Server State**: TanStack Query 5.91.2 for server-side state
**Client State**: Zustand 5.1.0 for lightweight local state
**Form State**: React Hook Form with Zod validation

### Routing

**React Router**: Version 7.10.0 with file-based routing
**Code Splitting**: Automatic route-based splitting
**Lazy Loading**: Dynamic imports for optimal loading

### Animation

**Framer Motion**: Version 12.24.0 for advanced animations
**Performance**: Hardware-accelerated transforms
**Declarative API**: Motion components and variants

## Build System Architecture

### Monorepo Orchestration

**npm workspaces**: Native monorepo management (removed Turbo 2.5.8)
**Workspace Commands**: Native npm workspace execution
**Parallel Builds**: npm built-in parallelization
**Caching**: Native npm cache strategies

### Linting and Formatting

**Biome**: Version 2.3.1 Rust-based linting (replaces ESLint)
**Line Length**: 100 characters
**Quote Style**: Single quotes (JS/TS), double quotes (Python)
**Import Sorting**: Auto-sort with Biome

### TypeScript Configuration

**Version**: TypeScript 5.9.4
**Target**: ESNext compilation
**Module Resolution**: Bundler-native (no baseUrl)
**Strict Mode**: Enabled for type safety

## Testing Infrastructure

### Unit Testing

**Vitest**: Version 3.2.5 next-generation testing framework
**Coverage**: Target 80%+ for critical paths
**Speed**: Rust-based test runner
**Watch Mode**: Intelligent re-run strategies

### E2E Testing

**Playwright**: Version 1.56.2 for modern E2E testing
**Browsers**: Chromium, Firefox, WebKit support
**Parallel Execution**: Multi-browser testing
**Trace Viewer**: Debugging with time-travel

### Testing Libraries

**React Testing Library**: Latest version for component testing
**Testing Library User Event**: User interaction simulation
**jsdom**: Browser environment for unit tests

## Development Environment

### Node.js Runtime

**Version**: Node.js 20 LTS
**Package Manager**: npm 10.9.2
**Memory Allocation**: 32GB TypeScript language server

### Python Environment

**Version**: Python 3.14t free-threading build
**Package Manager**: UV (Rust-based)
**Linter**: Ruff for Python code quality

### VS Code Configuration

**Editor**: VS Code Insiders with experimental features
**AI Assistant**: GitHub Copilot with Claude 3.5 Sonnet
**Memory**: 32GB TypeScript server allocation
**Auto-Accept**: Zero-interaction workflow mode

## Backend Technology Stack

### API Framework

**Express.js**: Version 5.0.0 for modern async patterns
**Node.js**: Version 20 LTS runtime
**Middleware**: Compression, rate limiting, validation

### Database Systems

**PostgreSQL**: Version 17 for primary storage
**MariaDB**: Version 11 for legacy compatibility
**Connection Pooling**: Application-managed pools

### API Standards

**REST**: RESTful endpoint design
**Validation**: Express-validator middleware
**Error Handling**: Centralized error middleware
**Rate Limiting**: Express-rate-limit protection

## Modern JavaScript Features

### Language Target

**ECMAScript**: ES2020+ features enabled
**Async/Await**: Native async patterns
**Optional Chaining**: Safe property access
**Nullish Coalescing**: Default value assignment

### Module System

**ES Modules**: Native import/export syntax
**Dynamic Imports**: Code splitting support
**Top-Level Await**: Module-level async operations

### Modern APIs

**Fetch API**: Native HTTP requests
**URL API**: Modern URL manipulation
**FormData**: File upload handling
**AbortController**: Request cancellation

## Performance Optimization

### Build Performance

**Compilation**: Sub-second incremental builds
**Caching**: Multi-layer build caching
**Parallelization**: Multi-core build utilization
**Tree Shaking**: Dead code elimination

### Runtime Performance

**Code Splitting**: Route-based and dynamic splits
**Lazy Loading**: Component-level lazy loading
**Memoization**: React.memo, useMemo, useCallback
**Bundle Size**: Optimized vendor chunks

## Security Considerations

### Dependency Management

**Audit**: Regular security audits
**Updates**: Automated dependency updates
**Lockfile**: Package-lock.json for reproducibility
**Vulnerability Scanning**: Pre-commit checks

### Build Security

**Content Security Policy**: CSP headers configuration
**Subresource Integrity**: SRI for CDN resources
**HTTPS**: Enforced secure connections
**Environment Variables**: Secure secret management

## Future Technology Considerations

### Potential Upgrades

React Server Components evaluation for RSC patterns
Next.js or Remix consideration for SSR requirements
Bun runtime evaluation for performance gains
Turbopack consideration when stable

### Experimental Features

**React Compiler**: Automatic memoization
**Suspense Boundaries**: Advanced loading states
**Server Actions**: Form submission patterns
**Progressive Enhancement**: No-JS fallbacks
