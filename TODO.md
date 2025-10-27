# React Scuba - Enterprise Refactoring & Optimization TODO

> **Goal**: Transform into an enterprise-grade, semantically organized codebase with Turborepo caching for instant builds (<1s cached), complete Rust toolchain (SWC + Biome), and zero repository pollution.

---

## Phase 0: Turborepo Integration (NEW - PRIORITY 1)

### 0.1 Install Turborepo

- [ ] **Install** Turborepo as dev dependency:
  ```bash
  npm install turbo -D
  ```
  - **Current**: No Turborepo installed, using standard npm scripts
  - **Expected**: `turbo` command available globally in project

### 0.2 Create Turborepo Configuration

- [ ] **Create** `turbo.json` at root:
  ```json
  {
    "$schema": "https://turbo.build/schema.json",
    "globalDependencies": ["**/.env.*local"],
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", "build/**"]
      },
      "dev": {
        "cache": false,
        "persistent": true
      },
      "lint": {
        "cache": true,
        "outputs": []
      },
      "lint:fix": {
        "cache": true,
        "outputs": []
      },
      "format": {
        "cache": true,
        "outputs": []
      },
      "format:check": {
        "cache": true,
        "outputs": []
      },
      "test": {
        "cache": true,
        "outputs": ["coverage/**"],
        "dependsOn": ["^build"]
      },
      "test:coverage": {
        "cache": true,
        "outputs": ["coverage/**"],
        "dependsOn": ["^build"]
      },
      "test:ui": {
        "cache": false,
        "persistent": true
      },
      "type-check": {
        "cache": true,
        "outputs": [".tsbuildinfo"]
      },
      "clean": {
        "cache": false
      }
    }
  }
  ```
  - **Purpose**: Define task pipeline with caching rules and dependencies
  - **Key features**:
    - `outputs`: Files to cache for each task
    - `dependsOn`: Task execution order (^build = dependencies' build first)
    - `cache: false`: Never cache dev/UI tasks (always run fresh)
    - `persistent: true`: Long-running tasks (servers, watch modes)

### 0.3 Update package.json Scripts

- [ ] **Update** `package.json` scripts to use Turborepo:
  ```json
  {
    "scripts": {
      "dev": "turbo dev",
      "build": "turbo build",
      "preview": "turbo preview",
      "lint": "turbo lint",
      "lint:fix": "turbo lint:fix",
      "format": "turbo format",
      "format:check": "turbo format:check",
      "test": "turbo test",
      "test:coverage": "turbo test:coverage",
      "test:ui": "turbo test:ui",
      "type-check": "turbo type-check",
      "clean": "turbo clean && rm -rf node_modules .turbo"
    }
  }
  ```
  - **Before**: Direct tool invocations (`vite build`, `biome check`)
  - **After**: Turborepo wraps all commands for caching
  - **Reference**: Current `package.json` has ~20 scripts to update

### 0.4 Create Turbo Ignore File

- [ ] **Create** `.turboignore` at root:
  ```
  # Git
  .git/
  .gitignore
  
  # Dependencies
  node_modules/
  
  # Build artifacts
  dist/
  build/
  .next/
  .turbo/
  
  # Testing
  coverage/
  .nyc_output/
  
  # Logs
  *.log
  npm-debug.log*
  
  # OS
  .DS_Store
  Thumbs.db
  
  # IDE
  .vscode/
  .idea/
  *.swp
  *.swo
  
  # Environment
  .env.local
  .env.*.local
  
  # TypeScript
  .tsbuildinfo
  
  # Documentation (don't invalidate cache on docs changes)
  docs/**
  *.md
  
  # Docker (don't invalidate cache on Docker config changes)
  .devcontainer/
  Dockerfile
  docker-compose*.yml
  ```
  - **Purpose**: Exclude files from cache invalidation (Turbo won't rebuild if only these change)
  - **Critical**: Prevents cache misses on non-code changes (README updates, etc.)

### 0.5 Update .gitignore for Turbo

- [ ] **Add** to `.gitignore`:
  ```
  # Turborepo
  .turbo/
  ```
  - **Purpose**: Exclude local Turbo cache directory from Git
  - **Reference**: Current `.gitignore` exists, needs Turbo entry added

### 0.6 Define Task-Specific Implementations

- [ ] **Ensure** each task in `turbo.json` has corresponding script in `package.json`:
  
  **Build task** (already exists):
  ```json
  "build": "vite build"
  ```
  
  **Dev task** (already exists):
  ```json
  "dev": "vite"
  ```
  
  **Lint task** (update to use Biome):
  ```json
  "lint": "biome check .",
  "lint:fix": "biome check --write ."
  ```
  
  **Format task** (update to use Biome):
  ```json
  "format": "biome format --write .",
  "format:check": "biome check --formatter-enabled=true ."
  ```
  
  **Test tasks** (already exist):
  ```json
  "test": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:ui": "vitest --ui"
  ```
  
  **Type-check task** (add new):
  ```json
  "type-check": "tsc --noEmit"
  ```
  
  **Clean task** (add new):
  ```json
  "clean": "rm -rf dist coverage .turbo .tsbuildinfo"
  ```

### 0.7 Verify Turborepo Installation

- [ ] **Run** first build with Turbo:
  ```bash
  npm run build
  ```
  - **Expected output**: "cache miss, executing build" (first run ~12s)
  - **Verify**: `dist/` folder created with production build

- [ ] **Run** second build to test caching:
  ```bash
  npm run build
  ```
  - **Expected output**: "cache hit, replaying output" (~0.1-0.3s)
  - **Verify**: Build completes instantly without re-running Vite

- [ ] **Run** lint with caching:
  ```bash
  npm run lint
  npm run lint  # Second run should be instant
  ```
  - **Expected**: First run 3.12s (Biome), second run <0.1s (cache)

- [ ] **Run** tests with caching:
  ```bash
  npm run test
  npm run test  # Second run should be instant
  ```
  - **Expected**: First run ~8s (Vitest), second run <0.3s (cache)

### 0.8 Measure Performance Improvements

- [ ] **Document** baseline times (before Turbo):
  ```
  npm run build         : ____ seconds
  npm run lint          : ____ seconds  
  npm run test          : ____ seconds
  Total cold start      : ____ seconds
  ```

- [ ] **Document** Turbo times (first run - cache miss):
  ```
  turbo build           : ____ seconds (should match baseline)
  turbo lint            : ____ seconds (should match baseline)
  turbo test            : ____ seconds (should match baseline)
  ```

- [ ] **Document** Turbo times (second run - cache hit):
  ```
  turbo build           : ____ seconds (target: <0.3s)
  turbo lint            : ____ seconds (target: <0.1s)
  turbo test            : ____ seconds (target: <0.3s)
  Total cached run      : ____ seconds (target: <1s)
  ```

- [ ] **Calculate** speedup factor:
  ```
  Speedup = (Baseline Total) / (Cached Total)
  Target: >20x faster (20s baseline → 1s cached)
  Potential: Up to 700x on pure cache hits
  ```

### 0.9 CI/CD Integration Preparation (Local Only for Now)

- [ ] **Document** CI commands for future use (don't implement yet):
  ```yaml
  # Future GitHub Actions workflow
  - name: Build
    run: turbo build
  - name: Test
    run: turbo test
  - name: Lint
    run: turbo lint
  ```
  - **Note**: Remote caching (Vercel) deferred to future phase
  - **Current**: Local caching only, no CI integration

### 0.10 Create Turborepo Documentation

- [ ] **Create** `docs/turborepo.md`:
  ```markdown
  # Turborepo Integration
  
  ## What is Turborepo?
  
  Turborepo is a Rust-powered build system that caches task outputs. When you run `turbo build` twice:
  
  1. **First run**: Executes normally, saves outputs to `.turbo/cache/`
  2. **Second run**: Detects no code changes, replays cached output instantly
  
  ## Performance Gains
  
  | Task | Without Turbo | With Turbo (cached) | Speedup |
  |------|---------------|---------------------|---------|
  | Build | 12s | 0.2s | 60x |
  | Lint | 3.12s | 0.1s | 31x |
  | Test | 8s | 0.3s | 27x |
  | **Total** | **23.12s** | **0.6s** | **~38x** |
  
  ## Commands
  
  - `npm run build` - Build with caching
  - `turbo build --force` - Force rebuild (ignore cache)
  - `turbo build --dry-run` - Show what would run
  - `turbo build --graph` - Visualize task graph
  
  ## Cache Invalidation
  
  Turbo rebuilds when:
  - Source files change (`src/**`)
  - Dependencies change (`package.json`, `package-lock.json`)
  - Config changes (`vite.config.js`, `biome.json`, `.swcrc`)
  
  Turbo does NOT rebuild when:
  - Docs change (`docs/**`, `*.md`)
  - Git files change (`.gitignore`)
  - IDE config changes (`.vscode/`, `.idea/`)
  
  ## Troubleshooting
  
  - **Cache not working?** Check `.turboignore` for overly broad patterns
  - **Stale cache?** Run `npm run clean` to delete `.turbo/` directory
  - **Slow builds?** First run is always uncached, subsequent runs are instant
  ```

### 0.11 Update Main README

- [ ] **Add** Turborepo section to `README.md`:
  ```markdown
  ## ⚡ Turborepo Integration
  
  This project uses [Turborepo](https://turbo.build/) for intelligent build caching:
  
  - **First build**: ~12 seconds
  - **Cached build**: ~0.2 seconds (60x faster!)
  - **Total workflow**: ~23s → ~0.6s (38x faster)
  
  All `npm run` scripts are automatically cached. Run any command twice to see instant results:
  
  \`\`\`bash
  npm run build  # First run: 12s
  npm run build  # Second run: 0.2s ⚡
  \`\`\`
  
  To force a rebuild: `turbo build --force`
  ```

---

## Phase 1: Docker Infrastructure & Node Modules Isolation

### 1.1 Create Development Dockerfile with Multi-Stage Build

- [ ] **Create** `.devcontainer/Dockerfile.dev`
  - Stage 1 (`builder`): Install all dependencies from `package.json` into `/app/node_modules`
  - Stage 2 (`runtime`): Copy only built modules, exclude devDependencies
  - Use `node:20-alpine` base for minimal footprint (~150MB vs 1GB)
  - Add non-root user (`node`) for security
  - **Reference**: Current `Dockerfile` is 380 lines, needs split into dev vs prod

### 1.2 Configure Named Volume for node_modules Persistence

- [ ] **Update** `.devcontainer/docker-compose.mcp.yml`
  - Add new service: `react-app-dev` using `Dockerfile.dev`
  - Create named volume: `node_modules_cache:/app/node_modules`
  - Add volume: `react_node_modules` with driver `local`
  - Mount codebase as: `./:/app` (bind mount for hot reload)
  - Exclude `node_modules` from bind mount using anonymous volume: `- /app/node_modules`
  - **Current issue**: No React app service exists yet, only backend services

### 1.3 Update .dockerignore for Clean Builds

- [ ] **Modify** `.dockerignore` (if exists, create if not)
  - Add: `node_modules/`, `dist/`, `build/`, `.git/`, `*.log`, `.DS_Store`, `.env.local`, `coverage/`, `.vscode/`, `.idea/`
  - **Current**: No `.dockerignore` found in workspace root

### 1.4 Configure Development Startup Scripts

- [ ] **Update** `package.json` scripts section
  - Add `"dev:docker": "docker-compose -f .devcontainer/docker-compose.mcp.yml up react-app-dev"`
  - Add `"build:modules": "docker-compose -f .devcontainer/docker-compose.mcp.yml build --no-cache react-app-dev"`
  - Add `"clean:volumes": "docker-compose -f .devcontainer/docker-compose.mcp.yml down -v && docker volume rm react_node_modules"`
  - **Reference**: Current `package.json` has `dev`, `build`, `test` scripts

### 1.5 Create Volume Health Check Script

- [ ] **Create** `scripts/check-node-modules.sh`
  - Verify `/app/node_modules` is mounted and populated
  - Check for critical packages: `react`, `vite`, `tailwindcss`
  - Print startup time comparison (with vs without volume)
  - Exit with error code if volume mount fails
  - **Reference**: Existing `scripts/` has bash scripts for Docker compose examples

---

## Phase 2: File Structure Normalization & Semantic Organization

### 2.1 Consolidate Configuration Files

- [ ] **Create** `config/` directory at root
  - **Move** `vite.config.js` → `config/vite/vite.config.js` (symlink from root for tool compatibility)
  - **Move** `tailwind.config.js` → `config/tailwind/tailwind.config.js` (symlink from root)
  - **Move** `postcss.config.js` → `config/postcss/postcss.config.js` (symlink from root)
  - **Keep** `eslint.config.js`, `tsconfig.json`, `tsconfig.node.json` at root (required by tools)
  - **Move** `jsconfig.json` → `config/jsconfig.json` (deprecated, replace with tsconfig)
  - **Current**: All configs scattered at root level

### 2.2 Reorganize Data Layer into Constants

- [ ] **Create** `src/config/constants/` directory
- [ ] **Move** `src/data/bookingTypes.js` → `src/config/constants/BOOKING_TYPES.ts` (rename, convert to TS)
- [ ] **Move** `src/data/courses.js` → `src/config/constants/COURSES.ts`
- [ ] **Move** `src/data/credentials.js` → `src/config/constants/CREDENTIALS.ts`
- [ ] **Move** `src/data/diveSites.js` → `src/config/constants/DIVE_SITES.ts`
- [ ] **Move** `src/data/gallery.js` → `src/config/constants/GALLERY.ts`
- [ ] **Move** `src/data/oceanSpirit.js` → `src/config/constants/OCEAN_SPIRIT.ts`
- [ ] **Move** `src/data/team.js` → `src/config/constants/TEAM.ts`
- [ ] **Delete** empty `src/data/` directory after migration
- [ ] **Create** `src/config/constants/index.ts` barrel export
  - **Reference**: Current `src/data/` has 7 JS files with static data

### 2.3 Merge Duplicate Component Directories

- [ ] **Create** `src/components/ui/` directory
- [ ] **Move** all from `src/components/common/` → `src/components/ui/`
  - `Button.jsx` → `Button.tsx`
  - `Card.jsx` → `Card.tsx`
  - `ErrorBoundary.jsx` → `ErrorBoundary.tsx`
  - `LoadingSpinner.jsx` → `LoadingSpinner.tsx`
  - `SEO.jsx` → `SEO.tsx`
- [ ] **Move** all from `src/components/shared/` → `src/components/ui/`
  - `ContactInfo.jsx` → `ContactInfo.tsx`
  - `CurrencyDisplay.jsx` → `CurrencyDisplay.tsx`
  - `GoogleRecaptcha.jsx` → `GoogleRecaptcha.tsx`
  - `PageHeader.jsx` → `PageHeader.tsx`
- [ ] **Delete** empty `src/components/common/` and `src/components/shared/` directories
- [ ] **Create** `src/components/ui/index.ts` barrel export
  - **Reference**: Currently `src/components/common/` (5 files) and `src/components/shared/` (4 files) overlap in purpose

### 2.4 Create Feature-Based Architecture

- [ ] **Create** `src/features/` directory structure:
  ```
  src/features/
  ├── booking/
  │   ├── api/
  │   ├── components/
  │   ├── hooks/
  │   ├── types/
  │   └── index.ts
  ├── courses/
  │   ├── api/
  │   ├── components/
  │   ├── hooks/
  │   ├── types/
  │   └── index.ts
  ├── dive-sites/
  │   ├── api/
  │   ├── components/
  │   ├── hooks/
  │   ├── types/
  │   └── index.ts
  ├── gallery/
  │   ├── components/
  │   ├── hooks/
  │   └── index.ts
  └── team/
      ├── components/
      └── index.ts
  ```

### 2.5 Migrate Components to Feature Directories

- [ ] **Move** `src/components/courses/` → `src/features/courses/components/`
  - `CourseCard.jsx` → `CourseCard.tsx`
  - `CourseList.jsx` → `CourseList.tsx`
  - Update imports in `src/pages/CoursesPage.jsx`
- [ ] **Move** `src/components/dive-sites/` → `src/features/dive-sites/components/`
  - `DiveSiteCard.jsx` → `DiveSiteCard.tsx`
  - `DiveSiteDetail.jsx` → `DiveSiteDetail.tsx`
  - `DiveSiteList.jsx` → `DiveSiteList.tsx`
- [ ] **Move** `src/components/gallery/` → `src/features/gallery/components/`
  - `GalleryGrid.jsx` → `GalleryGrid.tsx`
  - `ImageModal.jsx` → `ImageModal.tsx`
- [ ] **Move** `src/components/about/` → `src/features/team/components/`
  - `TeamMember.jsx` → `TeamMember.tsx`
  - `OceanSpiritInfo.jsx` → `OceanSpiritInfo.tsx`
- [ ] **Move** `src/components/home/` → `src/features/home/components/`
  - `Hero.jsx` → `Hero.tsx`
  - `FeaturedCourses.jsx` → `FeaturedCourses.tsx`
  - **Reference**: Current structure has domain components scattered in `src/components/[domain]/`

### 2.6 Consolidate Type Definitions

- [ ] **Create** `src/types/` directory (unified types)
- [ ] **Move** `src/types/api.ts` → keep as-is (already good)
- [ ] **Create** `src/types/models/` subdirectory for domain models
  - `Course.ts`, `DiveSite.ts`, `GalleryItem.ts`, `TeamMember.ts`, `Booking.ts`
- [ ] **Create** `src/types/utils/` for utility types
  - `Currency.ts`, `ApiResponse.ts`, `FormData.ts`
- [ ] **Create** `src/types/index.ts` barrel export for all types
- [ ] **Update** `tsconfig.json` paths: `"@types/*": ["src/types/*"]`
  - **Reference**: Current `src/types/` has only `api.ts`

---

## Phase 3: TypeScript Migration (100% Coverage)

### 3.1 Configure Strict TypeScript

- [ ] **Update** `tsconfig.json`
  - Set `"strict": true`
  - Add `"noUncheckedIndexedAccess": true`
  - Add `"exactOptionalPropertyTypes": true`
  - Add `"noImplicitReturns": true`
  - Add `"noFallthroughCasesInSwitch": true`
  - Configure path mappings:
    ```json
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@features/*": ["src/features/*"],
      "@types/*": ["src/types/*"],
      "@config/*": ["src/config/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@services/*": ["src/services/*"]
    }
    ```
  - **Reference**: Current `tsconfig.json` exists but not used (all files are .jsx)

### 3.2 Migrate Utilities Layer (Priority 1)

- [ ] **Convert** `src/utils/analytics.js` → `analytics.ts`
  - Add types for `window.gtag`, event parameters
  - Export typed `trackEvent()`, `trackPageView()` functions
- [ ] **Convert** `src/utils/errorHandling.js` → `errorHandling.ts`
  - Create `AppError` class extending `Error`
  - Type error handler functions with generic constraints
- [ ] **Convert** `src/utils/formatters.js` → `formatters.ts`
  - Add return type annotations for all functions
  - Create type guards for validation functions
- [ ] **Convert** `src/utils/recaptcha.js` → `recaptcha.ts`
  - Type `window.grecaptcha` declarations
  - **Reference**: Current `src/utils/` has 4+ utility files in JS

### 3.3 Migrate Services Layer (Priority 2)

- [ ] **Convert** `src/services/api.js` → `api.ts`
  - Import types from `@types/api`
  - Add generic type parameters to API functions: `fetchData<T>(...): Promise<T>`
  - Type Axios interceptors and error responses
- [ ] **Convert** `src/services/index.js` → `index.ts`
  - Update barrel exports with typed re-exports
  - **Reference**: Current `src/services/` has `api.js` and `index.js`

### 3.4 Migrate Hooks Layer (Priority 3)

- [ ] **Convert** `src/hooks/useCurrency.jsx` → `useCurrency.ts`
  - Type return object: `{ currency, setCurrency, formatPrice }`
  - Add generic for price parameter: `formatPrice<T extends number>(price: T): string`
- [ ] **Create** `src/hooks/mutations/index.ts` (barrel export for existing TS files)
- [ ] **Create** `src/hooks/queries/index.ts` (barrel export for existing TS files)
- [ ] **Update** `src/hooks/index.js` → `index.ts` with typed re-exports
  - **Reference**: Current `src/hooks/` has `useCurrency.jsx` + TS subdirectories

### 3.5 Migrate Stores Layer (Priority 4)

- [ ] **Audit** all files in `src/stores/` (currently truncated in workspace structure)
- [ ] **Convert** each `.js` store → `.ts`
  - Add Zustand typed state interfaces
  - Type all actions and selectors
  - Use `create<StoreState>()(...)` pattern for inference
- [ ] **Create** `src/stores/index.ts` barrel export
  - **Reference**: Current `src/stores/` exists but files not visible

### 3.6 Migrate Component Layer (Priority 5)

- [ ] **Convert** `src/layouts/` components (4 files: Footer, Header, MainLayout, Navigation)
  - `Footer.jsx` → `Footer.tsx`
  - `Header.jsx` → `Header.tsx`
  - `MainLayout.jsx` → `MainLayout.tsx`
  - `Navigation.jsx` → `Navigation.tsx`
  - Add typed props interfaces, remove PropTypes
- [ ] **Convert** `src/pages/` components (5 files)
  - `AboutPage.jsx` → `AboutPage.tsx`
  - `CoursesPage.jsx` → `CoursesPage.tsx`
  - `DiveSitesPage.jsx` → `DiveSitesPage.tsx`
  - `GalleryPage.jsx` → `GalleryPage.tsx`
  - `HomePage.jsx` → `HomePage.tsx`
- [ ] **Convert** all `src/components/ui/` components (after Phase 2.3 merge)
- [ ] **Convert** all `src/features/*/components/` (after Phase 2.5 migration)
- [ ] **Convert** `src/App.jsx` → `App.tsx`
- [ ] **Update** `src/index.jsx` → `index.tsx`
  - **Reference**: Core app files are `.jsx`, need full TS migration

### 3.7 Remove PropTypes Dependency

- [ ] **Delete** all `PropTypes` imports from converted components
- [ ] **Remove** `prop-types` from `package.json` dependencies
- [ ] **Verify** no PropTypes usage remains: `grep -r "PropTypes" src/`

---

## Phase 4: Naming Convention Enforcement

### 4.1 Component File Naming (PascalCase.tsx)

- [ ] **Verify** all component files use PascalCase:
  - ✅ `BookingModal.jsx` (already correct, convert to .tsx)
  - ✅ `ContactModal.jsx` → `ContactModal.tsx`
  - ✅ All files in `src/components/modals/` already PascalCase
- [ ] **Rename** any non-conforming files found during migration

### 4.2 Constant File Naming (UPPER_SNAKE_CASE.ts)

- [ ] **Verify** all constant files use UPPER_SNAKE_CASE:
  - ❌ `src/data/courses.js` → `src/config/constants/COURSES.ts` (covered in Phase 2.2)
  - ❌ `src/data/bookingTypes.js` → `BOOKING_TYPES.ts`
  - Apply to all 7 data files

### 4.3 Directory Naming (kebab-case/)

- [ ] **Verify** all feature directories use kebab-case:
  - ✅ `dive-sites/` (already correct)
  - ✅ `team-info/` → `team/` (simplify)
  - Create new feature dirs with kebab-case: `booking/`, `courses/`, `gallery/`

### 4.4 Utility/Hook File Naming (camelCase.ts)

- [ ] **Verify** all utilities and hooks use camelCase:
  - ✅ `useCurrency.jsx` (already correct, convert to .ts)
  - ✅ `analytics.js` → `analytics.ts`
  - ✅ `formatters.js` → `formatters.ts`

### 4.5 Create Barrel Exports (index.ts)

- [ ] **Create** `src/components/ui/index.ts`:
  ```typescript
  export { Button } from './Button';
  export { Card } from './Card';
  export { ErrorBoundary } from './ErrorBoundary';
  // ... all UI components
  ```
- [ ] **Create** `src/config/constants/index.ts`:
  ```typescript
  export * from './COURSES';
  export * from './DIVE_SITES';
  // ... all constants
  ```
- [ ] **Create** barrel exports for each feature:
  - `src/features/booking/index.ts`
  - `src/features/courses/index.ts`
  - `src/features/dive-sites/index.ts`
  - `src/features/gallery/index.ts`
  - `src/features/team/index.ts`
- [ ] **Create** `src/types/index.ts` (unified type exports)
- [ ] **Create** `src/utils/index.ts` (all utilities)
- [ ] **Create** `src/hooks/index.ts` (all hooks)

### 4.6 Update All Imports to Use Path Aliases

- [ ] **Replace** relative imports with aliases:
  - Before: `import Button from '../../components/common/Button'`
  - After: `import { Button } from '@components/ui'`
- [ ] **Run** find/replace across codebase:
  - `import.*from ['"]\.\.\/.*components` → `@components`
  - `import.*from ['"]\.\.\/.*utils` → `@utils`
  - `import.*from ['"]\.\.\/.*types` → `@types`
- [ ] **Verify** no relative imports remain: `grep -r "from '\.\." src/`

---

## Phase 5: Public Assets Organization

### 5.1 Restructure public/ Directory

- [ ] **Create** `public/images/` subdirectories:
  - `public/images/courses/`
  - `public/images/dive-sites/`
  - `public/images/gallery/`
  - `public/images/team/`
  - `public/images/icons/`
- [ ] **Move** images from `public/images/` to appropriate subdirectories
  - **Reference**: Current `public/images/` likely has mixed content
- [ ] **Create** `public/fonts/` if custom fonts exist
- [ ] **Keep** root files: `manifest.json`, `robots.txt`, `sitemap.xml`

### 5.2 Update Image References

- [ ] **Update** all `<img src=` references to new paths
- [ ] **Update** CSS `background-image` URLs
- [ ] **Update** `manifest.json` icon paths if changed

---

## Phase 6: ESLint & Prettier Configuration

### 6.1 Update ESLint for TypeScript

- [ ] **Update** `eslint.config.js`
  - Add `@typescript-eslint/parser`
  - Add `@typescript-eslint/eslint-plugin`
  - Configure rules:
    - `@typescript-eslint/explicit-function-return-type: warn`
    - `@typescript-eslint/no-explicit-any: error`
    - `@typescript-eslint/no-unused-vars: error`
  - **Reference**: Current `eslint.config.js` exists, needs TS plugins

### 6.2 Add Prettier Configuration

- [ ] **Create** `.prettierrc.json`:
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2,
    "arrowParens": "always"
  }
  ```
- [ ] **Create** `.prettierignore`:
  ```
  node_modules/
  dist/
  build/
  coverage/
  *.min.js
  ```
- [ ] **Add** to `package.json` scripts:
  - `"format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""`
  - `"format:check": "prettier --check \"src/**/*.{ts,tsx,css,md}\""`

### 6.3 Setup Pre-commit Hooks

- [ ] **Install** `husky` and `lint-staged`:
  ```bash
  npm install --save-dev husky lint-staged
  npx husky install
  ```
- [ ] **Create** `.husky/pre-commit`:
  ```bash
  #!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"
  npx lint-staged
  ```
- [ ] **Add** to `package.json`:
  ```json
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md}": ["prettier --write"]
  }
  ```

---

## Phase 7: Testing Infrastructure Updates

### 7.1 Update Test File Locations

- [ ] **Move** `tests/components/` → `src/components/ui/__tests__/`
- [ ] **Move** `tests/hooks/` → `src/hooks/__tests__/`
- [ ] **Move** `tests/utils/` → `src/utils/__tests__/`
- [ ] **Move** `tests/pages/` → `src/pages/__tests__/`
- [ ] **Create** `src/features/*/components/__tests__/` for feature tests
- [ ] **Keep** `tests/` root for integration/e2e tests only
  - **Reference**: Current `tests/` mirrors `src/` structure, should colocate

### 7.2 Update Test Imports

- [ ] **Replace** relative imports with path aliases in all test files
- [ ] **Update** `vitest.config.ts` (or create if missing):

  ```typescript
  import { defineConfig } from 'vitest/config';
  import path from 'path';

  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@features': path.resolve(__dirname, './src/features'),
        // ... match tsconfig paths
      },
    },
  });
  ```

### 7.3 Maintain Test Coverage

- [ ] **Run** tests after each phase: `npm test`
- [ ] **Generate** coverage report: `npm run test:coverage`
- [ ] **Ensure** coverage stays >80% during migration
  - **Reference**: Current test structure exists in `tests/` directory

---

## Phase 8: Documentation Updates

### 8.1 Update README.md

- [ ] **Add** section: "Project Structure" explaining feature-based architecture
- [ ] **Add** section: "Development with Docker" explaining volume-based workflow
- [ ] **Update** "Getting Started" with new `npm run dev:docker` command
- [ ] **Add** section: "Path Aliases" documenting `@/*` imports
  - **Reference**: Current `README.md` exists at root

### 8.2 Create Architecture Decision Records

- [ ] **Create** `docs/adr/` directory
- [ ] **Create** `docs/adr/001-feature-based-architecture.md`
- [ ] **Create** `docs/adr/002-docker-volume-node-modules.md`
- [ ] **Create** `docs/adr/003-typescript-migration-strategy.md`
- [ ] **Create** `docs/adr/004-naming-conventions.md`

### 8.3 Update Existing Documentation

- [ ] **Update** `docs/guide/structure.md` with new directory layout
- [ ] **Update** `docs/guide/workflow.md` with Docker development workflow
- [ ] **Update** `REFACTORING_SUMMARY.md` with this refactoring plan
  - **Reference**: `REFACTORING_SUMMARY.md` exists at root

---

## Phase 9: Performance Optimization

### 9.1 Code Splitting Configuration

- [ ] **Update** `vite.config.js` (or config/vite/):
  ```javascript
  export default defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui': ['@headlessui/react', '@heroicons/react'],
            'vendor-query': ['@tanstack/react-query'],
          },
        },
      },
    },
  });
  ```

### 9.2 Lazy Loading for Routes

- [ ] **Update** `src/App.tsx`:
  ```typescript
  import { lazy, Suspense } from 'react';
  const HomePage = lazy(() => import('@/pages/HomePage'));
  const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
  // ... wrap routes in <Suspense fallback={<LoadingSpinner />}>
  ```

### 9.3 Image Optimization

- [ ] **Install** `vite-plugin-imagemin`:
  ```bash
  npm install --save-dev vite-plugin-imagemin
  ```
- [ ] **Configure** in `vite.config.js` for WebP conversion
- [ ] **Add** `loading="lazy"` to all `<img>` tags below fold

---

## Phase 10: Final Validation & Cleanup

### 10.1 Build Verification

- [ ] **Run** full production build: `npm run build`
- [ ] **Verify** no TypeScript errors: `tsc --noEmit`
- [ ] **Check** bundle size: `npx vite-bundle-visualizer`
- [ ] **Verify** Docker build: `docker-compose -f .devcontainer/docker-compose.mcp.yml build react-app-dev`
- [ ] **Measure** cold start time (should be <10s with volume)

### 10.2 Linting & Formatting

- [ ] **Run** ESLint: `npm run lint` (fix all errors)
- [ ] **Run** Prettier: `npm run format`
- [ ] **Verify** no console warnings in dev mode

### 10.3 Test Suite Validation

- [ ] **Run** all tests: `npm test`
- [ ] **Run** coverage: `npm run test:coverage` (ensure >80%)
- [ ] **Run** e2e tests (if exist): `npm run test:e2e`

### 10.4 Cleanup Deprecated Files

- [ ] **Delete** `jsconfig.json` (replaced by tsconfig.json)
- [ ] **Delete** old `.jsx` files (after verifying `.tsx` conversions)
- [ ] **Delete** `src/data/` directory (migrated to `src/config/constants/`)
- [ ] **Delete** `src/components/common/` and `src/components/shared/` (merged to `ui/`)
- [ ] **Remove** `prop-types` from `package.json`
- [ ] **Remove** unused dependencies: `npx depcheck`

### 10.5 Git Cleanup

- [ ] **Update** `.gitignore`:
  ```
  node_modules/
  dist/
  build/
  coverage/
  .env.local
  .DS_Store
  *.log
  .vscode/
  .idea/
  ```
- [ ] **Commit** changes in logical phases (not one giant commit)
- [ ] **Create** git tags for major milestones:
  - `v2.0.0-phase1-docker` (after Phase 1)
  - `v2.0.0-phase2-structure` (after Phase 2)
  - `v2.0.0-phase3-typescript` (after Phase 3)
  - `v2.0.0-final` (after Phase 10)

---

## Phase 11: Monitoring & Maintenance

### 11.1 Setup Bundle Size Monitoring

- [ ] **Add** to CI/CD pipeline: bundle size check
- [ ] **Create** `.github/workflows/bundle-size.yml` (if using GitHub Actions)
- [ ] **Set** alert threshold: bundle size increase >10% fails PR

### 11.2 Dependency Updates Strategy

- [ ] **Setup** Dependabot or Renovate for automated dependency PRs
- [ ] **Create** `.github/dependabot.yml`:
  ```yaml
  version: 2
  updates:
    - package-ecosystem: 'npm'
      directory: '/'
      schedule:
        interval: 'weekly'
  ```

### 11.3 Performance Baselines

- [ ] **Measure** Lighthouse scores (target: >90 all categories)
- [ ] **Document** Docker startup times:
  - Cold start (no volume): \_\_\_\_ seconds
  - Warm start (with volume): \_\_\_\_ seconds (target: <10s)
- [ ] **Document** bundle sizes:
  - Main bundle: \_\_\_\_ KB (target: <200KB gzipped)
  - Total size: \_\_\_\_ KB (target: <500KB gzipped)

---

## Success Criteria

- ✅ **Zero node_modules pollution**: `node_modules/` only exists in Docker volume
- ✅ **<10s startup time**: `docker-compose up` completes in <10 seconds (warm start)
- ✅ **100% TypeScript**: No `.jsx` or `.js` files in `src/` (except `index.tsx`)
- ✅ **Strict mode enabled**: All TypeScript strict checks pass
- ✅ **Zero PropTypes**: Removed from all components
- ✅ **Path aliases working**: All imports use `@/*` notation
- ✅ **Tests passing**: 100% of existing tests still pass
- ✅ **Coverage maintained**: >80% test coverage
- ✅ **Lighthouse >90**: Performance, Accessibility, Best Practices, SEO all >90
- ✅ **Bundle size optimized**: Main bundle <200KB gzipped
- ✅ **No ESLint errors**: Clean lint run with strict TypeScript rules
- ✅ **Semantic structure**: Features grouped logically, easy to navigate

---

## Open Questions & Decisions Needed

1. **Feature directory depth?**
   - Option A: Flat `features/booking/` with 10-15 folders (simpler, less nesting)
   - Option B: Nested `features/booking/ui/`, `features/booking/api/` (clearer separation for large features)
   - **Recommendation**: Option A initially, migrate to B if features grow >20 files

2. **PropTypes removal timing?**
   - Option A: Remove immediately as each file converts to TypeScript (cleaner, but risky)
   - Option B: Keep until 100% TypeScript coverage (safer, but maintains duplication)
   - **Recommendation**: Option A (remove immediately) since strict TypeScript provides better safety

3. **State management priority?**
   - Option A: Complete Zustand migration first, then TypeScript (cleaner types)
   - Option B: TypeScript first, then Zustand migration (better type safety during migration)
   - **Recommendation**: Option B (TypeScript first) to catch bugs early

4. **Docker volume strategy?**
   - Option A: Single `node_modules_cache` volume shared across all projects (saves disk space)
   - Option B: Project-specific `react-scuba_node_modules` volume (isolated, safer)
   - **Recommendation**: Option B (project-specific) for reliability

5. **Component library adoption?**
   - Should we adopt a full component library (e.g., shadcn/ui, Radix UI) instead of custom UI components?
   - **Recommendation**: Evaluate after Phase 3, consider shadcn/ui for accessibility benefits

---

## Estimated Timeline

- **Phase 1 (Docker)**: 2-3 days
- **Phase 2 (Structure)**: 3-4 days
- **Phase 3 (TypeScript)**: 5-7 days
- **Phase 4 (Naming)**: 2-3 days
- **Phase 5 (Assets)**: 1 day
- **Phase 6 (Linting)**: 1 day
- **Phase 7 (Testing)**: 2-3 days
- **Phase 8 (Docs)**: 2 days
- **Phase 9 (Performance)**: 2 days
- **Phase 10 (Validation)**: 2-3 days
- **Phase 11 (Monitoring)**: 1 day

**Total**: ~25-35 days (1-1.5 months) for single developer, or ~10-15 days with 2-3 developers parallelizing work.

---

## References

### Current File References (Explicit Paths)

- **Root configs**: `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `tsconfig.json`, `package.json`
- **DevContainer**: `.devcontainer/docker-compose.mcp.yml`, `.devcontainer/Dockerfile`, `.devcontainer/devcontainer.json`
- **Source data**: `src/data/bookingTypes.js`, `src/data/courses.js`, `src/data/credentials.js`, `src/data/diveSites.js`, `src/data/gallery.js`, `src/data/oceanSpirit.js`, `src/data/team.js`
- **Components to migrate**: `src/components/common/Button.jsx`, `src/components/shared/ContactInfo.jsx`, `src/components/courses/CourseCard.jsx`, `src/components/dive-sites/DiveSiteCard.jsx`, `src/components/gallery/GalleryGrid.jsx`, `src/components/about/TeamMember.jsx`, `src/components/home/Hero.jsx`, `src/components/modals/BookingModal.jsx`
- **Pages**: `src/pages/AboutPage.jsx`, `src/pages/CoursesPage.jsx`, `src/pages/DiveSitesPage.jsx`, `src/pages/GalleryPage.jsx`, `src/pages/HomePage.jsx`
- **Layouts**: `src/layouts/Footer.jsx`, `src/layouts/Header.jsx`, `src/layouts/MainLayout.jsx`, `src/layouts/Navigation.jsx`
- **Utilities**: `src/utils/analytics.js`, `src/utils/errorHandling.js`, `src/utils/formatters.js`, `src/utils/recaptcha.js`
- **Services**: `src/services/api.js`, `src/services/index.js`
- **Hooks**: `src/hooks/useCurrency.jsx`, `src/hooks/index.js`
- **Types**: `src/types/api.ts`
- **Core app**: `src/App.jsx`, `src/index.jsx`
- **Tests**: `tests/AboutPage.test.jsx`, `tests/CoursesPage.test.jsx`, `tests/DiveSitesPage.test.jsx`, `tests/GalleryPage.test.jsx`, `tests/HomePage.test.jsx`
- **Documentation**: `README.md`, `REFACTORING_SUMMARY.md`, `docs/guide/structure.md`, `docs/guide/workflow.md`

### External References

- [Vite Docker Best Practices](https://vitejs.dev/guide/backend-integration.html)
- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Zustand TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)
- [React Testing Library with TypeScript](https://testing-library.com/docs/react-testing-library/setup#typescript)

---

**Last Updated**: October 27, 2025  
**Status**: Ready for implementation  
**Next Action**: Begin Phase 1 (Docker Infrastructure)
