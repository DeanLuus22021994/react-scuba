---
applyTo: '.copilot-tracking/changes/20251029-docs-decomposition-changes.md'
---
<!-- markdownlint-disable MD025 MD032 -->`n`n# Task Checklist: AI-Optimized Documentation Decomposition

## Overview

Decompose 8 documentation files into AI-optimized, code-free semantic files grouped by domain for enhanced Copilot and MCP server indexing.

## Objectives

- Remove all code examples from documentation (AI semantic indexing focus)
- Create domain-grouped structure for maintainability
- Implement YAML table of contents with IDE validation
- Update all references across codebase
- Add markdown lint exclusions where needed

## Research Summary

### Project Files

- docs/DEVCONTAINER.md - Enterprise dev environment (370+ lines, heavy code examples)
- docs/DEVELOPMENT.md - Progress log (647 lines, task tracking)
- docs/MODERNIZATION.md - Tech stack evolution (252 lines, version info)
- docs/MULTI_TENANT.md - Architecture concepts (681 lines, config schema)
- docs/MULTI_INDUSTRY.md - Industry patterns (561 lines, implementation)
- docs/QUICKSTART.md - Setup guide (245 lines, command examples)
- docs/TASKS.md - Infrastructure backlog (178 lines)
- docs/TODO.md - Platform roadmap (726 lines)

### Standards References

- .github/copilot-instructions.md - Output policy guidelines
- .vscode/schemas/markdown-doc.json - Documentation metadata schema
- tsconfig.json - TypeScript configuration

## Implementation Checklist

### [x] Phase 1: Structure Creation

- [x] Task 1.1: Create .copilot directory structure
  - Details: Created architecture/, infrastructure/, modernization/, getting-started/, planning/, schemas/

- [x] Task 1.2: Create YAML table of contents
  - Details: toc.yml with semantic relationships and AI indexing config

- [x] Task 1.3: Create TOC JSON schema
  - Details: toc-schema.json for IDE validation

### [x] Phase 2: Architecture Domain Decomposition

- [x] Task 2.1: Decompose MULTI_TENANT.md
  - Files: multi-tenant-concepts.md, multi-tenant-configuration.md

- [x] Task 2.2: Decompose MULTI_INDUSTRY.md
  - Files: multi-industry-concepts.md

- [x] Task 2.3: Validate architecture files
  - Verify frontmatter, check AI hints, ensure code-free

### [x] Phase 3: Infrastructure Domain Decomposition

- [x] Task 3.1: Decompose DEVCONTAINER.md Part 1
  - Files: devcontainer-architecture.md

- [x] Task 3.2: Decompose DEVCONTAINER.md Part 2
  - Files: devcontainer-mcp-services.md, devcontainer-volumes.md

- [x] Task 3.3: Decompose DEVELOPMENT.md
  - Files: development-workflow.md, development-infrastructure.md

### [x] Phase 4: Modernization Domain Decomposition

- [x] Task 4.1: Decompose MODERNIZATION.md
  - Files: tech-stack-overview.md, build-optimizations.md, modernization-achievements.md

### [x] Phase 5: Getting-Started Domain Decomposition

- [x] Task 5.1: Decompose QUICKSTART.md
  - Files: quickstart-setup.md, quickstart-verification.md

### [x] Phase 6: Planning Domain Decomposition

- [x] Task 6.1: Decompose TASKS.md
  - Files: infrastructure-tasks.md

- [x] Task 6.2: Decompose TODO.md
  - Files: todo-platform.md

### [x] Phase 7: Update References

- [x] Task 7.1: Update Copilot instructions
  - Files: .github/copilot-instructions.md, .vscode/copilot/instructions.md

- [x] Task 7.2: Update agent configurations
  - Files: .github/agents/coder.agent.md (fixed tool references)

- [x] Task 7.3: Update markdown schema
  - Files: .vscode/schemas/markdown-doc.json

- [x] Task 7.4: Update TypeScript configuration
  - Files: Created docs/.copilot/.markdownlint.json

### [x] Phase 8: Archive and Cleanup

- [x] Task 8.1: Move original files to archive
  - Location: docs/archive/original/

- [x] Task 8.2: Update README references
  - Files: README.md, server/clients/_template/README.md

- [x] Task 8.3: Create migration guide
  - File: docs/.copilot/MIGRATION.md

## Dependencies

- YAML schema support in VS Code
- Native language server configuration
- Markdown validation tools

## Success Criteria

- All 8 docs decomposed into semantic files
- Zero code blocks in .copilot documentation
- YAML TOC validates against JSON schema
- All codebase references updated
- Original files archived with migration guide
