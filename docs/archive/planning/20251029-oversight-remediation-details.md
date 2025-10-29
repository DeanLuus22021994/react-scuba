<!-- markdownlint-disable-file -->

# Task Details: Documentation Decomposition Oversight Remediation

## Research Reference

**Source Research**: Template: `../research/20251029-oversight-remediation-research.md`

## Phase 1: Core Validation Scripts

### Task 1.1: Create TOC validation script

Create comprehensive validation script for TOC structure and file references.

- **Files**:
  - `.vscode/scripts/validate-toc.js` - Main validation script (NEW)

- **Implementation**:
  - Read and parse toc.yml using js-yaml
  - Validate all files in domains.*.files[] exist
  - Check all cross_references paths are valid
  - Verify frontmatter related_documents exist
  - Exit with error code for CI/CD integration
  - Provide detailed error messages

- **Code Reference**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 80-120)
  - Complete implementation with error handling

- **Success**:
  - Script runs without errors on valid TOC
  - Detects missing files
  - Detects broken cross-references
  - Exit code 0 for success, 1 for errors

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 80-120) - Complete validation script
  - #githubRepo:"microsoft/vscode markdown validation" - Error reporting patterns

- **Dependencies**:
  - js-yaml package
  - Node.js fs, path modules

### Task 1.2: Add validation npm scripts

Add npm scripts for easy validation execution.

- **Files**:
  - `server/package.json` - Add validation scripts

- **Scripts to Add**:
  - `"validate:toc": "node ../.vscode/scripts/validate-toc.js"`
  - `"validate:docs": "npm run validate:toc && npm test -- .copilot/__tests__/"`
  - `"validate:all": "npm run validate:docs && npm run lint"`

- **Success**:
  - `npm run validate:toc` executes successfully
  - Scripts accessible from npm workspaces
  - Clear error messages on failure

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 430-455) - Package.json patterns

- **Dependencies**:
  - Task 1.1 completion

### Task 1.3: Install required dependencies

Install and configure validation dependencies.

- **Files**:
  - `server/package.json` - Add devDependencies

- **Dependencies to Install**:
  - `js-yaml` - YAML parsing
  - `ajv` - JSON schema validation
  - `@types/js-yaml` - TypeScript definitions

- **Commands**:
  - `cd server && npm install --save-dev js-yaml ajv @types/js-yaml`

- **Success**:
  - Dependencies installed in server/package.json
  - No version conflicts
  - Validation scripts can import packages

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 80-85) - Required imports

- **Dependencies**:
  - None (can run in parallel with other tasks)

## Phase 2: Test Suite Implementation

### Task 2.1: Create link checker test suite

Comprehensive test suite for documentation link validation.

- **Files**:
  - `.copilot/__tests__/link-checker.test.ts` - Test suite (NEW)

- **Tests to Implement**:
  1. All TOC files exist
  2. All cross-references valid
  3. All frontmatter related_documents exist
  4. No duplicate files in TOC
  5. All ai_hints arrays non-empty

- **Code Reference**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 122-210) - Complete test suite

- **Success**:
  - All tests pass on current documentation
  - Tests detect missing files when simulated
  - Tests detect broken cross-references
  - Clear assertion messages

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 122-210) - Test implementation
  - #githubRepo:"vitest-dev/vitest documentation tests" - Test patterns

- **Dependencies**:
  - Vitest (already installed)
  - js-yaml package (Task 1.3)

### Task 2.2: Create orphan file detector test

Detect files in .copilot/ not referenced in TOC.

- **Files**:
  - `.copilot/__tests__/orphan-detector.test.ts` - Test suite (NEW)

- **Implementation**:
  - Scan all .md files in .copilot/ recursively
  - Load TOC and build list of referenced files
  - Compare scanned vs referenced
  - Report orphaned files

- **Exclusions**:
  - MIGRATION.md (not in TOC by design)
  - README.md files
  - Files in __tests__/ directories

- **Success**:
  - Test passes with zero orphans
  - Test detects orphan when file added without TOC update
  - Clear reporting of orphaned files

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 212-245) - Orphan detection logic

- **Dependencies**:
  - Vitest (already installed)
  - Node.js fs, path modules

### Task 2.3: Create schema validation test

Validate toc.yml against JSON schema.

- **Files**:
  - `.copilot/__tests__/schema-validation.test.ts` - Test suite (NEW)

- **Implementation**:
  - Load toc-schema.json
  - Load toc.yml and parse
  - Validate using ajv
  - Report schema violations

- **Success**:
  - Test passes with valid TOC
  - Test detects schema violations
  - Clear error messages for violations

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 247-280) - Schema validation patterns
  - #fetch:https://ajv.js.org/guide/getting-started.html - AJV usage

- **Dependencies**:
  - ajv package (Task 1.3)
  - js-yaml package (Task 1.3)

### Task 2.4: Update Vitest configuration

Configure Vitest to include documentation tests.

- **Files**:
  - `server/vitest.config.js` - Update test patterns

- **Changes**:
  - Add `'../.copilot/__tests__/**/*.test.ts'` to test.include
  - Ensure coverage includes docs tests

- **Success**:
  - `npm test` runs docs tests
  - Tests execute without configuration errors
  - Coverage reports include docs tests

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 282-310) - Vitest configuration

- **Dependencies**:
  - Tasks 2.1, 2.2, 2.3 completion

## Phase 3: CI/CD Integration

### Task 3.1: Create documentation validation workflow

GitHub Actions workflow for automated validation.

- **Files**:
  - `.github/workflows/docs-validation.yml` - Workflow (NEW)

- **Triggers**:
  - Pull requests modifying .copilot/
  - Pushes to main branch

- **Jobs**:
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies (npm ci)
  4. Run TOC validation script
  5. Run link checker tests
  6. Check markdown linting
  7. Validate YAML schema

- **Code Reference**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 212-260) - Complete workflow YAML

- **Success**:
  - Workflow runs on PR creation
  - All validation steps execute
  - Workflow fails on validation errors
  - Clear error messages in GitHub UI

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 212-260) - Workflow implementation
  - #githubRepo:"actions/setup-node GitHub Actions" - Node.js setup patterns

- **Dependencies**:
  - Phase 1 completion (validation scripts)
  - Phase 2 completion (test suites)

### Task 3.2: Add PR comment action

Post validation results as PR comments.

- **Files**:
  - `.github/workflows/docs-validation.yml` - Add comment step

- **Implementation**:
  - Use actions/github-script
  - Parse validation output
  - Format as markdown comment
  - Post to PR

- **Comment Format**:
  - ✅ Validation passed / ❌ Validation failed
  - List of errors (if any)
  - File references for errors
  - Link to workflow run

- **Success**:
  - Comments appear on PRs
  - Comments update on re-run
  - Clear, actionable information

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 262-295) - GitHub script action usage
  - #githubRepo:"actions/github-script PR comments" - Comment patterns

- **Dependencies**:
  - Task 3.1 completion

### Task 3.3: Create scheduled audit workflow

Weekly audit for long-term documentation health.

- **Files**:
  - `.github/workflows/docs-audit.yml` - Workflow (NEW)

- **Schedule**:
  - Runs: Every Monday at 9 AM UTC
  - Uses: cron trigger `0 9 * * 1`

- **Checks**:
  - Run all validation scripts
  - Detect orphaned files
  - Check for broken external links (if any added)
  - Report coverage gaps

- **Notification**:
  - Create GitHub Issue if errors found
  - Label: documentation, automated-audit
  - Assign: documentation maintainers

- **Success**:
  - Workflow runs weekly
  - Creates issues for problems
  - No false positives

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 297-340) - Scheduled workflow patterns

- **Dependencies**:
  - Phase 1 and 2 completion

## Phase 4: Pre-commit Hook Setup

### Task 4.1: Create pre-commit validation script

Bash script for pre-commit validation.

- **Files**:
  - `.vscode/scripts/pre-commit-docs.sh` - Hook script (NEW)

- **Implementation**:
  - Check if .copilot/ files are staged
  - Run TOC validation script
  - Run link checker tests
  - Block commit if validation fails
  - Provide clear error messages

- **Code Reference**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 262-285) - Complete hook script

- **Success**:
  - Script executes on commit
  - Blocks commits with invalid docs
  - Allows commits when validation passes
  - Clear feedback to developer

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 262-285) - Hook implementation
  - #githubRepo:"pre-commit/pre-commit-hooks examples" - Hook patterns

- **Dependencies**:
  - Phase 1 completion
  - Phase 2 completion

### Task 4.2: Create hook installation script

Node.js script to install Git hooks.

- **Files**:
  - `.vscode/scripts/install-hooks.js` - Installation script (NEW)
  - `server/package.json` - Add npm script

- **Implementation**:
  - Copy pre-commit-docs.sh to .git/hooks/pre-commit
  - Make script executable (chmod +x)
  - Create .git/hooks directory if missing
  - Preserve existing hooks if present

- **npm Script**:
  - `"hooks:install": "node ../.vscode/scripts/install-hooks.js"`

- **Success**:
  - `npm run hooks:install` works
  - Hook installed in .git/hooks/
  - Hook executes on git commit

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 287-320) - Installation script patterns

- **Dependencies**:
  - Task 4.1 completion

### Task 4.3: Add hook setup to README

Document hook installation process.

- **Files**:
  - `README.md` - Add hook setup section
  - `.copilot/MIGRATION.md` - Add to contributor guidelines

- **Content**:
  - Explanation of pre-commit validation
  - Installation command: `npm run hooks:install`
  - What gets validated
  - How to skip hook (emergency only)

- **Success**:
  - Clear documentation
  - Easy to find in README
  - Referenced in migration guide

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 322-355) - Documentation patterns

- **Dependencies**:
  - Task 4.2 completion

## Phase 5: Agent Guidance Documentation

### Task 5.1: Create AI Agent Usage Guide

Comprehensive guide for AI agents and contributors.

- **Files**:
  - `.copilot/AI-AGENT-GUIDE.md` - Usage guide (NEW)

- **Content Sections**:
  1. **Overview**: Purpose of AI-optimized structure
  2. **Querying Documentation**: How to use ai_hints and semantic search
  3. **Adding New Files**: Step-by-step process
  4. **Updating TOC**: When and how to modify toc.yml
  5. **Cross-references**: Bidirectional reference guidelines
  6. **Frontmatter Requirements**: Required YAML fields
  7. **Testing Changes**: Running validation scripts
  8. **Common Patterns**: Example queries and workflows

- **Style**:
  - Code-free (follow semantic indexing pattern)
  - YAML frontmatter with ai_hints
  - Related documents cross-references

- **Success**:
  - Guide is complete and comprehensive
  - Follows semantic documentation style
  - Provides actionable guidance
  - Easy to understand

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 357-425) - Agent guidance patterns

- **Dependencies**:
  - None (can run in parallel)

### Task 5.2: Update TOC with guide reference

Add AI-AGENT-GUIDE.md to TOC structure.

- **Files**:
  - `.copilot/toc.yml` - Add file entry

- **Changes**:
  - Add to infrastructure domain (best fit)
  - Title: "AI Agent Usage Guide"
  - ai_hints: [ai-agents, documentation-maintenance, contributor-guide]
  - Cross-reference from getting-started and planning domains

- **Success**:
  - TOC validates with new entry
  - File correctly referenced
  - Cross-references bidirectional

- **Research References**:
  - Template: `../research/20251029-oversight-remediation-research.md` (Lines 427-455) - TOC update patterns

- **Dependencies**:
  - Task 5.1 completion

### Task 5.3: Update migration guide

Reference agent guide in migration documentation.

- **Files**:
  - `.copilot/MIGRATION.md` - Add reference in "For Contributors" section

- **Changes**:
  - Add bullet point linking to AI-AGENT-GUIDE.md
  - Explain when to consult guide
  - Reference validation scripts

- **Success**:
  - Clear reference added
  - Maintains existing structure
  - Easy to find

- **Research References**:
  - Existing MIGRATION.md structure

- **Dependencies**:
  - Task 5.1 completion

### Task 5.4: Update Copilot instructions

Add validation script references to main instructions.

- **Files**:
  - `.github/copilot-instructions.md` - Add validation section

- **Changes**:
  - Add "Documentation Validation" section under "Common Commands"
  - List validation npm scripts
  - Reference AI-AGENT-GUIDE.md
  - Explain pre-commit hook

- **Success**:
  - Instructions updated
  - Scripts documented
  - Clear usage guidance

- **Research References**:
  - Existing copilot-instructions.md patterns

- **Dependencies**:
  - All previous phases completion

## Dependencies Summary

**External Dependencies**:
- js-yaml (NEW) - YAML parsing
- ajv (NEW) - JSON schema validation
- @types/js-yaml (NEW) - TypeScript definitions

**Internal Dependencies**:
- Vitest (existing) - Test framework
- Node.js 20+ (existing) - Runtime
- GitHub Actions (existing) - CI/CD
- npm workspaces (existing) - Monorepo

## Success Criteria

**Phase 1**:
- ✅ TOC validation script executes successfully
- ✅ npm scripts added and functional
- ✅ Dependencies installed without conflicts

**Phase 2**:
- ✅ All test suites pass
- ✅ Tests detect simulated errors
- ✅ Vitest configured correctly
- ✅ Coverage reports include docs tests

**Phase 3**:
- ✅ GitHub Actions workflow runs on PR
- ✅ PR comments posted with results
- ✅ Scheduled audit creates issues
- ✅ No false positives in CI

**Phase 4**:
- ✅ Pre-commit hook installed
- ✅ Hook blocks invalid commits
- ✅ Hook allows valid commits
- ✅ Documentation complete

**Phase 5**:
- ✅ AI agent guide complete
- ✅ TOC updated with guide
- ✅ Migration guide references guide
- ✅ Copilot instructions updated

**Overall**:
- ✅ Zero broken references
- ✅ All files in TOC exist
- ✅ Schema validation passes
- ✅ Documentation maintainable
- ✅ Contributors have clear guidance
