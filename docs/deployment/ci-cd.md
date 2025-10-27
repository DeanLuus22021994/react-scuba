# CI/CD Monitoring & Maintenance

Enterprise-grade continuous integration and maintenance automation for React Scuba.

## Overview

This project uses a comprehensive CI/CD pipeline with automated dependency management, bundle size tracking, and performance monitoring to ensure production readiness.

## Features

### 📦 Automated Dependency Updates (Dependabot)

Dependabot automatically creates pull requests for dependency updates across multiple ecosystems:

- **npm** (weekly): React, build tools, testing, linting/formatting (grouped updates)
- **GitHub Actions** (weekly): CI/CD workflow dependencies
- **Docker** (weekly): Container base images
- **Python/pip** (weekly): MCP server dependencies

**Configuration**: `.github/dependabot.yml`

**Grouping Strategy**:

- React ecosystem updates (react, react-dom, @types/react\*)
- Testing dependencies (_test_, _vitest_, @testing-library/\*)
- Build tools (vite, @vitejs/\*, postcss, tailwindcss)
- Code quality (eslint*, prettier*, @typescript-eslint/\*)
- MCP SDK (mcp\*)

**Ignored Updates**:

- React major versions (require manual review for breaking changes)

### 📊 Bundle Size Tracking (size-limit)

Automated bundle size analysis prevents performance regressions:

**Limits**:

- Main JS Bundle: **150 KB** (gzip)
- Main CSS Bundle: **50 KB** (gzip)
- Total Bundle: **250 KB** (gzip)
- Vendor Chunks: **200 KB** (gzip)

**Commands**:

```bash
# Check bundle size against limits
npm run size

# Analyze why bundle size increased
npm run size:why
```

**Configuration**: `.size-limit.json`

**CI Integration**: Automatically runs in GitHub Actions on every PR/push

### ⚡ Lighthouse Performance Audits

Continuous performance monitoring with automated Lighthouse CI:

**Baselines** (all pages):

- 📊 Performance: **>90**
- ♿ Accessibility: **>90**
- 🎯 Best Practices: **>90**
- 🔍 SEO: **>90**

**Audited Pages**:

- Home (`/`)
- Courses (`/courses`)
- Dive Sites (`/dive-sites`)
- Gallery (`/gallery`)
- About (`/about`)

**Runs**: 3 iterations per page for consistent results

## GitHub Actions Workflow

**File**: `.github/workflows/ci.yml`

### Jobs

#### 1. **Lint & Format Check** (~10 min)

- ESLint validation
- Prettier format verification
- Uploads lint results as artifacts

#### 2. **Test Suite** (~15 min)

- Runs full test suite with coverage
- Uploads coverage to Codecov
- Comments PR with coverage reports
- Generates test result artifacts

#### 3. **Build & Bundle Analysis** (~10 min)

- Production build
- Bundle size analysis
- Size limit warnings (>2MB threshold)
- Uploads build artifacts for downstream jobs

#### 4. **Lighthouse Performance Audit** (~10 min)

- Requires build job completion
- Starts local preview server
- Runs Lighthouse CI (3 iterations/page)
- Uploads performance reports

#### 5. **Docker Build Test** (~20 min)

- Tests Docker container build
- Uses BuildKit caching
- Validates container startup
- GitHub Actions cache optimization

#### 6. **Security Audit** (~10 min)

- npm audit (moderate+ severity)
- Snyk security scan (high+ severity)
- Continues on errors (informational)

#### 7. **All Checks Passed** (final gate)

- Validates all required jobs succeeded
- Blocks merge if any job fails

### Workflow Triggers

- **Push**: `main`, `develop` branches
- **Pull Request**: `main`, `develop` branches
- **Manual**: `workflow_dispatch`

### Concurrency Control

- Cancels in-progress runs for same branch
- Prevents duplicate workflow execution
- Optimizes CI resource usage

## Codecov Integration

**Optional**: Add `CODECOV_TOKEN` to repository secrets for coverage tracking

- **Token Setup**: https://codecov.io/gh/OWNER/REPO
- **Coverage Reports**: Automatically uploaded on every CI run
- **PR Comments**: Coverage changes displayed in pull requests

## Snyk Security Scanning

**Optional**: Add `SNYK_TOKEN` to repository secrets for vulnerability scanning

- **Token Setup**: https://snyk.io/account
- **Scan Frequency**: Every push/PR
- **Severity Threshold**: High+ vulnerabilities

## Local Development

### Size Limit

```bash
# Check current bundle size
npm run size

# Analyze bundle composition
npm run size:why
```

### Full Quality Check

```bash
# Run all checks (lint + test + build)
npm run check
npm test
npm run build
```

## Artifact Retention

All CI artifacts retained for **7 days**:

- Lint results
- Test coverage
- Build output
- Lighthouse reports

## Monitoring Dashboard

Track CI/CD health:

- **Actions**: https://github.com/OWNER/REPO/actions
- **Dependabot**: https://github.com/OWNER/REPO/network/updates
- **Security**: https://github.com/OWNER/REPO/security

## Maintenance Schedule

| Task               | Frequency             | Automation     |
| ------------------ | --------------------- | -------------- |
| Dependency Updates | Weekly (Monday 09:00) | Dependabot     |
| Security Audits    | Every push/PR         | GitHub Actions |
| Performance Tests  | Every push/PR         | Lighthouse CI  |
| Bundle Size Checks | Every push/PR         | size-limit     |
| Coverage Tracking  | Every push/PR         | Codecov        |

## Best Practices

### Dependency Management

- ✅ Review grouped dependency updates together
- ✅ Test thoroughly after major React updates
- ✅ Monitor security advisories
- ✅ Keep build tools updated

### Performance

- ✅ Keep main bundle under 150 KB
- ✅ Maintain Lighthouse score >90
- ✅ Optimize images before committing
- ✅ Use lazy loading for routes

### Security

- ✅ Address high+ severity vulnerabilities immediately
- ✅ Review Snyk/npm audit reports
- ✅ Update Docker base images regularly
- ✅ Rotate secrets annually

## Troubleshooting

### Dependabot PR Failures

1. Check merge conflicts
2. Verify peer dependencies
3. Run tests locally: `npm test`
4. Check breaking changes in CHANGELOG

### Size Limit Failures

1. Run `npm run size:why` to analyze
2. Check for accidentally imported large dependencies
3. Use dynamic imports for heavy components
4. Consider code splitting

### Lighthouse Failures

1. Test locally: `npm run build && npm run preview`
2. Check for performance regressions
3. Optimize images/fonts
4. Review third-party scripts

### Docker Build Failures

1. Clear build cache: `docker builder prune -a`
2. Update base images
3. Check Dockerfile syntax
4. Verify multi-stage build steps

## Future Enhancements

Planned improvements:

- [ ] Visual regression testing (Percy/Chromatic)
- [ ] End-to-end tests (Playwright)
- [ ] Automated changelog generation
- [ ] Release automation
- [ ] Performance budgets per route
- [ ] Real User Monitoring (RUM) integration

---

**Status**: ✅ All CI/CD systems operational
