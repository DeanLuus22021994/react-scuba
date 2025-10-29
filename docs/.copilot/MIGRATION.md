# Documentation Migration Guide

## Overview

On **October 29, 2025**, the React Scuba documentation was restructured into an AI-optimized semantic format. This guide explains the changes and how to find documentation.

## What Changed

### Old Structure (Archived)

Previously, documentation was in 8 large files with extensive code examples:

- `docs/DEVCONTAINER.md` (370+ lines)
- `docs/DEVELOPMENT.md` (647 lines)
- `docs/MODERNIZATION.md` (252 lines)
- `docs/MULTI_TENANT.md` (681 lines)
- `docs/MULTI_INDUSTRY.md` (561 lines)
- `docs/QUICKSTART.md` (245 lines)
- `docs/TASKS.md` (178 lines)
- `docs/TODO.md` (726 lines)

**Location**: Now archived in `docs/archive/original/`

### New Structure (Current)

Documentation is now in `docs/.copilot/` with 16 semantic files organized by domain:

#### Architecture Domain (3 files)

- `multi-tenant-concepts.md` - Multi-tenancy architecture patterns
- `multi-tenant-configuration.md` - Configuration schema and resolution
- `multi-industry-concepts.md` - Industry-agnostic platform design

#### Infrastructure Domain (5 files)

- `devcontainer-architecture.md` - Dev environment overview
- `devcontainer-mcp-services.md` - MCP service configuration
- `devcontainer-volumes.md` - Volume strategy
- `development-workflow.md` - Task execution and workflows
- `development-infrastructure.md` - Docker and service orchestration

#### Modernization Domain (3 files)

- `tech-stack-overview.md` - Bleeding-edge technology stack
- `build-optimizations.md` - Build performance strategies
- `modernization-achievements.md` - Migration milestones

#### Getting-Started Domain (2 files)

- `quickstart-setup.md` - Initial setup steps
- `quickstart-verification.md` - Health checks and validation

#### Planning Domain (2 files)

- `infrastructure-tasks.md` - Infrastructure backlog
- `todo-platform.md` - Platform roadmap

## Key Changes

### 1. Code Examples Removed

All code blocks have been removed. The new documentation focuses on **conceptual understanding** for AI semantic indexing.

**For code examples**, refer to:
- Actual source files in `server/apps/`, `server/packages/`
- `server/clients/` for configuration examples
- `.vscode/` for development tooling examples

### 2. YAML Frontmatter

Every file now has structured metadata:

```yaml
---
title: Document Title
domain: architecture|infrastructure|modernization|getting-started|planning
category: Specific category
audience: [ai-copilot, developers, architects]
ai_hints: [semantic, indexing, keywords]
tags: [topic, tags]
related_documents: [path/to/related.md]
---
```

### 3. Table of Contents

See `docs/.copilot/toc.yml` for:
- Complete file listing by domain
- Semantic relationships between documents
- AI indexing configuration
- Cross-reference mappings

**IDE Validation**: `docs/.copilot/schemas/toc-schema.json` provides VS Code IntelliSense for `toc.yml`

## Finding Documentation

### By Topic

| Topic | Old File | New Location |
|-------|----------|--------------|
| DevContainer setup | DEVCONTAINER.md | `infrastructure/devcontainer-architecture.md` |
| MCP services | DEVCONTAINER.md | `infrastructure/devcontainer-mcp-services.md` |
| Volume strategy | DEVCONTAINER.md | `infrastructure/devcontainer-volumes.md` |
| Development workflow | DEVELOPMENT.md | `infrastructure/development-workflow.md` |
| Docker infrastructure | DEVELOPMENT.md | `infrastructure/development-infrastructure.md` |
| Tech stack | MODERNIZATION.md | `modernization/tech-stack-overview.md` |
| Build performance | MODERNIZATION.md | `modernization/build-optimizations.md` |
| Migration history | MODERNIZATION.md | `modernization/modernization-achievements.md` |
| Multi-tenant concepts | MULTI_TENANT.md | `architecture/multi-tenant-concepts.md` |
| Tenant configuration | MULTI_TENANT.md | `architecture/multi-tenant-configuration.md` |
| Multi-industry design | MULTI_INDUSTRY.md | `architecture/multi-industry-concepts.md` |
| Quick start | QUICKSTART.md | `getting-started/quickstart-setup.md` |
| Service verification | QUICKSTART.md | `getting-started/quickstart-verification.md` |
| Infrastructure tasks | TASKS.md | `planning/infrastructure-tasks.md` |
| Platform roadmap | TODO.md | `planning/todo-platform.md` |

### Using VS Code

1. **Search by domain**: Use file explorer in `docs/.copilot/{domain}/`
2. **Search by keyword**: Use `Ctrl+Shift+F` to search across all files
3. **Use TOC**: Open `docs/.copilot/toc.yml` for structured navigation
4. **AI Hints**: YAML frontmatter `ai_hints` field contains semantic keywords

### Using GitHub Copilot

Reference the new structure in prompts:

```text
@workspace explain the multi-tenant architecture using docs/.copilot/architecture/
@workspace show me DevContainer setup from docs/.copilot/infrastructure/
```

## For Contributors

### Adding New Documentation

1. Choose appropriate domain directory
2. Create file with YAML frontmatter (see existing files for template)
3. Update `docs/.copilot/toc.yml` with new entry
4. Add semantic relationships in frontmatter `related_documents`
5. Use `ai_hints` for AI indexing keywords
6. **No code examples** - focus on concepts only

### Updating Existing Documentation

1. Edit files in `docs/.copilot/{domain}/`
2. Update `last_updated` date in frontmatter
3. Update `toc.yml` if file relationships change
4. Maintain consistency with AI-optimized style

### Markdown Linting

Configuration in `docs/.copilot/.markdownlint.json` suppresses:
- MD013: Line length (not enforced)
- MD025: Multiple H1 headings (due to YAML frontmatter)
- MD032: List spacing (allows compact lists)

## Archived Documentation

Original files remain accessible in `docs/archive/original/` for historical reference. These files are **not maintained** and may contain outdated information.

Use the new `.copilot/` structure for current documentation.

## Questions?

- **Technical issues**: Check `planning/infrastructure-tasks.md`
- **Architecture questions**: See `architecture/` domain files
- **Setup problems**: Refer to `getting-started/` domain files

---

**Migration Date**: October 29, 2025
**Version**: 1.0.0
**Schema**: toc-schema.json v1.0.0
