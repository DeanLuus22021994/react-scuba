<!-- markdownlint-disable-file -->

# Task Details: Critical Infrastructure Remediation & Archive Management

## Research Reference

**Source Research**: Template: `../research/20251029-critical-infrastructure-research.md`

**Architectural Context**: This project uses **native npm workspaces** for monorepo orchestration (Turbo removed). All build caching and task execution relies on npm workspace capabilities.

## Phase 1: TypeScript Import Fix

### Task 1.1: Update TypeScript module resolution

Update tsconfig.json to use `nodenext` module resolution for proper ESM + TypeScript interop.

- **Files**:
  - `.vscode/scripts/tsconfig.json` - Update moduleResolution

- **Implementation**:
  - Change `"moduleResolution": "node16"` to `"moduleResolution": "nodenext"`
  - Change `"module": "node16"` to `"module": "nodenext"`
  - Allows TypeScript to resolve `.js` imports to `.ts` files at compile time
  - Runtime gets actual `.js` files after compilation

- **Current Configuration**:
  ```json
  {
    "extends": "../packages/config/tsconfig.node.json",
    "compilerOptions": {
      "module": "node16",
      "moduleResolution": "node16",
      "outDir": "./dist",
      "rootDir": "./src"
    }
  }
  ```

- **Updated Configuration**:
  ```json
  {
    "extends": "../packages/config/tsconfig.node.json",
    "compilerOptions": {
      "module": "nodenext",
      "moduleResolution": "nodenext",
      "outDir": "./dist",
      "rootDir": "./src"
    }
  }
  ```

- **Success**:
  - VS Code TypeScript errors cleared
  - import.meta.url supported
  - `.js` extensions in imports resolve to `.ts` files

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 80-150) - TypeScript ESM patterns
  - TypeScript Handbook - ESM module resolution

- **Dependencies**:
  - None (independent change)

### Task 1.2: Verify TypeScript compilation

Run TypeScript compiler to ensure no errors after module resolution change.

- **Files**:
  - `.vscode/scripts/**/*.ts` - All TypeScript files in scripts directory

- **Commands**:
  ```powershell
  cd .vscode/scripts
  npx tsc --noEmit
  ```

- **Expected Output**:
  - Zero compilation errors
  - No type checking failures
  - Clean exit code (0)

- **Verification Steps**:
  1. Navigate to `.vscode/scripts/` directory
  2. Run TypeScript compiler in check mode
  3. Review any errors (should be none)
  4. Verify VS Code problems panel is clear

- **Success**:
  - `npx tsc --noEmit` exits with code 0
  - No errors in VS Code problems panel
  - All imports resolve correctly

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 400-420) - TypeScript verification

- **Dependencies**:
  - Task 1.1 completion

### Task 1.3: Test script execution

Verify copilot-context-manager.ts executes successfully after fixes.

- **Files**:
  - `.vscode/scripts/copilot-context-manager.ts` - Main entry point

- **Commands**:
  ```powershell
  node .vscode/scripts/copilot-context-manager.ts --help
  node .vscode/scripts/copilot-context-manager.ts list
  ```

- **Expected Output**:
  - Help message displays available commands
  - List command shows context phases
  - No runtime errors
  - Script exits cleanly

- **Verification Steps**:
  1. Run script with `--help` flag
  2. Verify help text appears
  3. Run `list` command to show phases
  4. Confirm no import errors

- **Success**:
  - Script executes without errors
  - import.meta.url resolves correctly
  - lib/phases.ts and lib/cli.ts import successfully
  - Commands work as expected

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 100-130) - Script import analysis

- **Dependencies**:
  - Task 1.1 and 1.2 completion

## Phase 2: Volume Isolation

### Task 2.1: Create root .dockerignore

Create comprehensive .dockerignore to prevent build artifacts from polluting Docker contexts.

- **Files**:
  - `.dockerignore` - Root Docker ignore file (NEW)

- **Content Template**:
  ```dockerignore
  # Documentation for Docker build context exclusions
  # Prevents build artifacts from polluting images and slowing builds

  # === Dependencies ===
  node_modules/
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  pnpm-debug.log*
  .npm/
  .yarn/
  .pnpm-store/

  # === Build Outputs ===
  dist/
  build/
  out/
  .next/
  .vite/
  *.tsbuildinfo
  .tsbuildinfo

  # === Test Artifacts ===
  coverage/
  .nyc_output/
  test-results/
  playwright-report/
  e2e-results/

  # === Caches ===
  .cache/
  .eslintcache
  .stylelintcache
  .parcel-cache/
  .ruff_cache/
  __pycache__/
  *.pyc
  *.pyo
  *.pyd
  .pytest_cache/

  # === IDE & OS ===
  .vscode/
  .idea/
  *.swp
  *.swo
  *~
  .DS_Store
  Thumbs.db

  # === Environment & Secrets ===
  .env
  .env.*
  !.env.example
  *.key
  *.pem
  *.cert

  # === Git & Version Control ===
  .git/
  .gitignore
  .gitattributes
  .github/

  # === Documentation ===
  docs/
  *.md
  !README.md

  # === Logs ===
  logs/
  *.log
  npm-debug.log*
  ```

- **Success**:
  - File created at repository root
  - Docker builds exclude unnecessary files
  - Build context size reduced significantly

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 250-320) - Complete .dockerignore template
  - Docker Documentation - .dockerignore best practices

- **Dependencies**:
  - None (independent file creation)

### Task 2.2: Create server .dockerignore

Create workspace-specific .dockerignore for server directory.

- **Files**:
  - `server/.dockerignore` - Server Docker ignore file (NEW)

- **Content Template**:
  ```dockerignore
  # Server-specific Docker build context exclusions

  # === Dependencies ===
  node_modules/
  apps/*/node_modules/
  packages/*/node_modules/

  # === Build Outputs ===
  dist/
  apps/*/dist/
  packages/*/dist/
  .vite/
  apps/*/.vite/
  *.tsbuildinfo

  # === Test & Coverage ===
  coverage/
  apps/*/coverage/
  packages/*/coverage/
  test-results/

  # === Caches ===
  .cache/
  .eslintcache
  ```

- **Success**:
  - File created at `server/` directory
  - Workspace-specific artifacts excluded
  - Monorepo build optimized

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 322-365) - Server-specific exclusions

- **Dependencies**:
  - None (independent file creation)

### Task 2.3: Add DevContainer volume mounts

Configure DevContainer to use named volumes for node_modules isolation.

- **Files**:
  - `.devcontainer/devcontainer.json` - Add mounts array

- **Implementation**:
  Add `"mounts"` property to devcontainer.json after `"containerEnv"`:
  ```json
  {
    "containerEnv": {
      "NODE_ENV": "development"
    },
    "mounts": [
      "source=${localWorkspaceFolder},target=/workspaces,type=bind,consistency=cached",
      "source=react_scuba_root_node_modules,target=/workspaces/server/node_modules,type=volume",
      "source=react_scuba_web_node_modules,target=/workspaces/server/apps/web/node_modules,type=volume",
      "source=react_scuba_api_node_modules,target=/workspaces/server/apps/api/node_modules,type=volume",
      "source=react_scuba_content_node_modules,target=/workspaces/server/apps/content/node_modules,type=volume",
      "source=react_scuba_types_node_modules,target=/workspaces/server/packages/types/node_modules,type=volume",
      "source=react_scuba_ui_node_modules,target=/workspaces/server/packages/ui/node_modules,type=volume",
      "source=react_scuba_utils_node_modules,target=/workspaces/server/packages/utils/node_modules,type=volume",
      "source=react_scuba_config_node_modules,target=/workspaces/server/packages/config/node_modules,type=volume"
    ]
  }
  ```

- **Volume Strategy**:
  - Bind mount: Source code (`${localWorkspaceFolder}` → `/workspaces`)
  - Named volumes: Dependencies (8 node_modules directories)
  - Performance: 60-80% faster than bind-mounted dependencies (Windows/Mac)

- **Success**:
  - DevContainer configuration updated
  - 8 named volumes mounted for node_modules
  - Source code bind mount with cached consistency
  - Ready for container rebuild

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 150-250) - Volume mount strategy
  - VS Code DevContainer Documentation - Volume mounts

- **Dependencies**:
  - docker-compose.yml volumes (already defined)

### Task 2.4: Verify volume isolation

Test DevContainer rebuild and verify volumes are correctly mounted.

- **Commands**:
  ```powershell
  # Verify volumes exist
  docker volume ls | Select-String "react_scuba"

  # Inspect container mounts
  docker inspect <container-id> | Select-String "Mounts" -Context 20

  # Test volume contents
  docker exec -it <container-id> ls -la /workspaces/server/node_modules
  ```

- **Verification Steps**:
  1. Rebuild DevContainer (Command Palette: "Dev Containers: Rebuild Container")
  2. Wait for container to fully start
  3. Run `docker volume ls` to confirm volumes exist
  4. Check node_modules directories are mounted from volumes
  5. Test npm install writes to volumes, not bind mount
  6. Verify source code changes sync instantly

- **Expected Results**:
  - 8+ volumes visible with `react_scuba_` prefix
  - node_modules directories exist in container
  - Source files visible in `/workspaces`
  - Build artifacts isolated from host

- **Success**:
  - All expected volumes present
  - node_modules isolated in named volumes
  - Source code changes sync correctly
  - Build performance improved (measurable)

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 367-400) - Volume verification

- **Dependencies**:
  - Task 2.1, 2.2, 2.3 completion
  - Docker Desktop running

## Phase 3: Archive Management

### Task 3.1: Create archive directory structure

Prepare archive destination for completed tracking files.

- **Directories**:
  - `docs/archive/planning/` - NEW directory for planning artifacts

- **Commands**:
  ```powershell
  New-Item -ItemType Directory -Force -Path "docs/archive/planning"
  ```

- **Success**:
  - Directory created
  - Ready to receive archive files

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 195-220) - Archive structure

- **Dependencies**:
  - None (directory creation)

### Task 3.2: Move oversight remediation files

Move 4 completed tracking files to archive with proper naming.

- **Source Files**:
  - `.copilot-tracking/plans/20251029-oversight-remediation-plan.instructions.md`
  - `.copilot-tracking/details/20251029-oversight-remediation-details.md`
  - `.copilot-tracking/changes/20251029-oversight-remediation-changes.md`
  - `.copilot-tracking/research/20251029-oversight-remediation-research.md`

- **Destination Files**:
  - `docs/archive/planning/20251029-oversight-remediation-plan.md`
  - `docs/archive/planning/20251029-oversight-remediation-details.md`
  - `docs/archive/planning/20251029-oversight-remediation-changes.md`
  - `docs/archive/planning/20251029-oversight-remediation-research.md`

- **Commands**:
  ```powershell
  Move-Item -Path ".copilot-tracking/plans/20251029-oversight-remediation-plan.instructions.md" -Destination "docs/archive/planning/20251029-oversight-remediation-plan.md"
  Move-Item -Path ".copilot-tracking/details/20251029-oversight-remediation-details.md" -Destination "docs/archive/planning/20251029-oversight-remediation-details.md"
  Move-Item -Path ".copilot-tracking/changes/20251029-oversight-remediation-changes.md" -Destination "docs/archive/planning/20251029-oversight-remediation-changes.md"
  Move-Item -Path ".copilot-tracking/research/20251029-oversight-remediation-research.md" -Destination "docs/archive/planning/20251029-oversight-remediation-research.md"
  ```

- **Success**:
  - 4 files moved successfully
  - Original locations cleaned up
  - Archive structure organized

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 222-265) - Archive management

- **Dependencies**:
  - Task 3.1 completion

### Task 3.3: Create/update ARCHIVE_INDEX.md

Document archived oversight remediation in index file.

- **Files**:
  - `docs/archive/ARCHIVE_INDEX.md` - Create if doesn't exist, update if exists

- **Content to Add**:
  ```markdown
  ## Archive Index

  This directory contains completed planning artifacts, original documentation, and superseded files.

  ### Documentation Decomposition Oversight Remediation (2025-10-29)

  **Status**: ✅ Complete (20/20 tasks delivered)  
  **Implementation**: 5 phases addressing validation, testing, CI/CD, pre-commit hooks, and agent guidance

  **Files**:
  - [Plan](planning/20251029-oversight-remediation-plan.md) - Task checklist and phase breakdown
  - [Details](planning/20251029-oversight-remediation-details.md) - Comprehensive specifications
  - [Changes](planning/20251029-oversight-remediation-changes.md) - Implementation log
  - [Research](planning/20251029-oversight-remediation-research.md) - Research findings

  **Deliverables**:
  - TOC validation script (`.vscode/scripts/src/documentation/validate-toc.js`)
  - Documentation test suite (3 test files in `docs/.copilot/__tests__/`)
  - CI/CD workflows (`docs-validation.yml.disabled`, `docs-audit.yml.disabled`)
  - Pre-commit hooks (`install-hooks.js`, `pre-commit-docs.sh`)
  - AI Agent Guide (`docs/.copilot/AI-AGENT-GUIDE.md`)

  **Outcome**: Enterprise-grade documentation validation infrastructure with automated integrity checks preventing documentation drift.

  ---

  ### Original Documentation (Pre-Decomposition)

  **Location**: `original/`  
  **Status**: Superseded by `.copilot/` semantic structure
  ```

- **Success**:
  - ARCHIVE_INDEX.md created/updated
  - Entry documents completion clearly
  - Links to all 4 files working
  - Archive purpose explained

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 267-340) - Archive index template

- **Dependencies**:
  - Task 3.2 completion

### Task 3.4: Validate documentation links

Run validation to ensure archiving didn't break any cross-references.

- **Commands**:
  ```powershell
  npm run validate:docs
  npm run validate:toc
  ```

- **Verification Steps**:
  1. Run TOC validation script
  2. Run documentation test suite
  3. Check for broken links
  4. Verify all cross-references resolve

- **Expected Results**:
  - Zero TOC errors
  - All tests pass
  - No broken internal links
  - Archive links work correctly

- **Success**:
  - `npm run validate:docs` passes
  - No broken references detected
  - Archive documentation accessible
  - Project documentation integrity maintained

- **Research References**:
  - Previous oversight remediation work - Validation infrastructure

- **Dependencies**:
  - Task 3.3 completion
  - Phase 1 (oversight remediation) validation scripts

## Phase 4: Workflow Documentation

### Task 4.1: Document disabled workflows

Add section to README explaining GitHub Actions workflow status.

- **Files**:
  - `README.md` - Add "GitHub Actions Workflows" section

- **Content to Add**:
  ```markdown
  ## GitHub Actions Workflows

  **Status**: ⚠️ Workflows currently disabled

  All GitHub Actions workflows have been renamed with `.yml.disabled` extension to prevent automatic execution during initial development phase.

  **Disabled Workflows**:
  - `ci.yml.disabled` - Continuous integration and testing
  - `docs-validation.yml.disabled` - Documentation structure validation
  - `docs-audit.yml.disabled` - Weekly documentation health checks
  - `test-stacks.yml.disabled` - Multi-stack testing

  **Re-enabling Workflows**:

  When ready to activate CI/CD pipelines:

  1. Configure required secrets in repository settings:
     - `CODECOV_TOKEN` - Code coverage reporting (required for ci.yml)

  2. Rename workflows to remove `.disabled` extension:
     ```powershell
     cd .github/workflows
     Rename-Item -Path "ci.yml.disabled" -NewName "ci.yml"
     Rename-Item -Path "docs-validation.yml.disabled" -NewName "docs-validation.yml"
     Rename-Item -Path "docs-audit.yml.disabled" -NewName "docs-audit.yml"
     ```

  3. Test on feature branch first before enabling on main

  4. Monitor first runs for any configuration issues

  **Note**: The CODECOV_TOKEN warning is a false positive caused by linting disabled files. The secret usage syntax is correct.
  ```

- **Success**:
  - README.md updated with workflow status
  - Clear explanation of disabled state
  - Re-enable instructions provided
  - Secret requirements documented

- **Research References**:
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 185-195) - GitHub Actions analysis

- **Dependencies**:
  - None (documentation only)

### Task 4.2: Add workflow re-enable instructions

Provide detailed steps for activating workflows when ready.

- **Content** (continues from Task 4.1):
  Already included in Task 4.1 content under "Re-enabling Workflows" section

- **Additional Verification**:
  - Document CODECOV_TOKEN secret configuration process
  - Link to GitHub documentation for secret management
  - Explain workflow trigger conditions

- **Success**:
  - Complete re-enable instructions in README
  - Clear step-by-step process
  - Secret configuration explained
  - Testing strategy documented

- **Research References**:
  - GitHub Actions Documentation - Secret management
  - Template: `../research/20251029-critical-infrastructure-research.md` (Lines 185-195)

- **Dependencies**:
  - Task 4.1 completion

## Dependencies Summary

**External Dependencies**:
- Docker Desktop (existing) - Volume management ✅
- Node.js 20+ (existing) - Script execution ✅
- TypeScript 5.9+ (existing) - Compilation ✅
- npm workspaces (existing) - Monorepo management ✅

**Internal Dependencies**:
- `.vscode/scripts/lib/phases.ts` (exists) ✅
- `.vscode/scripts/lib/cli.ts` (exists) ✅
- `docker-compose.yml` volumes (defined) ✅
- `.copilot-tracking/` files (complete) ✅
- Phase 1 oversight remediation validation scripts ✅

**Blocking Issues**: NONE - All dependencies satisfied

## Success Criteria

**Phase 1: TypeScript Fix**
- ✅ `.vscode/scripts/copilot-context-manager.ts` compiles without errors
- ✅ Script executes successfully with --help flag
- ✅ No VS Code TypeScript errors in problems panel
- ✅ import.meta.url resolves correctly

**Phase 2: Volume Isolation**
- ✅ `.dockerignore` files created at root and server/
- ✅ DevContainer mounts 8 node_modules volumes
- ✅ `docker volume ls` shows all react_scuba volumes
- ✅ Build performance improved (60-80% faster on Windows)
- ✅ Source code changes sync instantly
- ✅ npm install writes to volumes, not host

**Phase 3: Archive Management**
- ✅ 4 files moved to docs/archive/planning/
- ✅ ARCHIVE_INDEX.md updated with comprehensive entry
- ✅ .copilot-tracking/ directories cleaned up
- ✅ No broken links detected (npm run validate:docs passes)
- ✅ Archive structure clear and navigable

**Phase 4: Documentation**
- ✅ README.md documents workflow status clearly
- ✅ Re-enable instructions complete and accurate
- ✅ CODECOV_TOKEN requirement documented
- ✅ False positive warning explained

## Implementation Notes

- **Phase 1** is CRITICAL - blocks all script usage
- **Phase 2** is HIGH priority - significantly improves developer experience
- **Phase 3** is MEDIUM priority - organizational cleanup
- **Phase 4** is LOW priority - informational only

**Total Estimated Time**: 70 minutes
- Phase 1: 15 minutes
- Phase 2: 30 minutes
- Phase 3: 15 minutes
- Phase 4: 10 minutes
