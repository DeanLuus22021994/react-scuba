# Docker Compose Examples Extraction Checklist

Track your progress through the extraction process using this checklist.

## Pre-Extraction Verification

- [ ] Read [EXTRACTION_GUIDE.md](../EXTRACTION_GUIDE.md)
- [ ] Review [docs/docker-compose-submodule.md](../docs/docker-compose-submodule.md)
- [ ] Ensure git is installed: `git --version`
- [ ] Ensure clean working directory: `git status`
- [ ] Backup current state (optional): `git branch backup-$(date +%Y%m%d)`

## Repository Creation (Manual Step)

- [ ] Go to https://github.com/new
- [ ] Set repository name: `docker-compose-examples`
- [ ] Set owner: `DeanLuus22021994`
- [ ] Set visibility: Public or Private
- [ ] ⚠️ **Important**: Leave empty (no README, no .gitignore, no license)
- [ ] Click "Create repository"
- [ ] Copy repository URL: `https://github.com/DeanLuus22021994/docker-compose-examples.git`

## Automated Extraction (Recommended)

- [ ] Run extraction script: `./scripts/extract-docker-compose-examples.sh`
- [ ] Confirm repository exists when prompted
- [ ] Review extracted content in `/tmp/docker-compose-examples-extract`
- [ ] Confirm push to new repository (Y/n)
- [ ] Verify push succeeded on GitHub
- [ ] Confirm removal from react-scuba (Y/n)
- [ ] Confirm submodule addition (Y/n)
- [ ] Confirm push to react-scuba (Y/n)

**OR** Manual Extraction (if script fails):

## Manual Extraction (Alternative)

### Step 1: Extract Content
- [ ] Create temp directory: `mkdir -p /tmp/docker-compose-examples-extract`
- [ ] Copy content: `cp -r docker-compose-examples/* /tmp/docker-compose-examples-extract/`
- [ ] Copy hidden files: `cp -r docker-compose-examples/.[!.]* /tmp/docker-compose-examples-extract/ 2>/dev/null || true`
- [ ] Verify file count: `find /tmp/docker-compose-examples-extract -type f | wc -l` (should be ~81)

### Step 2: Initialize New Repository
- [ ] Navigate: `cd /tmp/docker-compose-examples-extract`
- [ ] Initialize: `git init`
- [ ] Add remote: `git remote add origin https://github.com/DeanLuus22021994/docker-compose-examples.git`
- [ ] Stage files: `git add .`
- [ ] Commit: `git commit -m "Extract docker-compose-examples for focused development"`
- [ ] Push: `git push -u origin main`
- [ ] Verify on GitHub: Visit https://github.com/DeanLuus22021994/docker-compose-examples

### Step 3: Remove from React Scuba
- [ ] Navigate: `cd /path/to/react-scuba`
- [ ] Remove directory: `git rm -r docker-compose-examples`
- [ ] Commit: `git commit -m "Remove docker-compose-examples to dedicated repo"`
- [ ] Push: `git push origin <branch-name>`

### Step 4: Add as Submodule
- [ ] Add submodule: `git submodule add https://github.com/DeanLuus22021994/docker-compose-examples.git docker-compose-examples`
- [ ] Verify .gitmodules: `cat .gitmodules`
- [ ] Stage changes: `git add .gitmodules docker-compose-examples`
- [ ] Commit: `git commit -m "Add docker-compose-examples as submodule for optional inclusion"`
- [ ] Push: `git push origin <branch-name>`

## Post-Extraction Verification

- [ ] Run verification script: `./scripts/verify-submodule-setup.sh`
- [ ] Check .gitmodules exists: `test -f .gitmodules && echo "✅" || echo "❌"`
- [ ] Check submodule status: `git submodule status`
- [ ] Verify key files exist: `ls docker-compose-examples/validate_stacks.py`
- [ ] Test submodule update: `git submodule update --init --recursive`

## Testing Workflows

### Test 1: Fresh Clone with Submodule
- [ ] Clone in new location: `cd /tmp && git clone --recurse-submodules https://github.com/DeanLuus22021994/react-scuba.git test-clone`
- [ ] Verify submodule populated: `ls test-clone/docker-compose-examples/validate_stacks.py`
- [ ] Clean up: `rm -rf test-clone`

### Test 2: Fresh Clone without Submodule
- [ ] Clone without submodule: `cd /tmp && git clone https://github.com/DeanLuus22021994/react-scuba.git test-clone-2`
- [ ] Verify submodule empty: `ls test-clone-2/docker-compose-examples/ | wc -l` (should be 0 or show git metadata only)
- [ ] Add submodule: `cd test-clone-2 && git submodule update --init --recursive`
- [ ] Verify populated: `ls docker-compose-examples/validate_stacks.py`
- [ ] Clean up: `cd /tmp && rm -rf test-clone-2`

### Test 3: Submodule Update
- [ ] Navigate to submodule: `cd docker-compose-examples`
- [ ] Check out main: `git checkout main`
- [ ] Make a test change: `echo "# Test" >> README.md`
- [ ] Commit: `git add . && git commit -m "Test commit"`
- [ ] Push: `git push origin main`
- [ ] Go back: `cd ..`
- [ ] Update reference: `git add docker-compose-examples && git commit -m "Update submodule"`
- [ ] Push: `git push`
- [ ] Revert test: `cd docker-compose-examples && git revert HEAD && git push origin main && cd ..`

### Test 4: Python Validation
- [ ] Navigate: `cd docker-compose-examples`
- [ ] Test validation: `python validate_stacks.py`
- [ ] Check exit code: `echo $?` (should be 0)
- [ ] Return: `cd ..`

### Test 5: VSCode Settings
- [ ] Open in VSCode: `code .`
- [ ] Check Python linting works (if configured)
- [ ] Verify no errors in .vscode/settings.json
- [ ] Test references to docker-compose-examples paths

## Documentation Updates

- [ ] Update team chat/wiki with submodule information
- [ ] Share quick reference: [docs/submodule-quick-reference.md](../docs/submodule-quick-reference.md)
- [ ] Add to onboarding documentation (if applicable)
- [ ] Update CI/CD to use `git clone --recurse-submodules` (if needed)

## Cleanup

- [ ] Remove temporary extraction directory: `rm -rf /tmp/docker-compose-examples-extract`
- [ ] Remove backup branch (if created): `git branch -D backup-<date>`
- [ ] Archive old documentation (if any)

## Success Criteria

All items below should be true:

- [ ] ✅ docker-compose-examples repository exists on GitHub
- [ ] ✅ docker-compose-examples repository has 81 files
- [ ] ✅ docker-compose-examples removed from react-scuba
- [ ] ✅ .gitmodules file exists in react-scuba
- [ ] ✅ `git submodule status` shows docker-compose-examples
- [ ] ✅ Fresh clone with `--recurse-submodules` works
- [ ] ✅ Fresh clone without flag works (submodule empty)
- [ ] ✅ Submodule can be added with `git submodule update --init`
- [ ] ✅ validate_stacks.py runs successfully
- [ ] ✅ VSCode settings references work correctly
- [ ] ✅ Verification script passes: `./scripts/verify-submodule-setup.sh`

## Rollback Plan (If Needed)

If something goes wrong and you need to rollback:

1. **Restore from backup**:
   ```bash
   git checkout backup-<date>
   ```

2. **Or restore from last commit**:
   ```bash
   git reset --hard HEAD~1
   git push -f origin <branch-name>
   ```

3. **Or manually restore directory**:
   ```bash
   # Clone the extracted repo
   git clone https://github.com/DeanLuus22021994/docker-compose-examples.git
   
   # Remove submodule
   git submodule deinit docker-compose-examples
   git rm docker-compose-examples
   rm -rf .git/modules/docker-compose-examples
   
   # Move extracted content back
   mv docker-compose-examples /path/to/react-scuba/
   
   # Commit
   cd /path/to/react-scuba
   git add docker-compose-examples
   git commit -m "Restore docker-compose-examples directory"
   ```

## Notes

- **Date Started**: _________________
- **Date Completed**: _________________
- **Performed By**: _________________
- **Issues Encountered**: _________________
- **Resolution**: _________________

## References

- [EXTRACTION_GUIDE.md](../EXTRACTION_GUIDE.md) - Detailed instructions
- [docs/docker-compose-submodule.md](../docs/docker-compose-submodule.md) - Usage guide
- [docs/submodule-quick-reference.md](../docs/submodule-quick-reference.md) - Quick reference
- [scripts/README.md](../scripts/README.md) - Scripts documentation

---

**Status**: ⬜ Not Started | 🔄 In Progress | ✅ Completed

Mark this checklist as you complete each step. Good luck! 🚀
