---
agent: coder
model: Claude Sonnet 4.5 (copilot)
---

<!-- markdownlint-disable-file -->

# Implementation Prompt: VS Code Language Server False Positive Resolution

## Implementation Instructions

### Step 1: Verify Changes Tracking File

You WILL verify that `20251029-vscode-language-server-changes.md` exists in `.copilot-tracking/changes/`.

**Verification**:
```powershell
Test-Path ".copilot-tracking\changes\20251029-vscode-language-server-changes.md"
```

### Step 2: Execute Implementation

You WILL follow project standards from `.github/copilot-instructions.md`
You WILL systematically implement the plan at `.copilot-tracking/plans/20251029-vscode-language-server-plan.instructions.md` task-by-task
You WILL follow ALL project standards and conventions

**CRITICAL**: If ${input:phaseStop:true} is true, you WILL stop after each Phase for user review.
**CRITICAL**: If ${input:taskStop:false} is true, you WILL stop after each Task for user review.

### Implementation Phases

#### Phase 1: TypeScript Language Server Restart (1 minute)

**IMPORTANT**: This is a MANUAL action - AI agent CANNOT automate Command Palette actions

You WILL instruct the user to:

1. Open VS Code Command Palette:
   - Windows: `Ctrl+Shift+P`
   - Mac: `Cmd+Shift+P`

2. Type and execute:
   ```
   TypeScript: Restart TS Server
   ```

3. Wait 2-3 seconds for language server restart

4. Verify Problems panel:
   - Open: `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
   - Expected: 0 TypeScript errors

**If Restart Fails**:
```
Alternative: Command Palette → "Developer: Reload Window"
Warning: This loses unsaved changes and editor state
```

**Update Changes File**:
- Mark Task 1.1 status based on user feedback
- Document timestamp and outcome
- Note if alternative solution was required

#### Phase 2: Verification (2 minutes)

You WILL execute verification commands:

**Task 2.1: TypeScript Compilation**
```powershell
cd .vscode/scripts
npx tsc --noEmit
if($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript compilation clean" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript errors detected (exit code: $LASTEXITCODE)" -ForegroundColor Red
}
cd ../..
```

**Task 2.2: Script Execution**
```powershell
cd .vscode/scripts
npx tsx copilot-context-manager.ts --help
if($LASTEXITCODE -eq 0) {
    Write-Host "✅ Script execution successful" -ForegroundColor Green
} else {
    Write-Host "❌ Script execution failed (exit code: $LASTEXITCODE)" -ForegroundColor Red
}
cd ../..
```

**Task 2.3: VS Code Problems Panel**
You WILL ask user to:
1. Open Problems panel (`Ctrl+Shift+M`)
2. Check TypeScript error count
3. Open `.vscode/scripts/copilot-context-manager.ts`
4. Verify line 17 has no red squiggles
5. Report findings

**Update Changes File**:
- Document all command results
- Record exit codes and output
- Note user feedback on Problems panel
- Mark tasks as complete/failed

#### Phase 3: Documentation (5 minutes)

You WILL update project documentation:

**Task 3.1: Add Troubleshooting to `.github/copilot-instructions.md`**

1. Read current file to find appropriate section
2. Add troubleshooting content:
   ```markdown
   ## Troubleshooting

   ### TypeScript Language Server False Positives

   **Symptom**: VS Code Problems panel shows TypeScript errors, but `npx tsc --noEmit` compiles cleanly

   **Cause**: VS Code TypeScript language server cache not updated after tsconfig.json changes

   **Solution**:
   1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
   2. Execute: "TypeScript: Restart TS Server"
   3. Wait 2-3 seconds for reinitialization
   4. Verify Problems panel cleared

   **Alternative** (if restart doesn't work):
   1. Command Palette → "Developer: Reload Window"
   2. Accepts loss of unsaved changes and editor state

   **Prevention**: Restart TS Server after any tsconfig.json modifications
   ```

**Task 3.2: Create/Update Troubleshooting Guide**

1. Check if `docs/.copilot/getting-started/troubleshooting.md` exists
2. If not exists, create new file
3. If exists, append VS Code section
4. Content: Complete troubleshooting guide with 3 solution options

**Task 3.3: Validate Documentation**
```powershell
cd server
npm run validate:toc
if($LASTEXITCODE -eq 0) {
    Write-Host "✅ Documentation validation passed" -ForegroundColor Green
} else {
    Write-Host "❌ Documentation validation failed" -ForegroundColor Red
}
cd ..
```

**Update Changes File**:
- List files modified
- Document sections added
- Record validation results

### Step 3: Final Verification

When ALL Phases are checked off (`[x]`) and completed you WILL do the following:

**Final Checks**:
```powershell
# 1. TypeScript compilation
cd .vscode/scripts
npx tsc --noEmit

# 2. Script execution
npx tsx copilot-context-manager.ts --help

# 3. Documentation validation
cd ../../server
npm run validate:toc

# 4. Git status
cd ..
git status
```

**Expected Results**:
- ✅ TypeScript compilation clean (exit code 0)
- ✅ Script executes successfully
- ✅ Documentation validation passes
- ✅ User confirms Problems panel shows 0 errors
- ✅ All changes staged for commit

### Step 4: Provide Summary

You WILL provide a markdown style link and summary of all changes from `../changes/20251029-vscode-language-server-changes.md`:

**Summary Format**:
```markdown
## Implementation Complete ✅

[View Full Changes](../changes/20251029-vscode-language-server-changes.md)

**Phases Complete**: 3 / 3
**Tasks Complete**: 6 / 6
**Time Taken**: ~X minutes

**Changes Summary**:

- **Phase 1**: TypeScript language server restarted (manual Command Palette action)
  - Result: Problems panel cleared (0 TypeScript errors)

- **Phase 2**: Verification completed
  - TypeScript compilation: ✅ Clean (exit code 0)
  - Script execution: ✅ Functional
  - Problems panel: ✅ No errors displayed

- **Phase 3**: Documentation updated
  - `.github/copilot-instructions.md`: Troubleshooting section added
  - `docs/.copilot/getting-started/troubleshooting.md`: Complete guide created
  - Validation: ✅ Passed

**Result**: VS Code language server false positive resolved, solution documented for future reference.
```

### Step 5: Cleanup Recommendations

You WILL provide markdown style links to planning documents:

**Planning Documents** (ready for archival when complete):
- [Plan](../plans/20251029-vscode-language-server-plan.instructions.md)
- [Details](../details/20251029-vscode-language-server-details.md)
- [Research](../research/20251029-vscode-language-server-research.md)
- [Changes](../changes/20251029-vscode-language-server-changes.md)

**Archival Steps** (when user confirms complete):
1. Move 4 planning files to `docs/archive/planning/`
2. Update `docs/archive/ARCHIVE_INDEX.md` with new iteration
3. Delete this prompt file

### Step 6: Delete Prompt File

**MANDATORY**: You WILL attempt to delete this prompt file after providing summary:

```powershell
Remove-Item ".copilot-tracking\prompts\implement-vscode-language-server.prompt.md" -ErrorAction SilentlyContinue
Write-Host "✅ Prompt file deleted" -ForegroundColor Green
```

## Success Criteria

- [ ] Changes tracking file exists and accessible
- [ ] User successfully restarted TypeScript language server
- [ ] VS Code Problems panel shows 0 TypeScript errors
- [ ] TypeScript compilation clean (0 errors)
- [ ] Script execution functional
- [ ] Documentation updated in 2 locations
- [ ] Documentation validation passed
- [ ] Changes file updated throughout implementation
- [ ] Summary provided with markdown links
- [ ] Archival recommendations given
- [ ] Prompt file deleted

## Implementation Time Budget

**Estimated**: 8 minutes total
- Phase 1: 1 minute (manual Command Palette action)
- Phase 2: 2 minutes (verification commands)
- Phase 3: 5 minutes (documentation updates)

**Actual**: _To be recorded in changes file_

## Notes for Implementation Agent

**Critical Constraints**:
- Phase 1 requires USER action (cannot be automated)
- Must wait for user confirmation before proceeding to Phase 2
- Phase 2 automated (PowerShell commands)
- Phase 3 automated (file edits)
- phaseStop=true allows user review after each phase

**User Interaction Required**:
1. Phase 1: Command Palette action (manual)
2. Phase 2 Task 2.3: Problems panel verification (visual check)
3. Step 3: Final confirmation of Problems panel state

**Low Risk Operations**:
- No code changes (only documentation)
- No configuration changes
- No system modifications
- Easily reversible if needed

---

**Ready to Execute**: User must perform manual Phase 1 action, then agent can proceed with verification and documentation
