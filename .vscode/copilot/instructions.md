# GitHub Copilot Workspace Instructions

## Project Context

**React Scuba** is a multi-tenant dive shop management platform built with a modern Turbo monorepo architecture. This workspace provides comprehensive context for GitHub Copilot to assist with development across the entire platform.

## Architecture Overview

### Monorepo Structure

- **Turbo 2.5.8** monorepo orchestration
- **React 19.2 + Vite 7.1.11** frontend (apps/web)
- **Express.js 5.0.0** backend API (apps/api)
- **Multi-tenant content provider** (apps/content)
- **Shared packages** for types, UI components, utilities

### Technology Stack

- **Frontend**: React 19, TypeScript 5.9.3, Tailwind CSS 4, React Router v7
- **Backend**: Express.js 5, PostgreSQL 17, MariaDB 11
- **Build Tools**: Vite 7, Turbo, Biome 2.3.1 (linting)
- **Testing**: Vitest 3.2.4, Playwright 1.56

## Multi-Tenant Architecture

Each client has isolated configuration, theming, and content while sharing the core platform:

```
server/clients/
├── _template/              # Template for new clients
├── di-authority-johannesburg/
└── ocean-spirit-mauritius/
```

### Client Configuration Pattern

```json
{
  "id": "client-id",
  "name": "Client Name",
  "domain": "example.com",
  "theme": { "colors": {...}, "fonts": {...} },
  "features": { "booking": true, "courses": true }
}
```

## Code Standards

### TypeScript

- **Strict mode enabled** (`strict: true`)
- **Path aliases**: `@/*` → `./src/*`
- **Prefer interfaces** over type aliases
- **Explicit types** (avoid `any`)

### React Patterns

- **Functional components** with hooks only
- **Custom hooks** prefixed with `use`
- **Colocation**: Tests next to source files
- **Lazy loading**: `React.lazy()` for routes

### Formatting & Linting

- **Biome-first approach** (replaces ESLint)
- **Line length**: 100 characters
- **Indentation**: 2 spaces (JS/TS), 4 spaces (Python)
- **Auto-sort imports** with Biome

## Development Workflows

### Common Commands

```bash
# Development
npm run dev                     # Start all workspaces
npm run dev --filter=@react-scuba/web  # Specific workspace

# Building
npm run build                   # Build all
npm run build:prod              # Production optimized

# Testing
npm test                        # Unit tests (watch)
npm run test:coverage           # Coverage reports
npx playwright test             # E2E tests

# Linting
npm run lint:fix                # Fix with Biome
npm run format                  # Format all files
```

### File Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Tests**: `*.test.tsx` or `*.spec.tsx`

## Copilot Usage Patterns

### Workspace Context Queries

Use `@workspace` for project-wide understanding:

- `@workspace explain the multi-tenant architecture`
- `@workspace show me the Turbo monorepo structure`
- `@workspace what's the tech stack for React components?`

### Code Generation Patterns

- **Components**: Ask for functional components with TypeScript props
- **Hooks**: Request custom hooks with proper dependency arrays
- **API Routes**: Generate Express.js routes with TypeScript types
- **Tests**: Create Vitest tests with proper mocking patterns

### Best Practices for Prompts

1. **Specify workspace**: Mention which app/package you're working in
2. **Include context**: Reference existing patterns and conventions
3. **Multi-tenant aware**: Consider client-specific requirements
4. **Type safety**: Always request proper TypeScript types

## File Structure Reference

### Frontend (apps/web)

```
src/
├── components/     # Reusable React components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript definitions
└── styles/        # Tailwind CSS customizations
```

### Backend (apps/api)

```
src/
├── routes/        # Express.js route handlers
├── middleware/    # Custom middleware
├── models/        # Database models
├── services/      # Business logic
└── types/         # TypeScript definitions
```

### Shared Packages

- **`@react-scuba/types`**: Shared TypeScript definitions
- **`@react-scuba/ui`**: Reusable React components
- **`@react-scuba/utils`**: Common utilities
- **`@react-scuba/config`**: Build configurations

## Testing Conventions

### Unit Tests (Vitest)

- **Colocated** with source files
- **80%+ coverage** target
- **Mock external dependencies** with `vi.mock()`
- **Test user interactions** with React Testing Library

### E2E Tests (Playwright)

- **User journey scenarios**
- **Multi-tenant flow testing**
- **Cross-browser compatibility**

## AI Toolkit Integration

This workspace includes AI Toolkit for agent development:

- **MCP servers** in `.vscode/mcp-servers/`
- **Python utilities** with UV package manager
- **Docker integration** for MCP server deployment

When working with AI features, use the AI Toolkit best practices and follow the MCP server patterns established in this workspace.
