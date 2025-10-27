---
agent: "agent"
model: Claude Sonnet 4
---

<!-- markdownlint-disable-file -->

# Implementation Prompt: React Scuba Complete Enterprise Refactoring

## Task Overview

Execute the comprehensive enterprise-grade modernization of the React Scuba application across 12 phases, implementing 78 actionable improvements covering performance optimization, TypeScript migration, E2E testing, security hardening, and advanced code splitting over 14-20 weeks.

## Implementation Instructions

### Step 1: Create Changes Tracking File

You WILL create `20251027-react-scuba-complete-refactoring-changes.md` in `.copilot-tracking/changes/` if it does not exist.

### Step 2: Execute Implementation

You WILL follow project standards from `.github/copilot-instructions.md`

You WILL systematically implement the plan at `.copilot-tracking/plans/20251027-react-scuba-complete-refactoring-plan.instructions.md` task-by-task

You WILL reference detailed specifications in `.copilot-tracking/details/20251027-react-scuba-complete-refactoring-details.md` for each task

You WILL follow ALL project standards and conventions documented in:
- `docs/guide/code-quality.md`
- `docs/guide/performance.md`
- `docs/agent/principles.md`

You WILL use research findings from `.copilot-tracking/research/20251027-react-scuba-complete-refactoring-research.md` for context

**CRITICAL**: If `${input:phaseStop:true}` is true, you WILL stop after each Phase for user review.

**CRITICAL**: If `${input:taskStop:false}` is true, you WILL stop after each Task for user review.

### Step 3: Implementation Guidelines

#### Phase-by-Phase Execution

**Phase 1: Performance Optimization (Weeks 1-3)**

Execute tasks in order:
1. Implement CurrencyProvider memoization with `useCallback` and `useMemo`
2. Wrap CourseCard and DiveSiteCard with `React.memo`
3. Add `useCallback` to all HomePage modal handlers
4. Memoize all list-rendered components (TestimonialCard, ServiceCard, GalleryImage)
5. Create responsive Image component with WebP support and lazy loading
6. Implement virtual scrolling for Gallery using `@tanstack/react-virtual`

After each task:
- Run `npm test` to ensure all tests pass
- Verify performance improvement using React DevTools Profiler
- Update changes tracking file

**Phase 2: E2E Testing Setup (Weeks 4-6)**

Execute tasks in order:
1. Create `playwright.config.ts` with multi-browser support
2. Implement booking flow E2E tests
3. Implement contact form E2E tests
4. Implement currency switching E2E tests
5. Add accessibility E2E tests with axe-core integration
6. Add Playwright scripts to package.json and integrate with CI/CD

After each task:
- Run `npx playwright test` to verify tests pass
- Check test coverage reports
- Update changes tracking file

**Phase 3: Zustand Store Activation (Week 7)**

Execute tasks in order:
1. Refactor HomePage to use `useModalStore`
2. Refactor CoursesPage to use `useModalStore`
3. Refactor AboutPage and DiveSitesPage to use `useModalStore`
4. Update BookingModal and ContactModal to read from store

After each task:
- Verify modal functionality works correctly
- Remove unused local state variables
- Update changes tracking file

**Phase 4: Security Hardening (Week 8)**

Execute tasks in order:
1. Add CSP headers to `index.html`
2. Install DOMPurify and create sanitization utilities
3. Implement client-side rate limiter
4. Add CSRF protection tokens to forms

After each task:
- Test security measures
- Verify forms still function correctly
- Update changes tracking file

**Phase 5: TypeScript Utilities Migration (Week 9)**

Execute tasks in order:
1. Migrate `currency.js` → `currency.ts` with full type definitions
2. Migrate `analytics.js` → `analytics.ts` with event type safety
3. Migrate `logger.js` and `seo.js` to TypeScript
4. Migrate data files (`courses.js`, `diveSites.js`, `gallery.js`) to TypeScript

After each task:
- Run `npm run check` (lint + format + test)
- Verify no TypeScript errors
- Update all imports in dependent files
- Update changes tracking file

**Phase 6: API Layer Enhancements (Week 10)**

Execute tasks in order:
1. Implement request cancellation and deduplication
2. Add exponential backoff retry logic
3. Implement offline queue with online event listener
4. Migrate `api.js` → `api.ts` with full TypeScript types

After each task:
- Test API functionality
- Verify error handling works correctly
- Update changes tracking file

**Phase 7: Code Splitting Improvements (Week 11)**

Execute tasks in order:
1. Implement lazy loading for modals with Suspense
2. Add conditional map loading (only when tab active)
3. Implement hover prefetching for modals
4. Install and configure rollup-plugin-visualizer for bundle analysis

After each task:
- Run `npm run build:analyze` to check bundle sizes
- Verify lazy-loaded components work correctly
- Update changes tracking file

**Phase 8: TypeScript Component Migration - Common (Weeks 12-13)**

Execute tasks in order:
1. Migrate common components (Button, Card, Modal, Badge, Spinner, ErrorBoundary)
2. Migrate form components (Input, Textarea, Select, DatePicker, etc.)
3. Migrate `useCurrency.jsx` → `useCurrency.tsx`

After each task:
- Remove PropTypes imports
- Run tests to ensure no regressions
- Update changes tracking file

**Phase 9: TypeScript Component Migration - Features (Weeks 14-16)**

Execute tasks in order:
1. Migrate course components (CourseCard, CourseList, CourseFilter)
2. Migrate dive site components (DiveSiteCard, DiveSiteMap, DiveSiteFilter)
3. Migrate home page components (HeroSection, FeaturesSection, etc.)
4. Migrate modals and remaining components

After each task:
- Verify type safety across component tree
- Run full test suite
- Update changes tracking file

**Phase 10: Advanced Testing & Documentation (Weeks 17-18)**

Execute tasks in order:
1. Add edge case tests for hooks (error handling, race conditions, cleanup)
2. Add form validation edge case tests (XSS, injection, overflow)
3. Add comprehensive JSDoc to all utilities
4. Configure vitest coverage reporting with thresholds

After each task:
- Verify test coverage meets 90%+ threshold
- Update changes tracking file

**Phase 11: Form UX Improvements (Week 19)**

Execute tasks in order:
1. Implement form autosave to localStorage
2. Add field-level async validation (email check, etc.)
3. Add character counters and progress indicators

After each task:
- Test form UX improvements
- Verify autosave works correctly
- Update changes tracking file

**Phase 12: Final Optimizations (Week 20)**

Execute tasks in order:
1. Profile application with React DevTools and verify performance gains
2. Run Lighthouse audit and address any issues
3. Analyze final bundle sizes and optimize further if needed
4. Update documentation and clean up temporary files

After each task:
- Document metrics (Lighthouse scores, bundle sizes, test coverage)
- Update changes tracking file

### Step 4: Quality Assurance

For each phase, you WILL:
- Run `npm run check` (lint + format)
- Run `npm test` (unit/integration tests)
- Run `npx playwright test` (E2E tests where applicable)
- Verify no TypeScript errors with `tsc --noEmit`
- Check bundle sizes with `npm run build:analyze`
- Update `.copilot-tracking/changes/20251027-react-scuba-complete-refactoring-changes.md`

### Step 5: Continuous Documentation

You WILL update the changes file after EVERY task with:
- Task description and completion status
- Files created/modified/deleted
- Key changes made
- Test results
- Any issues encountered and resolutions
- Performance metrics (where applicable)

### Step 6: Cleanup

When ALL Phases are checked off (`[x]`) and completed you WILL do the following:

1. You WILL provide a markdown style link and a comprehensive summary of all changes from `.copilot-tracking/changes/20251027-react-scuba-complete-refactoring-changes.md` to the user:
   - You WILL keep the overall summary organized by phase
   - You WILL highlight key metrics achieved (performance gains, test coverage, bundle size reduction)
   - You WILL add spacing around any lists
   - You MUST wrap any reference to a file in a markdown style link

2. You WILL provide markdown style links to:
   - [Plan](../plans/20251027-react-scuba-complete-refactoring-plan.instructions.md)
   - [Details](../details/20251027-react-scuba-complete-refactoring-details.md)
   - [Research](../research/20251027-react-scuba-complete-refactoring-research.md)
   
   You WILL recommend reviewing and archiving these planning files.

3. **MANDATORY**: You WILL attempt to delete `.copilot-tracking/prompts/implement-react-scuba-complete-refactoring.prompt.md`

4. You WILL provide final metrics summary:
   - Total files created/modified/deleted
   - Test coverage percentage
   - Bundle size reduction
   - Lighthouse scores
   - Build time improvement
   - TypeScript coverage percentage

## Success Criteria

- [ ] All 12 phases completed with tasks checked off in plan file
- [ ] All 317+ tests passing (unit, integration, E2E)
- [ ] 90%+ test coverage achieved
- [ ] Zero PropTypes remaining (100% TypeScript)
- [ ] Zero ESLint/TypeScript errors
- [ ] Bundle size reduced by 20-30%
- [ ] 30-50% reduction in unnecessary re-renders verified
- [ ] Lighthouse scores 95+ in all categories
- [ ] All Zustand stores activated (no unused stores)
- [ ] All security measures implemented (CSP, sanitization, rate limiting)
- [ ] Changes tracking file complete with all tasks documented
- [ ] Build time <15s
- [ ] No console errors or warnings in production build

## Important Notes

- **Gradual Migration:** TypeScript migration uses `allowJs` for coexistence during transition
- **Zero Downtime:** All changes maintain 100% test pass rate throughout
- **Performance First:** Profile before and after optimizations to verify gains
- **Security Critical:** Test all security measures thoroughly before proceeding
- **Documentation Required:** Every utility function needs comprehensive JSDoc
- **Testing Required:** New code requires corresponding tests
- **Breaking Changes:** Avoid breaking changes; maintain backwards compatibility where possible

## Dependencies Installation

Install required new dependencies before starting:

```bash
npm install dompurify @tanstack/react-virtual
npm install -D rollup-plugin-visualizer @types/dompurify
```

## Emergency Procedures

If at any point:
- **Tests fail:** Stop immediately, investigate, fix before proceeding
- **Build breaks:** Revert last change, investigate, fix before proceeding
- **TypeScript errors:** Resolve all errors before moving to next task
- **Performance regression:** Profile to identify issue, optimize before proceeding

## Getting Started

To begin implementation:

1. Review the [plan file](../plans/20251027-react-scuba-complete-refactoring-plan.instructions.md)
2. Reference [details file](../details/20251027-react-scuba-complete-refactoring-details.md) for specifications
3. Check [research file](../research/20251027-react-scuba-complete-refactoring-research.md) for context
4. Start with Phase 1, Task 1.1
5. Update changes file after each task
6. Stop at phase boundaries if `phaseStop=true`

**Ready to transform React Scuba into an enterprise-grade application!** 🚀
