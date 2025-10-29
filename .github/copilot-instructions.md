# React Scuba - Copilot Workspace Instructions

## Project Overview

React Scuba is a **multi-tenant dive shop management platform** built with a modern npm workspaces monorepo architecture. The platform supports multiple dive shop clients with isolated configurations, theming, and content while sharing a unified codebase.

## Directory Structure

```
react-scuba/
├── server/                    # npm workspaces monorepo root
│   ├── apps/                  # Application workspaces
│   │   ├── web/              # React 19 frontend (Vite 7)
│   │   ├── api/              # Express.js 5 backend
│   │   ├── content/          # Multi-tenant content provider
│   │   └── docs/             # VitePress documentation
│   ├── packages/             # Shared packages
│   │   ├── config/           # Shared tooling configs
│   │   ├── types/            # TypeScript type definitions
│   │   ├── ui/               # Shared React components
│   │   └── utils/            # Shared utilities
│   └── clients/              # Multi-tenant client configs
│       ├── _template/        # Template for new clients
│       ├── di-authority-johannesburg/
│       └── ocean-spirit-mauritius/
├── docker-compose-examples/  # Docker infrastructure examples
├── .vscode/                  # VS Code configuration
│   ├── mcp-servers/          # Model Context Protocol servers
│   └── scripts/              # Automation scripts
└── .github/                  # GitHub configuration & Copilot context
```

## Technology Stack

### Frontend (apps/web)

- **React 19.2** with **Vite 7.1.11** (SWC plugin)
- **TypeScript 5.9.3** (strict mode)
- **Tailwind CSS 4** (PostCSS)
- **React Router v7** (file-based routing)
- **TanStack Query v5** (server state)
- **Zustand** (client state)
- **Framer Motion** (animations)
- **React Hook Form + Zod** (forms & validation)

### Backend (apps/api)

- **Express.js 5.0.0** (Node.js 20.x)
- **PostgreSQL 17** (primary database)
- **MariaDB 11** (legacy support)
- **Docker Compose** (local development)

### Build & Tooling

- **npm workspaces** (monorepo orchestration)
- **npm 10.9.2** (package manager, workspaces)
- **Biome 2.3.1** (Rust-based linter, replaces ESLint)
- **Vitest 3.2.4** (unit testing)
- **Playwright 1.56** (E2E testing)

### Python (docker-compose-examples/mcp/python_utils)

- **Python 3.14t** (free-threading build)
- **UV** (fast package manager)
- **Ruff** (Rust-based linter)
- **Pytest** (testing)

## Code Standards

### Formatting & Linting

- **Biome-first approach**: Use Biome for all JavaScript/TypeScript files
- **Line length**: 100 characters
- **Indentation**: 2 spaces (JS/TS), 4 spaces (Python)
- **Quotes**: Single quotes (JS/TS), double quotes (Python)
- **Imports**: Auto-sort with Biome/isort
- **Run `npm run lint:fix` before committing**

### TypeScript

- **Strict mode enabled** (`strict: true`)
- **Module resolution**: Bundler
- **Target**: ES2022
- **Path aliases**: `@/*` → `./src/*`
- **Use explicit types** (avoid `any`)
- **Prefer interfaces** over type aliases for objects

### React Patterns

- **Functional components** with hooks (no class components)
- **TypeScript prop types** (no PropTypes)
- **Custom hooks** for shared logic (prefix with `use`)
- **Colocation**: Keep tests next to source files (`*.test.tsx`)
- **Lazy loading**: Use `React.lazy()` for route components

### File Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`UserProfile.types.ts`)
- **Tests**: `*.test.tsx` or `*.spec.tsx`

## Multi-Tenant Architecture

### Client Configuration

Each client has a config in `server/clients/{client-id}/config.json`:

```json
{
  "id": "client-id",
  "name": "Client Name",
  "domain": "example.com",
  "subdomain": "app",
  "theme": { "colors": {...}, "fonts": {...} },
  "features": { "booking": true, "courses": true },
  "contact": {...},
  "social": {...}
}
```

### Content Resolution

- **Runtime**: `@react-scuba/content` package resolves client from subdomain/domain/env
- **Build**: Vite injects client config at build time (multi-build for production)
- **Assets**: Client-specific images in `server/clients/{client-id}/images/`

## Testing Conventions

### Unit Tests (Vitest)

- **Location**: Colocated with source (`Component.test.tsx`)
- **Coverage target**: 80%+ (critical paths 100%)
- **Mocking**: Use `vi.mock()` for external dependencies
- **Run**: `npm test` (watch mode) or `npm run test:coverage`

### E2E Tests (Playwright)

- **Location**: `server/apps/web/tests/e2e/`
- **Scenarios**: User journeys, multi-tenant flows, critical paths
- **Run**: `npx playwright test`

## Common Commands

```bash
# Development
npm run dev                     # Start all workspaces in dev mode
npm run dev --filter=@react-scuba/web  # Start specific workspace

# Building
npm run build                   # Build all workspaces
npm run build:prod              # Production build (optimized)
npm run build:analyze           # Build with bundle analysis

# Testing
npm test                        # Run all tests (watch mode)
npm run test:coverage           # Generate coverage reports
npx playwright test             # Run E2E tests

# Linting & Formatting
npm run lint                    # Check with Biome
npm run lint:fix                # Fix with Biome
npm run format                  # Format all files
npm run format:check            # Check formatting

# MCP Servers (Model Context Protocol)
npm run mcp:validate            # Validate server configs
npm run mcp:build               # Build Docker images
npm run mcp:test                # Test server startup
npm run mcp:all                 # Full validation + build + test

# Cleanup
npm run clean                   # Clean build artifacts
npm run clean:all               # Clean + remove node_modules
```

## Key Files

### Configuration

- `server/package.json`: Root package + workspace definitions
- `.vscode/settings.json`: VS Code editor settings
- `.vscode/settings.json`: VS Code editor settings
- `.vscode/tasks.json`: Task runner definitions
- `.vscode/mcp.json`: MCP server configurations

### Documentation

- `docs/.copilot/`: AI-optimized semantic documentation structure
  - `architecture/`: Multi-tenant and multi-industry concepts
  - `infrastructure/`: DevContainer and development workflow
  - `modernization/`: Technology stack and achievements
  - `getting-started/`: Quick start setup and verification
  - `planning/`: Infrastructure tasks and platform roadmap
- `docs/.copilot/toc.yml`: Semantic table of contents with AI indexing
- `docs/archive/original/`: Archived original documentation (DEVCONTAINER.md, DEVELOPMENT.md, etc.)
- `server/apps/docs/`: VitePress documentation site

### Build Tooling

- `server/packages/config/biome.json`: Biome config
- `server/packages/config/tsconfig.*.json`: TypeScript configs
- `server/apps/web/vite.config.js`: Vite build config
- `server/apps/web/tailwind.config.js`: Tailwind config

## GitHub Copilot Output Guidelines

**CRITICAL**: Do NOT create summary documents, markdown reports, or changelog files unless explicitly requested by the user.

- **Task Output**: Provide only enterprise-focused explicit output for tasks
- **No Summaries**: Never generate summary.md, changes.md, or similar files automatically
- **Concise Responses**: Keep responses brief and actionable
- **Direct Implementation**: Make changes directly without documentation overhead

## GitHub Copilot Tips

- Use **@workspace** to search across entire monorepo
- Reference VS Code schemas in **.vscode/schemas/** directory (use file reference syntax)
- Reference MCP server configs in **.vscode/mcp-servers/** directory (use file reference syntax)
- Reference client configs in **server/clients/** directory (use file reference syntax)
- Mention **"multi-tenant"** for client-specific context
- Mention **"npm workspaces monorepo"** for workspace context
