---
mode: agent
model: Claude Sonnet 4
---

<!-- markdownlint-disable-file -->

# Implementation Prompt: Critical Infrastructure Remediation & Archive Management

## Implementation Instructions

### Step 1: Create Changes Tracking File

You WILL create `20251029-critical-infrastructure-changes.md` in `.copilot-tracking/changes/` if it does not exist.

### Step 2: Execute Implementation

You WILL follow project standards from `.github/copilot-instructions.md`
You WILL systematically implement the plan at `.copilot-tracking/plans/20251029-critical-infrastructure-plan.instructions.md` task-by-task
You WILL follow ALL project standards and conventions

**CRITICAL**: If ${input:phaseStop:true} is true, you WILL stop after each Phase for user review.
**CRITICAL**: If ${input:taskStop:false} is true, you WILL stop after each Task for user review.

**Implementation Order**:

1. **Phase 1: TypeScript Import Fix** (15 minutes) - CRITICAL
   - Task 1.1: Update `.vscode/scripts/tsconfig.json` module resolution to `nodenext`
   - Task 1.2: Verify TypeScript compilation with `npx tsc --noEmit`
   - Task 1.3: Test script execution with `--help` flag
   - Verify: No TypeScript errors, script runs successfully

2. **Phase 2: Volume Isolation** (30 minutes) - HIGH
   - Task 2.1: Create root `.dockerignore` file
   - Task 2.2: Create `server/.dockerignore` file
   - Task 2.3: Add volume mounts to `.devcontainer/devcontainer.json`
   - Task 2.4: Verify volumes with `docker volume ls`
   - Verify: 8 named volumes mounted, build artifacts isolated

3. **Phase 3: Archive Management** (15 minutes) - MEDIUM
   - Task 3.1: Create `docs/archive/planning/` directory
   - Task 3.2: Move 4 oversight remediation files to archive
   - Task 3.3: Create/update `docs/archive/ARCHIVE_INDEX.md`
   - Task 3.4: Run `npm run validate:docs` to verify links
   - Verify: Files archived, no broken links

4. **Phase 4: Workflow Documentation** (10 minutes) - LOW
   - Task 4.1: Add GitHub Actions section to README.md
   - Task 4.2: Document workflow re-enable process
   - Verify: Clear documentation of disabled workflows

### Step 3: Cleanup

When ALL Phases are checked off (`[x]`) and completed you WILL do the following:

1. You WILL provide a markdown style link and a summary of all changes from `.copilot-tracking/changes/20251029-critical-infrastructure-changes.md` to the user:
   - You WILL keep the overall summary brief
   - You WILL add spacing around any lists
   - You MUST wrap any reference to a file in a markdown style link

2. You WILL provide markdown style links to [`.copilot-tracking/plans/20251029-critical-infrastructure-plan.instructions.md`], [`.copilot-tracking/details/20251029-critical-infrastructure-details.md`], and [`.copilot-tracking/research/20251029-critical-infrastructure-research.md`] documents. You WILL recommend cleaning these files up as well.

3. **MANDATORY**: You WILL attempt to delete `.copilot-tracking/prompts/implement-critical-infrastructure.prompt.md`

## Success Criteria

- [ ] Changes tracking file created
- [ ] Phase 1: TypeScript script compiles and executes without errors
- [ ] Phase 2: DevContainer mounts 8 node_modules volumes, artifacts isolated
- [ ] Phase 3: 4 oversight remediation files archived, index updated
- [ ] Phase 4: README.md documents workflow status
- [ ] All detailed specifications satisfied
- [ ] Project conventions followed
- [ ] Changes file updated continuously
- [ ] Zero broken references detected
- [ ] Build performance measurably improved

## Notes

**Priority**: Phase 1 is CRITICAL (blocks development), Phase 2 is HIGH (performance), Phase 3 is MEDIUM (cleanup), Phase 4 is LOW (documentation)

**Total Estimated Time**: 70 minutes

**Risk Mitigation**:
- Phase 1: Run full type check after changes
- Phase 2: Prune stale volumes before rebuild if needed
- Phase 3: Validate documentation links after archiving
- Phase 4: Test workflow re-enable on feature branch first
