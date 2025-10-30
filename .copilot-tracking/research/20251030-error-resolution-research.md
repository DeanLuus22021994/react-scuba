# Error Resolution Research - Spec-Driven TDD Approach

**Date**: October 30, 2025
**Status**: Research Phase
**Total Errors Found**: 10
**Priority**: Critical (all are blocking compilation)

---

## Error Classification

### Category 1: DevContainer Schema Validation (4 errors)

**Location**: `.devcontainer.json`

1. **Line 3**: `"version": "1.0.0"`
   - Error: Property version is not allowed
   - Root cause: DevContainer JSON schema does not allow `version` property
   - Schema reference: [DevContainer JSON Reference](https://containers.dev/implementors/json_reference/)
   - Fix: Remove version property (not part of official schema)
   - Impact: DevContainer won't validate against spec

2. **Line 108**: `"runArgs": [...array...]`
   - Error: Property runArgs is not allowed
   - Root cause: DevContainer v0.250+ removed `runArgs` in favor of `containerRunArgs`
   - Reference: DevContainer spec uses `containerRunArgs` or `runArgs` in compose mode
   - Fix: Rename to `containerRunArgs` or move to docker-compose compose override
   - Impact: Container arguments not applied correctly

3. **Line 44 & 56**: Duplicate object key `"3000"`
   - Error: Duplicate key in portsAttributes object
   - Root cause: Two services using port 3000 (API Server & Grafana)
   - Values:
     - Line 44: `"API Server"` label
     - Line 56: `"Grafana"` label
   - Fix: Change one port mapping (Grafana should be 3001 or another free port)
   - Impact: Port forwarding ambiguity, only one service accessible

**Verification Method**:
- Validate `.devcontainer.json` against [DevContainer JSON Reference](https://containers.dev/implementors/json_reference/)
- Use `npm run validate:devcontainer` (recommend adding this task)

---

### Category 2: CSS Browser Compatibility (2 errors)

**Location**: `server/apps/web/src/index.css`

1. **Line 281 & 638**: Missing `-webkit-backdrop-filter` prefix
   - Error: 'backdrop-filter' not supported by Safari 9+, Safari iOS 9+
   - Root cause: `backdrop-filter` is CSS 4 feature, needs vendor prefix for Safari
   - CSS standard: [Can I Use - backdrop-filter](https://caniuse.com/css-backdrop-filter)
   - Current code: `backdrop-filter: blur(4px);`
   - Fix: Add `prefix: -webkit-backdrop-filter: blur(4px);`
   - Impact: Blur effects don't work in Safari, breaks visual design

**Verification Method**:
- Tailwind 4 can auto-generate prefixes if configured
- Or manually add `-webkit-backdrop-filter` on same line or separate property
- Test in Safari to verify

**Root Cause Analysis**:
- Tailwind v4 with PostCSS configured in `postcss.config.js`
- PostCSS autoprefixer should handle this automatically
- Possible issue: autoprefixer not installed or not configured properly in Tailwind config

---

### Category 3: Specification Schema Pattern Validation (1 error)

**Location**: `specs/bleeding-edge.spec.json`

1. **Line 19**: `"monorepo": "npm-workspaces"`
   - Error: String does not match pattern `^npm-workspaces\.`
   - Root cause: Schema requires pattern with dot suffix (e.g., "npm-workspaces.something")
   - Current: `"npm-workspaces"` (no dot prefix)
   - Schema pattern: `^npm-workspaces\.` (requires leading dot)
   - Fix: Change to `"npm-workspaces.monorepo"` or adjust schema pattern to `^npm-workspaces`
   - Impact: Spec won't validate, breaking spec-driven development

**Root Cause Analysis**:
- File: `specs/schemas/bleeding-edge.schema.json`
- Pattern line needs review - may be overly restrictive
- Two options:
  1. Fix spec value to match schema pattern (add dot-notation)
  2. Fix schema pattern to match real values (remove dot requirement)
- Recommendation: Review intent and fix accordingly

**Verification Method**:
- Run `npm run specs:validate`
- Validate JSON against schema using `specs/validators/validate.js`

---

### Category 4: TypeScript Module & Type Configuration (3 errors)

**Location**: `server/apps/web/src/utils/logger.ts` + `node_modules` deps

1. **Line 24 (logger.ts)**: `import.meta.env['MODE']`
   - Error 1: 'import.meta' only allowed when module is 'es2020', 'es2022', 'esnext', etc.
   - Error 2: Property 'env' does not exist on type 'ImportMeta'
   - Root cause: TypeScript compiler target/module mismatch
   - Current tsconfig likely targeting: ES2015 or older, "commonjs" module
   - Fix: Update `tsconfig.base.json` to:
     - `"target": "ES2022"` (already set, but verify)
     - `"module": "ESNext"` (must be, not "commonjs")
     - Add type definition: `"types": ["vite/client"]`
   - Impact: import.meta not recognized, build fails

2. **vitest/reporters.d.ts & tailwindcss/lib.d.mts**: `#private` fields
   - Error: "Private identifiers only available when targeting ES2015+"
   - Root cause: TypeScript target too low or conflicting tsconfig in node_modules
   - Root cause analysis: These are type definition files in node_modules
   - Fix: Update main tsconfig to ensure ES2022 target propagates
   - This is likely a secondary issue from logger.ts fix

**Verification Method**:
- Check `server/packages/config/tsconfig.react.json` (for web app)
- Verify `server/packages/config/tsconfig.base.json` settings
- Run TypeScript compiler: `npx tsc --noEmit` to check all errors

**Root Cause Deep Dive**:
```json
// Current (likely):
{
  "target": "ES2022",           // ✅ Correct
  "module": "ESNext",           // ✅ Correct
  "moduleResolution": "bundler" // ✅ Correct
}

// But logger.ts needs Vite types:
// Missing: "types": ["vite/client"]
```

---

## Error Summary Table

| # | File | Line | Type | Severity | Fix Category |
|---|------|------|------|----------|--------------|
| 1 | .devcontainer.json | 3 | Schema | HIGH | Remove invalid property |
| 2 | .devcontainer.json | 108 | Schema | HIGH | Rename property |
| 3 | .devcontainer.json | 44 | Duplicate Key | CRITICAL | Change one port |
| 4 | .devcontainer.json | 56 | Duplicate Key | CRITICAL | Change one port |
| 5 | index.css | 281 | CSS Compat | MEDIUM | Add vendor prefix |
| 6 | index.css | 638 | CSS Compat | MEDIUM | Add vendor prefix |
| 7 | bleeding-edge.spec.json | 19 | Pattern | MEDIUM | Fix value or schema |
| 8 | logger.ts | 24 | Module Config | HIGH | Add Vite types |
| 9 | logger.ts | 24 | Type | HIGH | Module config fix |
| 10 | node_modules (vitest/tailwindcss) | Various | Target | MEDIUM | tsconfig cascade |

---

## TDD Test Specifications Required

### Test 1: DevContainer Schema Validation
```typescript
// specs/validators/devcontainer.test.ts
describe('DevContainer Schema Validation', () => {
  test('should not have version property', () => {
    const config = JSON.parse(readFileSync('.devcontainer.json'));
    expect(config).not.toHaveProperty('version');
  });

  test('should not have runArgs property', () => {
    const config = JSON.parse(readFileSync('.devcontainer.json'));
    expect(config).not.toHaveProperty('runArgs');
  });

  test('portsAttributes should not have duplicate keys', () => {
    const config = JSON.parse(readFileSync('.devcontainer.json'));
    const ports = config.portsAttributes;
    const portNumbers = Object.keys(ports);
    expect(new Set(portNumbers).size).toBe(portNumbers.length); // No duplicates
  });
});
```

### Test 2: CSS Vendor Prefixes
```typescript
// server/apps/web/src/index.css.test.ts
describe('CSS Vendor Prefixes', () => {
  test('backdrop-filter should have webkit prefix for Safari', () => {
    const css = readFileSync('src/index.css', 'utf-8');
    const backropLines = css.match(/backdrop-filter/g);
    backropLines.forEach(line => {
      expect(css).toContain('-webkit-backdrop-filter');
    });
  });
});
```

### Test 3: Spec Pattern Validation
```typescript
// specs/validators/spec-pattern.test.ts
describe('Spec Pattern Validation', () => {
  test('monorepo field should match schema pattern', () => {
    const spec = JSON.parse(readFileSync('specs/bleeding-edge.spec.json'));
    const pattern = /^npm-workspaces/;
    expect(spec.technology_stack.tooling.monorepo).toMatch(pattern);
  });
});
```

### Test 4: TypeScript Module Configuration
```typescript
// server/packages/config/tsconfig.test.ts
describe('TypeScript Module Configuration', () => {
  test('should target ES2022 or later', () => {
    const tsconfig = JSON.parse(readFileSync('tsconfig.base.json'));
    const validTargets = ['ES2022', 'ES2023', 'ESNext'];
    expect(validTargets).toContain(tsconfig.compilerOptions.target);
  });

  test('should use ESNext module', () => {
    const tsconfig = JSON.parse(readFileSync('tsconfig.base.json'));
    expect(tsconfig.compilerOptions.module).toBe('ESNext');
  });

  test('should include vite/client types', () => {
    const tsconfig = JSON.parse(readFileSync('tsconfig.react.json'));
    expect(tsconfig.compilerOptions.types).toContain('vite/client');
  });
});
```

---

## Implementation Strategy: Spec-Driven TDD

### Phase 1: Define Specs (Already Done)
- Create JSON schema for each validation point
- Define test cases for each error category
- Document expected behavior

### Phase 2: Write Failing Tests (TDD Red Phase)
- Write tests that verify each error is fixed
- Run tests - all should FAIL (they verify errors exist)
- Commit test code

### Phase 3: Fix Issues (TDD Green Phase)
- Fix each error category one by one
- Tests should turn GREEN as fixes apply
- Verify no regressions

### Phase 4: Refactor & Verify (TDD Refactor Phase)
- Run full test suite including all validation
- Ensure code quality standards maintained
- Final validation with `npm run check`

---

## Commands Required

```bash
# Validation commands to add to package.json:
npm run validate:devcontainer      # Validate DevContainer schema
npm run validate:specs             # Validate all specs
npm run validate:css               # Check CSS vendor prefixes
npm run validate:types             # TypeScript type checking
npm run validate:all               # All validations

# Test commands:
npm test -- specs/validators       # Run spec validators
npm test -- **/*.test.ts           # All tests

# Verification:
npm run check                      # Full pre-commit check
```

---

## Next Steps

1. ✅ Research complete (this document)
2. ⏭️ Create detailed implementation plan with specific line numbers
3. ⏭️ Create TDD test files
4. ⏭️ Implement fixes following TDD phases
5. ⏭️ Run final validation

---

## References

- [DevContainer JSON Reference](https://containers.dev/implementors/json_reference/)
- [Can I Use - backdrop-filter](https://caniuse.com/css-backdrop-filter)
- [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [Vite Env Variables and Modes](https://vitejs.dev/guide/env-and-modes.html)
