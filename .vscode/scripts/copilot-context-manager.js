#!/usr/bin/env node
/**
 * Copilot Workspace Context Manager
 * Generates .github/copilot-instructions.md files across the monorepo
 * for enhanced GitHub Copilot workspace agent context awareness
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createFile(file) {
  const fullPath = path.resolve(ROOT_DIR, file.path);
  
  if (fs.existsSync(fullPath)) {
    log(`⚠️  Skipping ${file.path} (already exists)`, colors.yellow);
    return false;
  }

  ensureDir(fullPath);
  fs.writeFileSync(fullPath, file.content, 'utf-8');
  log(`✅ Created ${file.path}`, colors.green);
  return true;
}

// Phase Definitions
const phases = [
  {
    id: 'phase1',
    name: 'Root Instructions',
    dependencies: [],
    files: [
      {
        path: '.github/copilot-instructions.md',
        type: 'instructions',
        content: `# React Scuba - Copilot Workspace Instructions

## Project Overview
React Scuba is a **multi-tenant dive shop management platform** built with a modern npm workspaces monorepo architecture. The platform supports multiple dive shop clients with isolated configurations, theming, and content while sharing a unified codebase.

## Directory Structure
\`\`\`
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
\`\`\`

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
- **Run \`npm run lint:fix\` before committing**

### TypeScript
- **Strict mode enabled** (\`strict: true\`)
- **Module resolution**: Bundler
- **Target**: ES2022
- **Path aliases**: \`@/*\` → \`./src/*\`
- **Use explicit types** (avoid \`any\`)
- **Prefer interfaces** over type aliases for objects

### React Patterns
- **Functional components** with hooks (no class components)
- **TypeScript prop types** (no PropTypes)
- **Custom hooks** for shared logic (prefix with \`use\`)
- **Colocation**: Keep tests next to source files (\`*.test.tsx\`)
- **Lazy loading**: Use \`React.lazy()\` for route components

### File Naming
- **Components**: PascalCase (\`UserProfile.tsx\`)
- **Hooks**: camelCase with \`use\` prefix (\`useAuth.ts\`)
- **Utilities**: camelCase (\`formatDate.ts\`)
- **Types**: PascalCase (\`UserProfile.types.ts\`)
- **Tests**: \`*.test.tsx\` or \`*.spec.tsx\`

## Multi-Tenant Architecture

### Client Configuration
Each client has a config in \`server/clients/{client-id}/config.json\`:
\`\`\`json
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
\`\`\`

### Content Resolution
- **Runtime**: \`@react-scuba/content\` package resolves client from subdomain/domain/env
- **Build**: Vite injects client config at build time (multi-build for production)
- **Assets**: Client-specific images in \`server/clients/{client-id}/images/\`

## Testing Conventions

### Unit Tests (Vitest)
- **Location**: Colocated with source (\`Component.test.tsx\`)
- **Coverage target**: 80%+ (critical paths 100%)
- **Mocking**: Use \`vi.mock()\` for external dependencies
- **Run**: \`npm test\` (watch mode) or \`npm run test:coverage\`

### E2E Tests (Playwright)
- **Location**: \`server/apps/web/tests/e2e/\`
- **Scenarios**: User journeys, multi-tenant flows, critical paths
- **Run**: \`npx playwright test\`

## Common Commands

\`\`\`bash
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
\`\`\`

## Key Files

### Configuration
- \`server/package.json\`: Root package + workspace definitions
- \`.vscode/settings.json\`: VS Code editor settings
- \`.vscode/settings.json\`: VS Code editor settings
- \`.vscode/tasks.json\`: Task runner definitions
- \`.vscode/mcp.json\`: MCP server configurations

### Documentation
- \`DEVELOPMENT.md\`: Development setup guide
- \`IMPLEMENTATION_SUMMARY.md\`: Architecture overview
- \`MULTI_TENANT_ARCHITECTURE.md\`: Multi-tenancy details
- \`server/apps/docs/\`: VitePress documentation site

### Build Tooling
- \`server/packages/config/biome.json\`: Biome config
- \`server/packages/config/tsconfig.*.json\`: TypeScript configs
- \`server/apps/web/vite.config.js\`: Vite build config
- \`server/apps/web/tailwind.config.js\`: Tailwind config

## GitHub Copilot Tips
- Use **@workspace** to search across entire monorepo
- Reference schemas: \`#file:.vscode/schemas/*.json\`
- Check MCP configs: \`#file:.vscode/mcp-servers/*.json\`
- Multi-tenant configs: \`#file:server/clients/*/config.json\`
- Mention **"multi-tenant"** for client-specific context
- Mention **"npm workspaces monorepo"** for workspace context
`,
      },
    ],
  },
  {
    id: 'phase2',
    name: 'Workspace Instructions',
    dependencies: ['phase1'],
    files: [
      {
        path: 'server/apps/web/.github/copilot-instructions.md',
        type: 'instructions',
        content: `# React Scuba Web App - Copilot Instructions

## Workspace: @react-scuba/web

This is the **React 19 frontend application** built with **Vite 7** and **TypeScript**.

## Tech Stack
- **React 19.2** (latest features: automatic batching, transitions, Suspense)
- **Vite 7.1.11** (with @vitejs/plugin-react-swc for faster builds)
- **TypeScript 5.9.3** (strict mode enabled)
- **Tailwind CSS 4** (utility-first CSS framework)
- **React Router v7** (file-based routing with lazy loading)
- **TanStack Query v5** (server state management, caching)
- **Zustand** (lightweight client state management)
- **Framer Motion** (declarative animations)
- **React Hook Form + Zod** (forms with type-safe validation)

## Key Directories
\`\`\`
apps/web/
├── src/
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-based modules
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Third-party integrations
│   ├── pages/             # Route components
│   ├── services/          # API clients (TanStack Query)
│   ├── store/             # Zustand stores
│   ├── styles/            # Global Tailwind imports
│   └── utils/             # Helper functions
├── public/                # Static assets (copied to dist)
├── tests/                 # Vitest + Playwright tests
├── vite.config.js         # Vite build configuration
├── tailwind.config.js     # Tailwind customization
└── tsconfig.json          # TypeScript configuration
\`\`\`

## Code Patterns

### Component Structure
\`\`\`tsx
import { useState } from 'react';
import type { FC } from 'react';

interface MyComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Component logic */}
    </div>
  );
};
\`\`\`

### Custom Hooks
\`\`\`tsx
import { useQuery } from '@tanstack/react-query';

export const useDiveTrips = (clientId: string) => {
  return useQuery({
    queryKey: ['diveTrips', clientId],
    queryFn: () => fetchDiveTrips(clientId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
\`\`\`

### API Integration (TanStack Query)
\`\`\`tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingData) => api.post('/bookings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
\`\`\`

### Multi-Tenant Resolution
\`\`\`tsx
import { useClient } from '@react-scuba/content';

export const HomePage = () => {
  const client = useClient(); // Resolves from subdomain/domain

  return (
    <div style={{ color: client.theme.colors.primary }}>
      <h1>{client.name}</h1>
    </div>
  );
};
\`\`\`

## Testing

### Unit Tests (Vitest + Testing Library)
\`\`\`tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders title correctly', () => {
    render(<MyComponent title="Test Title" onSubmit={() => {}} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
\`\`\`

### E2E Tests (Playwright)
\`\`\`typescript
import { test, expect } from '@playwright/test';

test('user can book a dive trip', async ({ page }) => {
  await page.goto('/trips');
  await page.click('text=Book Now');
  await page.fill('[name="name"]', 'John Doe');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
\`\`\`

## Build & Development

\`\`\`bash
# Development (hot reload)
npm run dev

# Build (production)
npm run build
npm run build:prod        # With optimizations
npm run build:analyze     # With bundle analysis

# Preview production build
npm run preview

# Testing
npm test                  # Vitest watch mode
npm run test:coverage     # Coverage report
npx playwright test       # E2E tests
\`\`\`

## Performance Best Practices
- **Lazy load routes**: Use \`React.lazy()\` for code splitting
- **Memoize expensive computations**: Use \`useMemo\`, \`useCallback\`
- **Optimize images**: Use WebP format, lazy loading
- **Bundle analysis**: Run \`npm run build:analyze\` to check bundle size
- **TanStack Query caching**: Set appropriate \`staleTime\` and \`cacheTime\`

## Common Issues
- **Build fails**: Check TypeScript errors with \`npm run type-check\`
- **Slow dev server**: Clear cache with \`rm -rf node_modules/.vite\`
- **Module not found**: Verify path aliases in \`tsconfig.json\` and \`vite.config.js\`
`,
      },
      {
        path: 'server/apps/api/.github/copilot-instructions.md',
        type: 'instructions',
        content: `# React Scuba API - Copilot Instructions

## Workspace: @react-scuba/api

This is the **Express.js 5 backend API** serving the React Scuba platform.

## Tech Stack
- **Express.js 5.0.0** (Node.js 20.x)
- **PostgreSQL 17** (primary database)
- **MariaDB 11** (legacy client support)
- **Docker Compose** (local development)

## Key Directories
\`\`\`
apps/api/
├── src/
│   ├── routes/           # API route handlers
│   │   ├── bookings.js
│   │   ├── trips.js
│   │   └── users.js
│   ├── db/               # Database clients & migrations
│   │   ├── postgres.js
│   │   ├── mariadb.js
│   │   └── migrations/
│   ├── middleware/       # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
├── tests/                # API tests
└── index.js              # Express app entry point
\`\`\`

## API Patterns

### Route Handler
\`\`\`javascript
import express from 'express';
import { validateBooking } from '../middleware/validation.js';
import { bookingService } from '../services/bookingService.js';

const router = express.Router();

router.post('/bookings', validateBooking, async (req, res, next) => {
  try {
    const booking = await bookingService.create(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

export default router;
\`\`\`

### Database Access
\`\`\`javascript
import { pool } from '../db/postgres.js';

export const bookingService = {
  async create(data) {
    const query = 'INSERT INTO bookings (user_id, trip_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [data.userId, data.tripId]);
    return result.rows[0];
  },
};
\`\`\`

## Testing
\`\`\`bash
npm test                  # Run API tests
npm run test:coverage     # Coverage report
\`\`\`

## Common Commands
\`\`\`bash
npm start                 # Start API server
npm run dev               # Development mode (nodemon)
\`\`\`
`,
      },
      {
        path: 'server/apps/content/.github/copilot-instructions.md',
        type: 'instructions',
        content: `# React Scuba Content Provider - Copilot Instructions

## Workspace: @react-scuba/content

This workspace provides **multi-tenant content resolution** for the React Scuba platform.

## Responsibilities
- **Client config resolution**: Load client config based on subdomain/domain/environment
- **Theme provider**: Inject client-specific theme variables
- **Asset management**: Resolve client-specific images/logos
- **Feature flags**: Control per-client feature availability

## Key Files
\`\`\`
apps/content/
├── src/
│   ├── loaders/          # Client config loaders
│   ├── providers/        # React context providers
│   ├── resolvers/        # Domain/subdomain resolvers
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
└── README.md             # Documentation
\`\`\`

## Usage Example
\`\`\`tsx
import { ClientProvider, useClient } from '@react-scuba/content';

// In your app root
<ClientProvider>
  <App />
</ClientProvider>

// In any component
const MyComponent = () => {
  const client = useClient();
  return <div style={{ color: client.theme.colors.primary }}>{client.name}</div>;
};
\`\`\`

## Client Config Schema
See \`server/clients/_template/config.json\` for the full schema.
`,
      },
      {
        path: 'server/packages/config/.github/copilot-instructions.md',
        type: 'instructions',
        content: `# React Scuba Config Package - Copilot Instructions

## Workspace: @react-scuba/config

This package contains **shared tooling configurations** for the monorepo.

## Configurations
- **biome.json**: Biome linter/formatter config (Rust-based, replaces ESLint)
- **tsconfig.base.json**: Base TypeScript config (extended by all workspaces)
- **tsconfig.node.json**: Node.js TypeScript config
- **tsconfig.react.json**: React TypeScript config

## Usage
Other workspaces extend these configs:
\`\`\`json
{
  "extends": "@react-scuba/config/tsconfig.react.json"
}
\`\`\`

## Standards
- **Line length**: 100 characters
- **Indentation**: 2 spaces
- **Quotes**: Single quotes (JS/TS)
- **TypeScript strict mode**: Enabled
`,
      },
      {
        path: 'server/packages/types/.github/copilot-instructions.md',
        type: 'instructions',
        content: `# React Scuba Types Package - Copilot Instructions

## Workspace: @react-scuba/types

This package contains **shared TypeScript type definitions** used across the monorepo.

## Key Types
- **ClientConfig**: Multi-tenant client configuration
- **BookingData**: Dive trip booking details
- **UserProfile**: User account information
- **TripDetails**: Dive trip metadata

## Usage
\`\`\`typescript
import type { ClientConfig, BookingData } from '@react-scuba/types';
\`\`\`
`,
      },
      {
        path: 'server/packages/ui/.github/copilot-instructions.md',
        type: 'instructions',
        content: `# React Scuba UI Package - Copilot Instructions

## Workspace: @react-scuba/ui

This package contains **shared React components** (design system).

## Components
- **Button**: Primary, secondary, ghost variants
- **Card**: Content containers with shadows
- **Modal**: Overlay dialogs
- **Form**: Input, Select, Checkbox, Radio

## Usage
\`\`\`tsx
import { Button, Card } from '@react-scuba/ui';

<Button variant="primary" onClick={handleClick}>
  Book Now
</Button>
\`\`\`

## Styling
- Uses **Tailwind CSS 4** utility classes
- Theme variables from \`@react-scuba/content\`
`,
      },
      {
        path: 'server/packages/utils/.github/copilot-instructions.md',
        type: 'instructions',
        content: `# React Scuba Utils Package - Copilot Instructions

## Workspace: @react-scuba/utils

This package contains **shared utility functions** (pure JavaScript/TypeScript).

## Utilities
- **formatDate**: Date formatting (locale-aware)
- **calculatePrice**: Price calculations with currency
- **validateEmail**: Email validation
- **generateId**: UUID generation

## Usage
\`\`\`typescript
import { formatDate, calculatePrice } from '@react-scuba/utils';

const formattedDate = formatDate(new Date(), 'en-US');
const totalPrice = calculatePrice(basePrice, taxRate);
\`\`\`
`,
      },
    ],
  },
  {
    id: 'phase3',
    name: 'Copilotignore',
    dependencies: ['phase1'],
    files: [
      {
        path: '.copilotignore',
        type: 'ignore',
        content: `# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.npm
.eslintcache

# Build outputs
dist/
build/
out/
.next/
*.tsbuildinfo
.vite/
.cache/

# Test coverage
coverage/
.nyc_output/
*.lcov
test-results/
playwright-report/
htmlcov/
.coverage
.pytest_cache/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
pip-log.txt
.venv/
venv/
ENV/
.uv/

# Docker
.docker/
docker-compose.override.yml
*.dockerignore

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.md
!.vscode/mcp.json
!.vscode/mcp-servers/
!.vscode/schemas/
!.vscode/scripts/
.idea/
*.swp
*.swo
*~
.DS_Store

# OS
Thumbs.db
Desktop.ini

# Environment
.env
.env.local
.env.*.local
*.key
*.pem

# Logs
logs/
*.log
pids/
*.pid
*.seed

# Databases
*.sqlite
*.sqlite3
*.db
data/postgres/
data/mariadb/
data/redis/
data/ollama-models/

# Client assets (images)
server/clients/*/images/

# Data directories
data/
*.csv
*.json.gz
*.parquet
`,
      },
    ],
  },
];

function executePhase(phaseId) {
  const phase = phases.find((p) => p.id === phaseId);
  
  if (!phase) {
    log(`❌ Phase "${phaseId}" not found`, colors.red);
    process.exit(1);
  }

  log(`\n${colors.bright}📋 Executing Phase: ${phase.name}${colors.reset}\n`);

  let created = 0;
  let skipped = 0;

  for (const file of phase.files) {
    if (createFile(file)) {
      created++;
    } else {
      skipped++;
    }
  }

  log(`\n${colors.bright}Summary:${colors.reset}`);
  log(`✅ Created: ${created}`, colors.green);
  log(`⚠️  Skipped: ${skipped}`, colors.yellow);
  log(`✨ Phase "${phase.name}" complete!\n`, colors.blue);
}

function executeAll() {
  log(`\n${colors.bright}🚀 Executing All Phases${colors.reset}\n`);

  for (const phase of phases) {
    executePhase(phase.id);
  }

  log(`${colors.bright}${colors.green}✨ All phases complete!${colors.reset}\n`);
}

function validateContext() {
  log(`\n${colors.bright}🔍 Validating Copilot Context Files${colors.reset}\n`);

  const instructionFiles = [];
  const ignoreFiles = [];

  function findFiles(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
          findFiles(fullPath);
        } else if (entry.isFile()) {
          if (entry.name === 'copilot-instructions.md') {
            instructionFiles.push(fullPath);
          } else if (entry.name === '.copilotignore') {
            ignoreFiles.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  findFiles(ROOT_DIR);

  log(`${colors.bright}Instruction Files:${colors.reset}`);
  if (instructionFiles.length === 0) {
    log('  None found', colors.yellow);
  } else {
    instructionFiles.forEach((file) => {
      const relativePath = path.relative(ROOT_DIR, file);
      log(`  ✅ ${relativePath}`, colors.green);
    });
  }

  log(`\n${colors.bright}Ignore Files:${colors.reset}`);
  if (ignoreFiles.length === 0) {
    log('  None found', colors.yellow);
  } else {
    ignoreFiles.forEach((file) => {
      const relativePath = path.relative(ROOT_DIR, file);
      log(`  ✅ ${relativePath}`, colors.green);
    });
  }

  log(`\n${colors.bright}Summary:${colors.reset}`);
  log(`📄 Total instruction files: ${instructionFiles.length}`, colors.blue);
  log(`🚫 Total ignore files: ${ignoreFiles.length}`, colors.blue);
  log('');
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'phase1':
    executePhase('phase1');
    break;
  case 'phase2':
    executePhase('phase2');
    break;
  case 'phase3':
    executePhase('phase3');
    break;
  case 'all':
    executeAll();
    break;
  case 'validate':
    validateContext();
    break;
  default:
    log(`\n${colors.bright}Copilot Context Manager${colors.reset}`, colors.blue);
    log('\nUsage:');
    log('  npm run copilot:phase1    - Create root instructions');
    log('  npm run copilot:phase2    - Create workspace instructions');
    log('  npm run copilot:phase3    - Create .copilotignore');
    log('  npm run copilot:all       - Execute all phases');
    log('  npm run copilot:validate  - Validate context files\n');
    process.exit(1);
}

