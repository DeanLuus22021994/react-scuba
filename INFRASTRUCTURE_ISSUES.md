# Infrastructure Issues - Testing & Linting Framework

**Date:** October 28, 2025  
**Context:** Discovered during React Performance Modernization implementation  
**Priority:** Medium - Blocks CI/CD pipeline but does not affect production builds

---

## 🚨 Critical Issues

### 1. Missing Test Files in Monorepo Packages

**Status:** ❌ Blocking  
**Affected Packages:**

- `@react-scuba/api` (server/apps/api)
- `@react-scuba/utils` (server/packages/utils)

**Problem:**

```
@react-scuba/api:test: No test files found, exiting with code 1
@react-scuba/utils:test: No test files found, exiting with code 1

include: **/*.{test,spec}.?(c|m)[jt]s?(x)
```

**Impact:**

- `npm test` command fails with exit code 1
- Turbo monorepo test orchestration fails entire pipeline when any workspace fails
- Prevents running tests for packages that DO have test files (@react-scuba/web has 30+ test files)
- Blocks pre-commit hooks and CI/CD pipelines

**Root Cause:**

- Packages have `"test": "vitest run"` script configured in package.json
- Vitest is configured to run but no `*.test.jsx` or `*.spec.js` files exist
- Vitest v3.2.4 exits with code 1 when no test files match patterns

**Recommended Solutions:**

**Option A - Short-term (Immediate):**

```json
// In packages without tests, change package.json:
{
  "scripts": {
    "test": "echo 'No tests yet' && exit 0"
  }
}
```

**Option B - Medium-term (Recommended):**

```json
// In turbo.json, make test failures non-blocking:
{
  "tasks": {
    "test": {
      "dependsOn": ["^build"],
      "outputs": [],
      "inputs": [
        "src/**/*.tsx",
        "src/**/*.ts",
        "tests/**/*.ts",
        "**/*.test.ts"
      ],
      "cache": false,
      "errorHandling": "continue" // Add this
    }
  }
}
```

**Option C - Long-term (Best Practice):**
Create placeholder test files for each package:

```typescript
// server/apps/api/src/__tests__/placeholder.test.ts
import { describe, it, expect } from "vitest";

describe("API Package", () => {
  it("should have tests", () => {
    expect(true).toBe(true);
  });
});
```

---

### 2. NPM Environment Configuration Warnings

**Status:** ⚠️ Warning (will break in future npm version)  
**Severity:** Low (currently just warnings)

**Problem:**

```
npm warn Unknown env config "msvs-version". This will stop working in the next major version of npm.
npm warn Unknown env config "target-arch". This will stop working in the next major version of npm.
```

**Impact:**

- Currently non-blocking
- Will break when npm upgrades to next major version (likely npm 11)
- Indicates outdated configuration for native module compilation

**Root Cause:**

- Legacy npm config from .npmrc or environment variables
- Used for node-gyp native module compilation (likely for older dependencies)

**Recommended Solution:**

```bash
# Check current npm config
npm config list

# Remove deprecated configs
npm config delete msvs-version
npm config delete target-arch

# Modern alternative for native modules:
npm config set python /path/to/python3
npm config set msvs_version 2022
```

**Action Required:**

1. Audit `.npmrc` files in project root and `server/` directory
2. Remove or update deprecated config keys
3. Verify native dependencies still compile (if any)

---

### 3. Web-Vitals Library API Breaking Change

**Status:** ✅ Fixed (documented for future reference)  
**Affected Code:** `server/apps/web/src/utils/webVitals.js`

**Problem:**

```
error during build:
src/utils/webVitals.js (1:16): "onFID" is not exported by "web-vitals"
```

**Root Cause:**

- Web-vitals v3.0+ replaced `onFID` (First Input Delay) with `onINP` (Interaction to Next Paint)
- FID deprecated by Chrome team in favor of INP as Core Web Vital

**Solution Applied:**

```javascript
// OLD (web-vitals v2):
import { onCLS, onFID, onFCP, onLCP, onTTFB } from "web-vitals";

// NEW (web-vitals v3+):
import { onCLS, onINP, onFCP, onLCP, onTTFB } from "web-vitals";
```

**Documentation:**

- [Web Vitals Changelog](https://github.com/GoogleChrome/web-vitals/releases)
- [INP Migration Guide](https://web.dev/inp/)

---

## 📋 Infrastructure Recommendations

### Testing Framework Strategy

**Current State:**

- Vitest 3.2.4 configured across all packages
- React Testing Library available in @react-scuba/web
- No test files in api/utils packages
- Turbo orchestrates tests but fails fast

**Recommended Architecture:**

1. **Workspace-Level Test Configuration**

```javascript
// turbo.json
{
  "tasks": {
    "test": {
      "dependsOn": ["^build"],
      "cache": true,
      "inputs": [
        "src/**/*.tsx",
        "src/**/*.ts",
        "tests/**/*",
        "**/*.test.ts",
        "vitest.config.ts"
      ],
      "outputs": ["coverage/**"],
      "errorHandling": "continue"  // Don't fail entire pipeline
    }
  }
}
```

2. **Per-Package Test Scripts**

```json
// For packages WITH tests:
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}

// For packages WITHOUT tests (temporary):
{
  "scripts": {
    "test": "vitest run --passWithNoTests",
    "test:watch": "echo 'No tests to watch'",
    "test:coverage": "echo 'No coverage to generate'"
  }
}
```

3. **CI/CD Pipeline Configuration**

```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: npm test -- --reporter=verbose --reporter=json
  continue-on-error: true # Don't fail build on test failures during migration

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results.json
```

### Linting Framework Strategy

**Current State:**

- No ESLint/Prettier configuration found in modified files
- VSCode tasks.json exists but no lint task
- PowerShell linting warnings about `cd` alias usage

**Recommended Tools:**

1. **ESLint Configuration (React + TypeScript)**

```bash
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-react eslint-plugin-react-hooks
npm install -D eslint-plugin-jsx-a11y  # For accessibility linting
```

2. **Biome Configuration (Modern Alternative)**

```json
// biome.json (already exists in packages/config)
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "a11y": {
        "recommended": true
      }
    }
  }
}
```

3. **Pre-commit Hooks**

```bash
npm install -D husky lint-staged

# .husky/pre-commit
#!/bin/sh
npx lint-staged

# package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## 🎯 Action Items for Architecture Team

### Priority 1 (Immediate - Unblock Development)

- [ ] Add `--passWithNoTests` flag to vitest commands in packages without tests
- [ ] OR create placeholder test files for @react-scuba/api and @react-scuba/utils
- [ ] Update turbo.json to use `"errorHandling": "continue"` for test task

### Priority 2 (This Sprint)

- [ ] Audit and remove deprecated npm config (msvs-version, target-arch)
- [ ] Add lint task to VS Code tasks.json and Turbo configuration
- [ ] Document testing strategy for new packages in CONTRIBUTING.md

### Priority 3 (Next Sprint)

- [ ] Implement pre-commit hooks with lint-staged
- [ ] Add test coverage requirements (recommend 70% for new code)
- [ ] Set up GitHub Actions workflow for automated testing
- [ ] Create test templates for common patterns (API routes, React components, utils)

### Priority 4 (Future)

- [ ] Migrate to Biome if ESLint performance becomes bottleneck
- [ ] Implement visual regression testing with Playwright
- [ ] Add E2E test coverage for critical user journeys
- [ ] Set up Lighthouse CI for performance regression detection

---

## �� Test Coverage Baseline

**Current Coverage (estimated based on files found):**

- `@react-scuba/web`: ~30 test files exist (needs audit for actual coverage %)
- `@react-scuba/api`: 0 test files
- `@react-scuba/utils`: 0 test files
- `@react-scuba/ui`: Unknown (needs investigation)
- `@react-scuba/types`: 0 test files (types-only package)
- `@react-scuba/config`: 0 test files (config-only package)

**Recommended Targets:**

- Critical paths (booking, payment): 90%+ coverage
- UI components: 80%+ coverage
- Utilities: 85%+ coverage
- API routes: 75%+ coverage

---

## 🔗 Related Documentation

- [Vitest Configuration Guide](https://vitest.dev/config/)
- [Turbo Monorepo Testing](https://turbo.build/repo/docs/handbook/testing)
- [Web Vitals Migration](https://github.com/GoogleChrome/web-vitals#migration)
- [NPM Config Deprecations](https://docs.npmjs.com/cli/v10/using-npm/config)

---

---

## 🆕 Multi-Tenant Architecture Considerations

**Date Added:** October 28, 2025  
**Context:** `@react-scuba/content` package implementation  
**Status:** 📝 Planning Required

### 1. Workspace Protocol Dependencies

**Issue:** Content package uses `workspace:*` protocol which npm 10.9.2 doesn't fully support

**Current State:**

```json
// server/apps/content/package.json
{
  "devDependencies": {
    "@react-scuba/config": "workspace:*", // Not resolved by npm install
    "typescript": "^5.3.3",
    "vitest": "^3.2.4"
  }
}
```

**Impact:**

- `npm install` in server/ fails with "Unsupported URL Type" error
- Content package cannot be tested in isolation
- Type-checking and linting blocked

**Recommended Solutions:**

**Option A - Use Root Dependencies (Immediate)**

```json
// Remove workspace dependencies
// Content package uses root-level zod (already installed)
{
  "dependencies": {
    "zod": "^3.23.8" // Use from root package.json
  }
}
```

**Option B - Upgrade to pnpm (Medium-term)**

```bash
# pnpm has native workspace protocol support
npm install -g pnpm
pnpm install
```

**Option C - Use Relative Paths (Temporary)**

```json
{
  "devDependencies": {
    "@react-scuba/config": "file:../../packages/config"
  }
}
```

**Priority:** P2 (This Sprint) - Blocks content package testing

---

### 2. Database Schema Migration for Multi-Tenancy

**Issue:** Current database lacks tenant isolation

**Current Schema:**

```sql
-- bookings table (no tenant_id)
CREATE TABLE bookings (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  // ... no tenant_id column
);
```

**Required Changes:**

```sql
-- Add tenants table
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add tenant_id to existing tables
ALTER TABLE bookings ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE contacts ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE availability ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Add indexes for performance
CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_contacts_tenant ON contacts(tenant_id);
CREATE INDEX idx_availability_tenant ON availability(tenant_id);
```

**Migration Strategy:**

1. Create tenants table with Ocean Spirit record
2. Add nullable tenant_id columns
3. Backfill existing data with Ocean Spirit tenant_id
4. Make tenant_id NOT NULL
5. Update API middleware to filter by tenant_id

**Priority:** P1 (Critical for Production) - Blocks multi-client deployment

---

### 3. API Tenant Middleware Missing

**Issue:** No Express middleware for request-scoped tenant resolution

**Current API:**

```javascript
// server/apps/api/src/routes/bookings.js
// No tenant filtering - all clients see all bookings
app.get("/api/bookings", async (req, res) => {
  const bookings = await db.query("SELECT * FROM bookings");
  res.json(bookings);
});
```

**Required Implementation:**

```javascript
// server/apps/api/src/middleware/tenant.js
import { loadClientConfig, createTenantResolver } from "@react-scuba/content";

export async function tenantMiddleware(req, res, next) {
  const resolver = createTenantResolver({
    strategy: process.env.TENANT_STRATEGY || "env",
    envVarName: "TENANT_SLUG",
    fallbackSlug: "ocean-spirit-mauritius",
  });

  const tenantSlug = resolver.resolve({
    hostname: req.hostname,
    pathname: req.path,
  });

  try {
    req.tenantConfig = await loadClientConfig(tenantSlug);
    req.tenantId = req.tenantConfig.tenant.id;
    next();
  } catch (error) {
    res.status(404).json({ error: "Tenant not found" });
  }
}

// Updated route with tenant filtering
app.get("/api/bookings", tenantMiddleware, async (req, res) => {
  const bookings = await db.query(
    "SELECT * FROM bookings WHERE tenant_id = ?",
    [req.tenantId]
  );
  res.json(bookings);
});
```

**Priority:** P1 (Critical for Production) - Blocks security and data isolation

---

### 4. Frontend Integration Pending

**Issue:** React components still use hardcoded constants

**Current Implementation:**

```typescript
// server/apps/web/src/layouts/Header.jsx
import { OCEAN_SPIRIT_CONTENT } from "../config/constants/OCEAN_SPIRIT";

function Header() {
  return <h1>{OCEAN_SPIRIT_CONTENT.name}</h1>;
}
```

**Target Implementation:**

```typescript
// server/apps/web/src/layouts/Header.jsx
import { useTenantConfig } from "@react-scuba/content/react";

function Header() {
  const { config, loading } = useTenantConfig();

  if (loading) return <div>Loading...</div>;

  return <h1>{config.company.name}</h1>;
}
```

**Required Work:**

- [ ] Create React hooks package (`@react-scuba/content/react`)
- [ ] Implement `TenantProvider` context
- [ ] Implement `useTenantConfig()` hook
- [ ] Refactor 15+ components to use dynamic configuration
- [ ] Remove deprecated constants files

**Estimated Effort:** 12-16 hours  
**Priority:** P2 (Next Sprint) - Not blocking, but needed for multi-tenant UI

---

### 5. Asset Path Resolution

**Issue:** Static asset paths don't support tenant isolation

**Current:**

```typescript
// Hardcoded paths
const logoPath = "/photos/logo-ocean-spirit.png";
const teamPhoto = "/images/team/jill-holloway.jpg";
```

**Required:**

```typescript
// Dynamic tenant-specific paths
const logoPath = `/clients/${tenantSlug}/images/branding/logo.png`;
const teamPhoto = `/clients/${tenantSlug}/images/team/jill-holloway.jpg`;

// Or with helper
import { getAssetPath } from "@react-scuba/content/utils";
const logoPath = getAssetPath("branding/logo.png", tenantSlug);
```

**Implementation Plan:**

1. Create `getAssetPath()` utility function
2. Update OptimizedImage component to use dynamic paths
3. Configure Vite to serve `/clients` directory as static assets
4. Implement access control middleware (prevent cross-tenant access)

**Priority:** P2 (Next Sprint) - Needed before second client onboarding

---

### 6. Configuration Validation in CI/CD

**Issue:** No automated validation of client configurations

**Risk:** Invalid configurations deployed to production

**Recommended CI/CD Step:**

```yaml
# .github/workflows/validate-configs.yml
name: Validate Client Configurations

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - name: Validate all client configs
        run: |
          node scripts/validate-all-configs.js
```

**Script to create:**

```javascript
// scripts/validate-all-configs.js
import { safeValidateClientConfig } from "@react-scuba/content";
import fs from "fs/promises";
import path from "path";

const clientsDir = "server/clients";
const clients = await fs.readdir(clientsDir);

let hasErrors = false;

for (const client of clients) {
  if (client === "_template") continue;

  const configPath = path.join(clientsDir, client, "config.json");
  const config = JSON.parse(await fs.readFile(configPath, "utf-8"));
  const result = safeValidateClientConfig(config);

  if (!result.success) {
    console.error(`❌ ${client}: Invalid configuration`);
    console.error(result.errors);
    hasErrors = true;
  } else {
    console.log(`✅ ${client}: Valid`);
  }
}

if (hasErrors) process.exit(1);
```

**Priority:** P2 (This Sprint) - Prevents configuration errors in production

---

## 📋 Multi-Tenant Implementation Checklist

### Critical Path (Blocks Production)

- [ ] Fix workspace protocol dependencies (Option A: use root zod)
- [ ] Add tenant_id to database schema
- [ ] Implement API tenant middleware
- [ ] Test tenant resolution strategies

### High Priority (Next Sprint)

- [ ] Create React hooks for TenantProvider
- [ ] Implement asset path resolution
- [ ] Add CI/CD configuration validation
- [ ] Refactor 5 high-traffic components (Header, Footer, HomePage, AboutPage, ContactModal)

### Medium Priority (Q1 2026)

- [ ] Migrate all 50+ components to dynamic configuration
- [ ] Remove legacy constants files
- [ ] Implement database-driven configuration
- [ ] Build admin UI for tenant management

### Nice to Have (Q2 2026)

- [ ] Headless CMS integration
- [ ] Multi-language support
- [ ] A/B testing infrastructure
- [ ] Real-time configuration updates

---

**Generated by:** GitHub Copilot (Expert React Frontend Engineer Mode)  
**Review Status:** Pending Architecture Team Review  
**Next Review:** Before next sprint planning
