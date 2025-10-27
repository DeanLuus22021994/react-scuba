---
applyTo: '.copilot-tracking/changes/20251027-react-scuba-complete-refactoring-changes.md'
---

<!-- markdownlint-disable-file -->

# Task Checklist: React Scuba Complete Enterprise Refactoring

## Overview

Systematically modernize the React Scuba application from production-ready to enterprise-grade through performance optimization, complete TypeScript migration, comprehensive E2E testing, and security hardening across 78 actionable improvements over 14-20 weeks.

## Objectives

- Achieve 30-50% reduction in unnecessary re-renders through comprehensive memoization
- Complete TypeScript migration (Phase 2-6) eliminating all PropTypes and achieving 100% type coverage
- Establish robust E2E testing with Playwright covering all critical user flows
- Activate Zustand stores eliminating duplicate modal state across 4 pages
- Implement security hardening with CSP headers, input sanitization, and rate limiting
- Optimize bundle size by 20-30% through advanced code splitting and lazy loading
- Enhance API layer with retry logic, request cancellation, and offline resilience

## Research Summary

### Project Files

- `REFACTORING_SUMMARY.md` - Phase 1 complete, Phase 2-10 pending
- `package.json` - Modern stack with React 19, Vite 7, TypeScript 5.9
- `vite.config.js` - Good chunk splitting, needs bundle analyzer
- `src/hooks/useCurrency.jsx` - No memoization, creates new functions every render
- `src/components/courses/CourseCard.jsx` - Rendered in loops without React.memo
- `src/components/home/HomePage.jsx` - Duplicate modal state, handlers not memoized
- `src/stores/useModalStore.ts` - Created but unused
- `src/services/api.js` - Missing retry, cancellation, offline queue
- `eslint.config.js` - Strict rules enabled, ready for TypeScript
- `src/utils/*.js` - 8 utilities needing TypeScript migration

### External References

- Research: `../research/20251027-react-scuba-complete-refactoring-research.md` - Comprehensive codebase analysis with 78 improvement opportunities
- GitHub: `TanStack/query` - Best practices for query hooks and error handling
- GitHub: `pmndrs/zustand` - Store composition and middleware patterns
- GitHub: `microsoft/playwright` - E2E testing patterns and page object models
- Docs: React 19 migration guide, Vite performance optimization, Web Vitals

### Standards References

- `.github/copilot-instructions.md` - Project-wide AI agent instructions
- `docs/guide/performance.md` - Performance optimization guidelines
- `docs/guide/code-quality.md` - Code quality standards
- `docs/agent/principles.md` - Development principles

## Implementation Checklist

### [ ] Phase 1: Performance Optimization (Weeks 1-3)

- [ ] Task 1.1: Implement CurrencyProvider memoization
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 35-75)

- [ ] Task 1.2: Memoize CourseCard and DiveSiteCard components
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 77-120)

- [ ] Task 1.3: Optimize HomePage modal handlers with useCallback
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 122-155)

- [ ] Task 1.4: Memoize all list-rendered components
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 157-195)

- [ ] Task 1.5: Create optimized Image component with WebP and responsive srcset
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 197-260)

- [ ] Task 1.6: Implement virtual scrolling for Gallery
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 262-295)

### [ ] Phase 2: E2E Testing Setup (Weeks 4-6)

- [ ] Task 2.1: Configure Playwright with multi-browser support
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 297-340)

- [ ] Task 2.2: Implement booking flow E2E tests
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 342-385)

- [ ] Task 2.3: Implement contact form E2E tests
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 387-420)

- [ ] Task 2.4: Implement currency switching E2E tests
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 422-455)

- [ ] Task 2.5: Add accessibility E2E tests with axe-core
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 457-490)

- [ ] Task 2.6: Integrate Playwright into CI/CD
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 492-520)

### [ ] Phase 3: Zustand Store Activation (Week 7)

- [ ] Task 3.1: Refactor HomePage to use useModalStore
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 522-565)

- [ ] Task 3.2: Refactor CoursesPage to use useModalStore
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 567-595)

- [ ] Task 3.3: Refactor AboutPage and DiveSitesPage to use useModalStore
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 597-625)

- [ ] Task 3.4: Update BookingModal and ContactModal to read from store
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 627-665)

### [ ] Phase 4: Security Hardening (Week 8)

- [ ] Task 4.1: Add Content Security Policy headers
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 667-700)

- [ ] Task 4.2: Implement input sanitization with DOMPurify
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 702-750)

- [ ] Task 4.3: Add client-side rate limiting
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 752-795)

- [ ] Task 4.4: Implement form CSRF protection
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 797-825)

### [ ] Phase 5: TypeScript Utilities Migration (Week 9)

- [ ] Task 5.1: Migrate currency.js to TypeScript
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 827-890)

- [ ] Task 5.2: Migrate analytics.js to TypeScript
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 892-940)

- [ ] Task 5.3: Migrate logger.js and seo.js to TypeScript
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 942-985)

- [ ] Task 5.4: Migrate data files to TypeScript
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 987-1020)

### [ ] Phase 6: API Layer Enhancements (Week 10)

- [ ] Task 6.1: Implement request cancellation and deduplication
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1022-1075)

- [ ] Task 6.2: Add exponential backoff retry logic
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1077-1120)

- [ ] Task 6.3: Implement offline queue
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1122-1165)

- [ ] Task 6.4: Migrate api.js to TypeScript
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1167-1200)

### [ ] Phase 7: Code Splitting Improvements (Week 11)

- [ ] Task 7.1: Implement lazy loading for modals
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1202-1245)

- [ ] Task 7.2: Add conditional map loading
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1247-1280)

- [ ] Task 7.3: Implement hover prefetching
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1282-1310)

- [ ] Task 7.4: Add bundle analyzer and size limits
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1312-1350)

### [ ] Phase 8: TypeScript Component Migration - Common (Weeks 12-13)

- [ ] Task 8.1: Migrate common components (Button, Card, Modal, etc.)
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1352-1400)

- [ ] Task 8.2: Migrate form components
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1402-1445)

- [ ] Task 8.3: Update useCurrency.jsx to TypeScript
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1447-1485)

### [ ] Phase 9: TypeScript Component Migration - Features (Weeks 14-16)

- [ ] Task 9.1: Migrate course components
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1487-1525)

- [ ] Task 9.2: Migrate dive site components
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1527-1565)

- [ ] Task 9.3: Migrate home page components
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1567-1610)

- [ ] Task 9.4: Migrate modals and remaining components
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1612-1650)

### [ ] Phase 10: Advanced Testing & Documentation (Weeks 17-18)

- [ ] Task 10.1: Add edge case tests for hooks
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1652-1705)

- [ ] Task 10.2: Add form validation edge case tests
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1707-1745)

- [ ] Task 10.3: Add JSDoc documentation to utilities
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1747-1785)

- [ ] Task 10.4: Setup test coverage reporting
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1787-1815)

### [ ] Phase 11: Form UX Improvements (Week 19)

- [ ] Task 11.1: Implement form autosave to localStorage
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1817-1860)

- [ ] Task 11.2: Add field-level async validation
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1862-1900)

- [ ] Task 11.3: Add character counters and progress indicators
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1902-1940)

### [ ] Phase 12: Final Optimizations (Week 20)

- [ ] Task 12.1: Performance profiling and optimization verification
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1942-1980)

- [ ] Task 12.2: Lighthouse audit and optimization
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 1982-2015)

- [ ] Task 12.3: Final bundle analysis and optimization
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 2017-2050)

- [ ] Task 12.4: Documentation updates and cleanup
  - Details: `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` (Lines 2052-2080)

## Dependencies

- Node.js 18+ with npm/pnpm
- React 19.2.0, Vite 7.1.11, TypeScript 5.9.3
- TanStack Query 5.90.5, Zustand 5.0.8
- Playwright 1.56.1, Vitest 3.2.4
- DOMPurify (to be installed)
- @tanstack/react-virtual (to be installed)
- rollup-plugin-visualizer (to be installed)
- All existing project dependencies from package.json

## Success Criteria

- All 317+ existing tests passing with 90%+ coverage
- 20+ E2E tests covering critical user flows
- Zero PropTypes remaining (100% TypeScript)
- No unused Zustand stores (all activated)
- 30-50% reduction in unnecessary re-renders (verified via React DevTools Profiler)
- Bundle size reduction of 20-30% (initial load <200KB gzipped)
- Lighthouse scores 95+ in all categories
- Build time <15s
- Zero ESLint/TypeScript errors
- All security measures implemented (CSP, sanitization, rate limiting)
