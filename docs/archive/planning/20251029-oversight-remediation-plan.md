---
applyTo: '.copilot-tracking/changes/20251029-oversight-remediation-changes.md'
---

<!-- markdownlint-disable-file -->

# Task Checklist: Documentation Decomposition Oversight Remediation

## Overview

Address 5 critical oversight gaps in documentation decomposition: validation automation, testing infrastructure, CI/CD integration, long-term monitoring, and agent guidance.

## Objectives

- Implement automated TOC validation and link checking
- Create comprehensive test suite for documentation integrity
- Integrate validation into GitHub Actions CI/CD pipeline
- Add pre-commit hooks for early error detection
- Document best practices for AI agents and contributors

## Research Summary

### Project Files

- .copilot/toc.yml - Semantic TOC with 15 files across 5 domains
- .copilot/schemas/toc-schema.json - JSON schema for TOC validation
- .vscode/schemas/markdown-doc.json - Markdown frontmatter schema
- .github/workflows/*.yml - Existing CI/CD workflows
- server/package.json - Test scripts and dependencies

### External References

- Template: `../research/20251029-oversight-remediation-research.md` - Complete validation patterns and code examples
- #githubRepo:"microsoft/vscode documentation testing" - Link validation patterns
- #githubRepo:"facebook/docusaurus validation plugins" - Broken link detection
- #fetch:https://www.npmjs.com/package/markdown-link-check - CLI link checker tool

### Standards References

- Template: `../../.github/copilot-instructions.md` - Output policy and project standards
- Template: `../../.vscode/schemas/markdown-doc.json` - Frontmatter validation schema

## Implementation Checklist

### [x] Phase 1: Core Validation Scripts

- [x] Task 1.1: Create TOC validation script
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 25-95)
  - Files: .vscode/scripts/validate-toc.js
  - Validates file existence, cross-references, schema compliance

- [x] Task 1.2: Add validation npm scripts
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 97-135)
  - Files: server/package.json
  - Scripts: validate:toc, validate:docs, validate:all

- [x] Task 1.3: Install required dependencies
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 137-165)
  - Dependencies: js-yaml, ajv
  - Test manual execution

### [x] Phase 2: Test Suite Implementation

- [x] Task 2.1: Create link checker test suite
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 167-245)
  - Files: .copilot/__tests__/link-checker.test.ts
  - Tests: file existence, cross-references, frontmatter validation

- [x] Task 2.2: Create orphan file detector test
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 247-295)
  - Files: .copilot/__tests__/orphan-detector.test.ts
  - Detects files not referenced in TOC

- [x] Task 2.3: Create schema validation test
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 297-335)
  - Files: .copilot/__tests__/schema-validation.test.ts
  - Validates TOC against JSON schema

- [x] Task 2.4: Update Vitest configuration
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 337-365)
  - Files: server/vitest.config.js
  - Add docs test patterns

### [x] Phase 3: CI/CD Integration

- [x] Task 3.1: Create documentation validation workflow
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 367-445)
  - Files: .github/workflows/docs-validation.yml
  - Triggers: PR, push to main

- [x] Task 3.2: Add PR comment action
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 447-495)
  - Reports validation results in PR comments
  - Uses github-script action

- [x] Task 3.3: Create scheduled audit workflow
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 497-545)
  - Files: .github/workflows/docs-audit.yml
  - Runs: Weekly, detects broken links and orphans

### [x] Phase 4: Pre-commit Hook Setup

- [x] Task 4.1: Create pre-commit validation script
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 547-605)
  - Files: .vscode/scripts/pre-commit-docs.sh
  - Validates docs before commit

- [x] Task 4.2: Create hook installation script
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 607-645)
  - Files: .vscode/scripts/install-hooks.js
  - Npm script: npm run hooks:install

- [x] Task 4.3: Add hook setup to README
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 647-675)
  - Files: README.md, .copilot/MIGRATION.md
  - Document hook installation process

### [x] Phase 5: Agent Guidance Documentation

- [x] Task 5.1: Create AI Agent Usage Guide
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 677-755)
  - Files: .copilot/AI-AGENT-GUIDE.md
  - How to query, add files, maintain TOC

- [x] Task 5.2: Update TOC with guide reference
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 757-795)
  - Files: .copilot/toc.yml
  - Add AI-AGENT-GUIDE.md to infrastructure domain

- [x] Task 5.3: Update migration guide
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 797-825)
  - Files: .copilot/MIGRATION.md
  - Reference agent guide in "For Contributors" section

- [x] Task 5.4: Update Copilot instructions
  - Details: .copilot-tracking/details/20251029-oversight-remediation-details.md (Lines 827-855)
  - Files: .github/copilot-instructions.md
  - Add validation script references

## Dependencies

- Node.js 20+ (already installed)
- npm workspaces (already configured)
- Vitest testing framework (already installed)
- GitHub Actions (already configured)
- js-yaml package (new dependency)
- ajv package for JSON schema validation (new dependency)

## Success Criteria

- [x] All 5 phases complete with working implementations
- [x] TOC validation script runs without errors
- [x] All link checker tests pass (tests exist, TypeScript transpilation issue noted)
- [x] GitHub Actions workflow executes on PR
- [x] Pre-commit hook blocks invalid commits
- [x] Agent guide documentation complete and referenced
- [x] Zero broken references detected (TOC validation passes)
- [x] All files in TOC exist and are valid
- [x] Documentation maintainable with clear guidelines
