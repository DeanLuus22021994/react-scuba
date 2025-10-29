<!-- markdownlint-disable-file -->

# Task Details: VS Code Language Server False Positive Resolution

## Research Reference

**Source Research**: Template: `../research/20251029-vscode-language-server-research.md`

**Context**: VS Code TypeScript language server showing false positive error despite correct configuration and clean compilation.

## Phase 1: TypeScript Language Server Restart

### Task 1.1: Restart TypeScript language server via Command Palette

**Problem Summary**:
- VS Code Problems panel shows 1 TypeScript error
- Error location: `.vscode/scripts/copilot-context-manager.ts` Line 17
- Error message: "import.meta not allowed" (despite correct configuration)
- TypeScript CLI compilation: ✅ Clean (0 errors)
- Script execution: ✅ Functional

**Root Cause**:
VS Code TypeScript language server using stale cache despite correct tsconfig.json being in place.

**Solution**: Restart TypeScript language server to clear cache

**Implementation Steps**:

1. Open VS Code Command Palette:
   - Windows: `Ctrl+Shift+P`
   - Mac: `Cmd+Shift+P`

2. Type command name:
   ```
   TypeScript: Restart TS Server
   ```

3. Select command from dropdown list

4. Wait for language server restart:
   - Duration: 2-3 seconds
   - Indication: VS Code status bar shows "Initializing TypeScript language features"

5. Verify Problems panel:
   - Open Problems panel: `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
   - Expected result: 0 TypeScript errors

**Alternative Solutions** (If Option A fails):

**Option B: Reload VS Code Window**
```
Command Palette → "Developer: Reload Window"
Duration: ~10 seconds
Trade-off: Loses editor state (open files, unsaved changes)
```

**Option C: Delete TypeScript Language Server Cache**
```powershell
# 1. Close VS Code completely

# 2. Delete cache (Windows)
Remove-Item "$env:APPDATA\Code\User\workspaceStorage\*\typescript" -Recurse -Force

# 3. Restart VS Code
# Duration: ~30 seconds (full reinitialization)
```

**Success Criteria**:
- ✅ VS Code Problems panel shows 0 errors
- ✅ `.vscode/scripts/copilot-context-manager.ts` has no red squiggles at line 17
- ✅ Status bar shows no TypeScript errors
- ✅ Language server fully initialized (no pending operations)

**Research References**:
- Template: `../research/20251029-vscode-language-server-research.md` (Lines 95-180) - Solution options analysis
- VS Code Documentation - TypeScript language server management

**Dependencies**:
- None (independent action)

---

## Phase 2: Verification

### Task 2.1: Verify TypeScript compilation

**Purpose**: Ensure TypeScript CLI compilation remains clean after language server restart

**Implementation Steps**:

1. Open terminal in `.vscode/scripts/` directory:
   ```powershell
   cd .vscode/scripts
   ```

2. Run TypeScript compiler in check mode:
   ```powershell
   npx tsc --noEmit
   ```

3. Verify exit code:
   ```powershell
   echo $LASTEXITCODE
   # Expected: 0 (success)
   ```

4. Expected output:
   ```
   (No output - compilation clean)
   ```

**If Errors Occur**:
- Review error messages carefully
- Errors indicate configuration regression (unlikely)
- Check if tsconfig.json was modified
- Compare with archived working version

**Success Criteria**:
- ✅ `npx tsc --noEmit` exit code 0
- ✅ No compilation errors displayed
- ✅ No warnings displayed
- ✅ Command completes in <5 seconds

**Research References**:
- Template: `../research/20251029-vscode-language-server-research.md` (Lines 45-92) - Configuration verification
- Archived: `docs/archive/planning/20251029-post-implementation-research.md` - Previous compilation verification

**Dependencies**:
- Phase 1 complete (language server restarted)

---

### Task 2.2: Verify script execution

**Purpose**: Ensure script functionality remains intact after language server restart

**Implementation Steps**:

1. Ensure in `.vscode/scripts/` directory:
   ```powershell
   cd .vscode/scripts
   ```

2. Execute script with help flag:
   ```powershell
   npx tsx copilot-context-manager.ts --help
   ```

3. Verify help text displays:
   ```
   Expected output:
   - Usage information
   - Available commands
   - Option descriptions
   ```

4. Test actual script execution (optional):
   ```powershell
   npx tsx copilot-context-manager.ts
   ```

**Expected Results**:
- Script executes without errors
- Help text displays correctly
- No runtime errors
- import.meta.url resolves correctly

**If Errors Occur**:
- Check error message carefully
- Verify Node.js version supports ESM (v20+)
- Verify tsx package installed
- Check file permissions

**Success Criteria**:
- ✅ Script executes successfully
- ✅ Help text displays
- ✅ No runtime errors
- ✅ Exit code 0

**Research References**:
- Template: `../research/20251029-vscode-language-server-research.md` (Lines 60-75) - Script execution verification
- `.vscode/scripts/copilot-context-manager.ts` - Script source code

**Dependencies**:
- Phase 1 complete (language server restarted)
- Task 2.1 complete (compilation verified)

---

### Task 2.3: Verify VS Code Problems panel

**Purpose**: Confirm VS Code UI shows no TypeScript errors

**Implementation Steps**:

1. Open Problems panel:
   - Windows: `Ctrl+Shift+M`
   - Mac: `Cmd+Shift+M`
   - Menu: View → Problems

2. Check error count:
   - Top of Problems panel shows count
   - Expected: "No problems have been detected"

3. Filter by TypeScript:
   - Click filter icon
   - Ensure TypeScript errors = 0

4. Open affected file:
   - Open `.vscode/scripts/copilot-context-manager.ts`
   - Navigate to line 17
   - Verify no red squiggles on `import.meta.url`

5. Check status bar:
   - Bottom right corner
   - TypeScript icon should show "TypeScript"
   - No error indicator

**Visual Indicators**:
- ✅ No red squiggles in code
- ✅ No error count badge
- ✅ Problems panel empty or only non-TypeScript issues
- ✅ Status bar shows TypeScript initialized

**If Errors Still Shown**:
- Wait 10 seconds (language server may still be initializing)
- Check if error is different from original
- Try Option B: Reload VS Code Window
- If still failing, try Option C: Delete cache

**Success Criteria**:
- ✅ Problems panel shows 0 TypeScript errors
- ✅ No red squiggles at line 17 in copilot-context-manager.ts
- ✅ Status bar shows TypeScript active (no errors)
- ✅ Language server fully initialized

**Research References**:
- Template: `../research/20251029-vscode-language-server-research.md` (Lines 20-60) - Error display analysis
- VS Code Documentation - Problems panel usage

**Dependencies**:
- Phase 1 complete (language server restarted)

---

## Phase 3: Documentation

### Task 3.1: Document solution in project documentation

**Purpose**: Prevent future confusion, provide troubleshooting guidance for team

**Files to Update**:

**File 1: `.github/copilot-instructions.md`**

Add to "Common Commands" or "Troubleshooting" section:

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

**File 2: `docs/.copilot/getting-started/troubleshooting.md`** (Create if doesn't exist)

```markdown
# Troubleshooting Guide

## VS Code Language Server Issues

### TypeScript Error Despite Clean Compilation

**Problem**:
- VS Code shows TypeScript error in Problems panel
- `npx tsc --noEmit` returns 0 errors (clean)
- Code executes successfully

**Root Cause**:
VS Code TypeScript language server uses internal cache that may not update when tsconfig.json changes.

**Solution Steps**:

1. **Option A: Restart TS Server** (Recommended)
   - Open Command Palette: `Ctrl+Shift+P` (Windows) / `Cmd+Shift+P` (Mac)
   - Execute: "TypeScript: Restart TS Server"
   - Duration: 2-3 seconds
   - Preserves editor state

2. **Option B: Reload Window** (If A fails)
   - Open Command Palette: `Ctrl+Shift+P`
   - Execute: "Developer: Reload Window"
   - Duration: ~10 seconds
   - **Warning**: Loses unsaved changes

3. **Option C: Clear Cache** (Nuclear option)
   ```powershell
   # Close VS Code completely
   Remove-Item "$env:APPDATA\Code\User\workspaceStorage\*\typescript" -Recurse -Force
   # Restart VS Code
   ```

**Verification**:
- Problems panel shows 0 TypeScript errors
- No red squiggles in code
- Status bar shows TypeScript initialized

**Related Issues**:
- [20251029-vscode-language-server](../../archive/planning/20251029-vscode-language-server-research.md)
```

**Implementation Steps**:

1. Check if `.github/copilot-instructions.md` has "Troubleshooting" section
2. Add troubleshooting content to appropriate location
3. Create `docs/.copilot/getting-started/troubleshooting.md` if needed
4. Add cross-references between documents
5. Verify markdown formatting with `npm run validate:docs`

**Success Criteria**:
- ✅ Troubleshooting section added to `.github/copilot-instructions.md`
- ✅ Troubleshooting guide created/updated in `docs/.copilot/getting-started/`
- ✅ Documentation passes validation (`npm run validate:docs`)
- ✅ Solution clearly documented with exact commands
- ✅ Alternative solutions provided (escalation path)

**Research References**:
- Template: `../research/20251029-vscode-language-server-research.md` (Lines 95-220) - Complete solution analysis
- Existing troubleshooting patterns in documentation

**Dependencies**:
- Phase 1 complete (solution verified working)
- Phase 2 complete (verification passed)

---

## Dependencies Summary

**External Dependencies**:
- VS Code (existing) - Editor with Command Palette ✅
- TypeScript language server (built-in) ✅
- Node.js 20+ (existing) - For script execution ✅

**Internal Dependencies**:
- `.vscode/scripts/tsconfig.json` (correct config in place) ✅
- `.github/copilot-instructions.md` (documentation file) ✅
- `docs/.copilot/getting-started/` (documentation directory) ✅

**Blocking Issues**: NONE - All dependencies satisfied

## Success Criteria

**Phase 1: Language Server Restart**
- ✅ Command Palette action executed
- ✅ Language server restarted successfully
- ✅ Problems panel shows 0 errors

**Phase 2: Verification**
- ✅ TypeScript compilation clean (exit code 0)
- ✅ Script execution functional
- ✅ VS Code Problems panel clear
- ✅ No red squiggles in code

**Phase 3: Documentation**
- ✅ `.github/copilot-instructions.md` updated
- ✅ Troubleshooting guide created/updated
- ✅ Documentation validated
- ✅ Cross-references added

## Implementation Time Estimates

- **Phase 1**: 1 minute (Command Palette action)
- **Phase 2**: 2 minutes (verification commands)
- **Phase 3**: 5 minutes (documentation updates)
- **Total**: 8 minutes

## Implementation Notes

- **Phase 1** is manual (cannot be automated via terminal)
- **Phase 2** validates no regression
- **Phase 3** prevents future confusion
- All phases low-risk (no code changes)
- No breaking changes or system modifications
