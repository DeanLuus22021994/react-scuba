---
applyTo: '.copilot-tracking/changes/20251029-critical-infrastructure-changes.md'
---

<!-- markdownlint-disable-file -->

# Task Checklist: Critical Infrastructure Remediation & Archive Management

## Overview

Address 3 critical infrastructure issues blocking development and archive completed oversight remediation documentation.

## Objectives

- Fix TypeScript import path mismatch blocking script execution
- Implement DevContainer volume isolation to eliminate build artifact pollution
- Archive completed oversight remediation tracking files
- Document GitHub Actions workflow status

## Research Summary

### Project Files

- `.vscode/scripts/copilot-context-manager.ts` - TypeScript import error (imports .js, files are .ts)
- `.vscode/scripts/tsconfig.json` - Module resolution configuration
- `.devcontainer/devcontainer.json` - Missing volume mount isolation
- `docker-compose.yml` - 35+ named volumes available but not fully leveraged
- `.copilot-tracking/plans/20251029-oversight-remediation-plan.instructions.md` - Complete, needs archive
- `.copilot-tracking/details/20251029-oversight-remediation-details.md` - Complete, needs archive
- `.copilot-tracking/changes/20251029-oversight-remediation-changes.md` - Complete, needs archive
- `.copilot-tracking/research/20251029-oversight-remediation-research.md` - Complete, needs archive

### External References

- Template: `../research/20251029-critical-infrastructure-research.md` - Complete analysis with code examples
- TypeScript Handbook - ESM module resolution patterns
- Docker Documentation - Named volume performance characteristics
- VS Code DevContainer Documentation - Volume mount strategies

### Standards References

- Template: `../../.github/copilot-instructions.md` - Output policy and project standards

## Implementation Checklist

### [ ] Phase 1: TypeScript Import Fix (CRITICAL)

- [ ] Task 1.1: Update TypeScript module resolution
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 25-80)
  - Files: `.vscode/scripts/tsconfig.json`
  - Change `moduleResolution` from `node16` to `nodenext`

- [ ] Task 1.2: Verify TypeScript compilation
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 82-110)
  - Commands: `cd .vscode/scripts && npx tsc --noEmit`
  - Ensure no compilation errors

- [ ] Task 1.3: Test script execution
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 112-140)
  - Commands: `node .vscode/scripts/copilot-context-manager.ts --help`
  - Verify successful execution

### [ ] Phase 2: Volume Isolation (HIGH PRIORITY)

- [ ] Task 2.1: Create root .dockerignore
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 142-200)
  - Files: `.dockerignore` (NEW)
  - Exclude: node_modules, dist, .vite, coverage, caches

- [ ] Task 2.2: Create server .dockerignore
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 202-245)
  - Files: `server/.dockerignore` (NEW)
  - Exclude: workspace-specific build artifacts

- [ ] Task 2.3: Add DevContainer volume mounts
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 247-320)
  - Files: `.devcontainer/devcontainer.json`
  - Mount 8 node_modules volumes for workspace isolation

- [ ] Task 2.4: Verify volume isolation
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 322-360)
  - Commands: `docker volume ls | Select-String "react_scuba"`
  - Confirm volumes mounted correctly

### [ ] Phase 3: Archive Management (MEDIUM PRIORITY)

- [ ] Task 3.1: Create archive directory structure
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 362-395)
  - Directory: `docs/archive/planning/` (NEW)
  - Prepare for 4 file moves

- [ ] Task 3.2: Move oversight remediation files
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 397-445)
  - Move from: `.copilot-tracking/plans/`, `details/`, `changes/`, `research/`
  - Move to: `docs/archive/planning/`

- [ ] Task 3.3: Create/update ARCHIVE_INDEX.md
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 447-510)
  - Files: `docs/archive/ARCHIVE_INDEX.md`
  - Add entry for oversight remediation completion

- [ ] Task 3.4: Validate documentation links
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 512-540)
  - Commands: `npm run validate:docs`
  - Ensure no broken references

### [ ] Phase 4: Workflow Documentation (LOW PRIORITY)

- [ ] Task 4.1: Document disabled workflows
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 542-590)
  - Files: `README.md`
  - Explain .yml.disabled status and CODECOV_TOKEN requirement

- [ ] Task 4.2: Add workflow re-enable instructions
  - Details: .copilot-tracking/details/20251029-critical-infrastructure-details.md (Lines 592-630)
  - Files: `README.md`
  - Document steps for activating workflows

## Dependencies

- Docker Desktop (existing) - Volume management
- Node.js 20+ (existing) - Script execution
- TypeScript 5.9+ (existing) - Compilation
- npm workspaces (existing) - Monorepo management
- `.vscode/scripts/lib/phases.ts` (exists) - Script dependency
- `.vscode/scripts/lib/cli.ts` (exists) - Script dependency
- `docker-compose.yml` volumes (defined) - Volume infrastructure
- `.copilot-tracking/` files (complete) - Archive source files

## Success Criteria

- [ ] Phase 1: TypeScript script compiles and executes without errors
- [ ] Phase 2: DevContainer mounts 8 node_modules volumes, build artifacts isolated
- [ ] Phase 3: 4 oversight remediation files archived, ARCHIVE_INDEX.md updated
- [ ] Phase 4: README.md documents workflow status and re-enable process
- [ ] All detailed specifications satisfied
- [ ] Project conventions followed
- [ ] Changes file updated continuously
- [ ] Zero broken references detected after archiving
- [ ] Build performance measurably improved
