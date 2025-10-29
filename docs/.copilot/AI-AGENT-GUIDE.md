# AI Agent Guide: React Scuba Documentation System

**Version:** 1.0.0  
**Last Updated:** 2025-10-29  
**Target:** AI agents, GitHub Copilot, and automated documentation systems  

## Overview

This guide provides AI agents with comprehensive patterns for working with the React Scuba multi-tenant dive shop management platform documentation. The documentation system uses semantic indexing and AI-optimized structures to support agent-driven development and maintenance.

## Document Purpose & Context

**Primary Use Cases:**
- AI-assisted development and code generation
- Automated documentation maintenance and validation  
- Multi-tenant architecture understanding and implementation
- GitHub Copilot workspace optimization
- Systematic troubleshooting and debugging support

**Target Agents:**
- GitHub Copilot (primary)
- Custom development agents
- Documentation maintenance bots
- Code review and validation agents

## Architecture & Structure

### Documentation Hierarchy

```text
docs/.copilot/
├── toc.yml                    # Central semantic index
├── AI-AGENT-GUIDE.md         # This guide
├── __tests__/                # Automated validation
├── schemas/                  # JSON schemas for validation
└── [domains]/               # Semantic domain organization
    ├── architecture/         # Multi-tenant & multi-industry concepts
    ├── infrastructure/       # DevContainer & development workflow
    ├── modernization/        # Technology stack & achievements  
    ├── getting-started/      # Quick start & verification
    └── planning/             # Infrastructure tasks & roadmap
```

### Semantic Indexing System

The `toc.yml` file provides the central semantic index:

```yaml
schema: './schemas/toc-schema.json'
version: '1.0.0'
last_updated: '2025-10-29'

domains:
  architecture:
    description: Multi-tenant and multi-industry architecture concepts
    path: ./architecture
    files:
      - name: multi-tenant-concepts.md
        title: Multi-Tenant Architecture Concepts
        ai_hints: [multi-tenancy, saas-architecture, tenant-isolation]
```

**Key Elements:**
- **Domain Organization:** Logical grouping of related concepts
- **AI Hints:** Semantic keywords for agent discovery
- **Cross-References:** Explicit links between related documents
- **Validation Schema:** Automated structure verification

## Agent Usage Patterns

### 1. Discovery & Context Gathering

#### Pattern: Semantic Search

```markdown
When an agent needs to understand multi-tenant architecture:
1. Check toc.yml for 'multi-tenant' ai_hints
2. Read architecture/multi-tenant-concepts.md for foundational concepts
3. Follow cross-references to implementation details
4. Validate understanding with architecture/multi-tenant-configuration.md
```

#### Pattern: Domain-First Navigation

```markdown  
For specific domain expertise:
1. Identify the relevant domain (architecture, infrastructure, etc.)
2. Read the domain description in toc.yml
3. Process files in priority order (higher priority = more foundational)
4. Use ai_hints to identify related concepts across domains
```

### 2. Code Generation Assistance

#### Pattern: Multi-Tenant Implementation

```markdown
When generating multi-tenant code:

1. Reference: architecture/multi-tenant-concepts.md
   - Understand tenant isolation principles
   - Learn client configuration schema
   - Identify security boundaries

2. Reference: architecture/multi-tenant-configuration.md  
   - Implement configuration resolution
   - Handle tenant-specific theming
   - Manage feature flags per tenant

3. Reference: modernization/react19-vite7.md
   - Use modern React patterns
   - Follow Vite build optimizations
   - Implement TypeScript strict mode
```

#### Pattern: Technology Stack Alignment

```markdown
For framework-specific code generation:

Frontend (React 19 + Vite 7):
- Reference: modernization/react19-vite7.md
- Use: server/apps/web/ code examples
- Follow: VS Code TypeScript language server standards

Backend (Express 5 + PostgreSQL 17):  
- Reference: modernization/nodejs20-express5.md
- Use: server/apps/api/ code examples
- Follow: npm workspaces patterns

Testing (Vitest 3 + Playwright 1.56):
- Reference: infrastructure/development-workflow.md
- Use: Vitest configuration examples
- Follow: colocation patterns (*.test.tsx)
```

### 3. Documentation Maintenance

#### Pattern: Automated Validation

```markdown
Before making documentation changes:
1. Run: npm run validate:toc (TOC structure validation)
2. Run: npm run test:docs (comprehensive test suite)  
3. Run: npm run validate:all (full validation pipeline)
4. Check: GitHub Actions status (automated PR validation)
```

#### Pattern: Cross-Reference Management

```markdown
When adding new documentation:
1. Add file reference to appropriate domain in toc.yml
2. Include relevant ai_hints for semantic discovery
3. Add cross-references to related documents
4. Update related documents with back-references
5. Validate all cross-references resolve correctly
```

### 4. Troubleshooting & Support

#### Pattern: Issue Diagnostics

```markdown
For development environment issues:
1. Reference: getting-started/quick-start-setup.md
2. Reference: infrastructure/devcontainer-setup.md  
3. Check: Common issues in infrastructure/development-workflow.md
4. Validate: Environment with getting-started/verification-checklist.md
```

#### Pattern: Multi-Tenant Debugging

```markdown
For tenant-specific issues:
1. Verify: Client configuration in server/clients/{client-id}/config.json
2. Check: Tenant resolution logic in architecture/multi-tenant-configuration.md
3. Debug: Content provider in server/apps/content/ 
4. Validate: Assets in server/clients/{client-id}/images/
```

## Validation & Quality Assurance

### Automated Systems

**GitHub Actions Workflows:**
- `docs-validation.yml`: PR validation with automated comments
- `docs-audit.yml`: Weekly comprehensive audits with issue creation

**Local Development:**
- Pre-commit hooks: `.vscode/scripts/pre-commit-docs.sh`
- Manual validation: `npm run validate:all`
- Test suite: `npm run test:docs`

**Test Coverage:**
- Link validation: Ensures all file references resolve
- Orphan detection: Identifies files not referenced in TOC
- Schema validation: Validates TOC structure against JSON schema
- Cross-reference integrity: Verifies bidirectional links

### Manual Review Guidelines

**For AI Agents Updating Documentation:**
1. **Semantic Consistency:** Ensure ai_hints align with content
2. **Cross-Reference Accuracy:** Verify all links resolve correctly
3. **Domain Boundaries:** Respect logical domain separation
4. **Priority Ordering:** Maintain foundational-to-specific ordering
5. **Schema Compliance:** Follow toc-schema.json requirements

## Integration Points

### GitHub Copilot Workspace

**Copilot Instructions:** `.github/copilot-instructions.md`
- Multi-tenant architecture awareness
- npm workspaces monorepo patterns
- Technology stack preferences (React 19, Vite 7, etc.)
- Code standards and linting (VS Code built-in, TypeScript strict)

**VS Code Configuration:** `.vscode/settings.json`
- AI-optimized editor settings
- Documentation validation on save
- Automatic formatting and linting
- TypeScript language server optimization

### Development Workflow

**Pre-commit Integration:**

```bash
# Install documentation validation hooks
node .vscode/scripts/install-hooks.js

# Manual validation before commits  
npm run validate:docs
```

**CI/CD Pipeline:**
- Automated validation on documentation changes
- PR comment integration for validation results
- Weekly audit reports with GitHub issue creation
- Coverage reporting and artifact retention

## Multi-Industry Extensions

### Architecture Patterns

The React Scuba platform supports multiple industry verticals through configuration-driven architecture:

**Dive Shop Management (Primary):**
- Certification tracking and management
- Equipment rental and sales
- Trip planning and booking systems
- Instructor scheduling and certification

**Extensible Framework:**
- Configuration schema: `server/clients/_template/config.json`
- Industry-specific features through feature flags
- Customizable UI themes and branding
- Flexible content management system

**Implementation Guidance:**

```markdown
For new industry implementations:
1. Reference: architecture/multi-industry-concepts.md
2. Duplicate: server/clients/_template/ for new client
3. Configure: Industry-specific features and themes
4. Validate: Multi-tenant isolation and security
```

## Advanced Agent Patterns

### Planning Workflow for Development Tasks

**CRITICAL**: All development tasks require comprehensive planning documentation before implementation.

#### Pattern: Research-First Development

```markdown
When addressing a development issue:

1. **Research Phase** (Conduct FIRST, ALWAYS)
   - Search `.copilot-tracking/research/` for existing analysis
   - If missing/incomplete, create new research file:
     * Analyze codebase for root causes
     * Review external documentation  
     * Test current behavior
     * Document findings with evidence
   - File: `YYYYMMDD-task-description-research.md`

2. **Planning Phase** (After research validation)
   - Create plan file with phases and checkboxes
     * File: `YYYYMMDD-task-description-plan.instructions.md`
     * Frontmatter: `applyTo: '.copilot-tracking/changes/...-changes.md'`
   - Create details file with specifications
     * File: `YYYYMMDD-task-description-details.md`
     * Include line number references to research
   - Create changes file template
     * File: `YYYYMMDD-task-description-changes.md`
     * Real-time tracking structure
   - Create prompt file for agent execution
     * File: `implement-task-description.prompt.md`
     * Frontmatter: `---\nmode: agent\nmodel: Claude Sonnet 4\n---`

3. **Implementation Phase** (Execute via agent mode)
   - Agent follows prompt file step-by-step
   - Updates changes file in real-time
   - Verifies each phase completion
   - Provides summary with markdown links

4. **Archival Phase** (After completion)
   - Move 4 files to `docs/archive/planning/`
   - Update `docs/archive/ARCHIVE_INDEX.md`
   - Delete prompt file
   - Commit with descriptive message
```

#### Pattern: Planning File Structure

```markdown
Required 5 Planning Documents:

1. **Research File** (Foundation)
   - Issue analysis and root cause
   - Solution options with trade-offs
   - External references
   - Verification results

2. **Plan File** (Execution Roadmap)
   - Task overview and objectives
   - Phase breakdown with checkboxes
   - Line references: "Details: file.md (Lines X-Y)"
   - Success criteria

3. **Details File** (Specifications)
   - Research references with line numbers
   - File-by-file implementation specs
   - Command execution details
   - Verification steps per task

4. **Changes File** (Real-time Tracking)
   - Command outputs and results
   - Files modified (before/after)
   - Timestamps for each change
   - Final verification checklist

5. **Prompt File** (Agent Instructions)
   - Step-by-step execution process
   - Verification commands
   - Cleanup and archival steps
   - Mode: agent, Model: Claude Sonnet 4
```

#### Pattern: Planning Best Practices

```markdown
Cross-Reference Guidelines:

- **Line Numbers**: Always include "(Lines X-Y)" when referencing files
- **Template Markers**: Use {{placeholder}} for content needing replacement  
- **Research First**: Never plan without validated research
- **Atomic Tasks**: Break large tasks into phases with checkboxes
- **Verification**: Include exact commands for validation
- **Linking**: Cross-reference related sections across all 5 files

Example Iteration:
20251029-vscode-language-server-*
├── research.md   (10.2 KB) - Root cause analysis
├── plan.md       (2.8 KB)  - 3 phases, 6 tasks
├── details.md    (12.1 KB) - Specifications
├── changes.md    (3.5 KB)  - Tracking
└── prompt.md     (8.1 KB)  - Execution
```

### Context-Aware Code Generation

#### Pattern: Full-Stack Feature Implementation

```markdown
When implementing a new multi-tenant feature:

1. **Planning Phase** (REQUIRED FIRST)
   - Create research file analyzing feature requirements
   - Document multi-tenant isolation requirements
   - Plan data model with tenant context
   - Create complete 5-file planning set

2. Architecture Phase:
   - Review multi-tenant concepts and constraints
   - Design tenant-aware data models
   - Plan configuration schema extensions

3. Backend Implementation:
   - Generate Express routes with tenant context
   - Implement database queries with tenant isolation
   - Create API endpoints with proper validation

4. Frontend Implementation:  
   - Generate React components with tenant theming
   - Implement client configuration consumption
   - Create responsive, accessible UI patterns

5. Testing & Validation:
   - Generate unit tests for business logic
   - Create integration tests for multi-tenant scenarios
   - Validate feature flags and configuration variants

6. **Archival Phase** (REQUIRED LAST)
   - Archive planning files to docs/archive/planning/
   - Update ARCHIVE_INDEX.md
   - Delete prompt file
```

#### Pattern: Documentation-Driven Development

```markdown
Using documentation to guide implementation:

1. Start with domain concepts (architecture/)
2. Understand infrastructure constraints (infrastructure/)
3. Apply modern technology patterns (modernization/)
4. Follow quick-start examples (getting-started/)
5. Reference future planning (planning/)
6. **Create planning documentation in .copilot-tracking/**
7. Archive planning docs in docs/archive/planning/ when complete
```

## Maintenance & Evolution

### Regular Maintenance Tasks

**Weekly:**
- Review weekly audit reports from GitHub Actions
- Address any orphaned files or broken references
- Update ai_hints based on new development patterns
- Validate cross-references and domain boundaries

**Monthly:**
- Review and update technology stack documentation
- Refresh quick-start guides and verification checklists  
- Update architecture documentation for new patterns
- Audit and improve agent usage patterns

**Quarterly:**
- Complete schema evolution and validation updates
- Review and enhance AI agent integration patterns
- Update multi-industry support documentation
- Evaluate and implement documentation tooling improvements

### Evolution Guidelines

**Schema Updates:**
- Maintain backward compatibility in toc-schema.json
- Version control schema changes appropriately
- Update validation scripts for new schema features
- Communicate breaking changes through GitHub issues

**Content Strategy:**
- Prioritize foundational concepts over implementation details
- Maintain clear separation between domains
- Optimize ai_hints for semantic discovery
- Balance depth with accessibility for different agent types

## Conclusion

This AI Agent Guide provides the foundation for effective AI-driven interaction with the React Scuba documentation system. The semantic indexing, validation automation, and multi-tenant architecture awareness enable agents to:

- **Navigate Efficiently:** Using domain organization and ai_hints
- **Generate Accurately:** Following established patterns and constraints
- **Maintain Quality:** Through automated validation and testing
- **Evolve Systematically:** With structured maintenance and evolution practices

**Next Steps for Agents:**
1. Familiarize with the domain structure and semantic indexing
2. Practice navigation patterns using toc.yml as primary entry point
3. Leverage validation systems for quality assurance
4. Contribute to documentation evolution through structured updates

**Support Resources:**
- TOC Schema: `docs/.copilot/schemas/toc-schema.json`
- Test Suite: `docs/.copilot/__tests__/`  
- Validation Scripts: `server/scripts/validate-toc.js`
- GitHub Workflows: `.github/workflows/docs-*.yml`

---

*This guide is maintained by the React Scuba development team and updated automatically through GitHub Actions workflows. For questions or improvements, please create an issue or submit a pull request.*
