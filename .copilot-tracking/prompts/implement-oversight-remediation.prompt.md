---
agent: coder
model: Claude Sonnet 4
---

<!-- markdownlint-disable-file -->

# Implementation Prompt: Documentation Decomposition Oversight Remediation

## Implementation Instructions

### Step 1: Create Changes Tracking File

You WILL create `20251029-oversight-remediation-changes.md` in `.copilot-tracking/changes/` if it does not exist.

### Step 2: Execute Implementation

You WILL follow project standards from `.github/copilot-instructions.md`
You WILL systematically implement the plan at `.copilot-tracking/plans/20251029-oversight-remediation-plan.instructions.md` task-by-task
You WILL follow ALL project standards and conventions

**CRITICAL**: If ${input:phaseStop:true} is true, you WILL stop after each Phase for user review.
**CRITICAL**: If ${input:taskStop:false} is true, you WILL stop after each Task for user review.

**Implementation Order**:

1. **Phase 1: Core Validation Scripts** (2 hours)
   - Task 1.1: Create validate-toc.js script
   - Task 1.2: Add validation npm scripts
   - Task 1.3: Install required dependencies
   - Verify: `npm run validate:toc` executes successfully

2. **Phase 2: Test Suite Implementation** (3 hours)
   - Task 2.1: Create link-checker.test.ts
   - Task 2.2: Create orphan-detector.test.ts
   - Task 2.3: Create schema-validation.test.ts
   - Task 2.4: Update Vitest configuration
   - Verify: All tests pass

3. **Phase 3: CI/CD Integration** (2 hours)
   - Task 3.1: Create docs-validation.yml workflow
   - Task 3.2: Add PR comment action
   - Task 3.3: Create docs-audit.yml workflow
   - Verify: Workflow runs on feature branch

4. **Phase 4: Pre-commit Hook Setup** (1 hour)
   - Task 4.1: Create pre-commit-docs.sh
   - Task 4.2: Create install-hooks.js
   - Task 4.3: Add hook setup to README
   - Verify: Hook blocks invalid commits

5. **Phase 5: Agent Guidance Documentation** (2 hours)
   - Task 5.1: Create AI-AGENT-GUIDE.md
   - Task 5.2: Update toc.yml with guide
   - Task 5.3: Update MIGRATION.md
   - Task 5.4: Update copilot-instructions.md
   - Verify: Guide is complete and referenced

### Step 3: Cleanup

When ALL Phases are checked off (`[x]`) and completed you WILL do the following:

1. You WILL provide a markdown style link and a summary of all changes from `.copilot-tracking/changes/20251029-oversight-remediation-changes.md` to the user:
   - You WILL keep the overall summary brief
   - You WILL add spacing around any lists
   - You MUST wrap any reference to a file in a markdown style link

2. You WILL provide references to the planning documents (plan, details, and research files). You WILL recommend cleaning these files up as well.

3. **MANDATORY**: You WILL attempt to delete `.copilot-tracking/prompts/implement-oversight-remediation.prompt.md`

## Success Criteria

- [ ] Changes tracking file created
- [ ] Phase 1: Validation scripts working
- [ ] Phase 2: All tests passing
- [ ] Phase 3: CI/CD workflows running
- [ ] Phase 4: Pre-commit hook installed
- [ ] Phase 5: Agent guide complete
- [ ] All detailed specifications satisfied
- [ ] Project conventions followed
- [ ] Changes file updated continuously
- [ ] Zero broken references detected
- [ ] Documentation maintainable with clear guidelines
