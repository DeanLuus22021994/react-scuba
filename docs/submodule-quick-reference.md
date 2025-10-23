# Git Submodule Quick Reference

Quick reference for working with the docker-compose-examples submodule.

## 🚀 Quick Commands

### First Time Setup

```bash
# Clone with submodule
git clone --recurse-submodules https://github.com/DeanLuus22021994/react-scuba.git

# Or add submodule to existing clone
git submodule update --init --recursive
```

### Daily Operations

```bash
# Check submodule status
git submodule status

# Update submodule to latest
git submodule update --remote docker-compose-examples

# Work in submodule
cd docker-compose-examples
git checkout main
# ... make changes ...
git add .
git commit -m "Changes"
git push origin main
cd ..

# Update submodule reference in main repo
git add docker-compose-examples
git commit -m "Update docker-compose-examples"
git push
```

### Validation

```bash
# Verify setup
./scripts/verify-submodule-setup.sh

# Test Docker stacks
cd docker-compose-examples
python validate_stacks.py
python validate_stacks.py --build --test
```

## 📋 Common Scenarios

### Scenario: Just cloned and need Docker examples

```bash
git submodule update --init --recursive
```

### Scenario: Submodule shows "modified content"

```bash
cd docker-compose-examples
git status  # See what changed
git add . && git commit -m "Save changes"  # Or
git reset --hard  # Discard changes
```

### Scenario: Can't push to submodule

```bash
cd docker-compose-examples
git checkout main
git pull origin main
# Now you can push
```

### Scenario: Update to latest Docker examples

```bash
git submodule update --remote docker-compose-examples
git add docker-compose-examples
git commit -m "Update docker-compose-examples to latest"
git push
```

### Scenario: Remove Docker examples (temporarily)

```bash
rm -rf docker-compose-examples
# Restore later with:
git submodule update --init --recursive
```

## 🎯 One-Liners

```bash
# Clone with submodules
git clone --recurse-submodules <url>

# Update all submodules
git submodule update --remote

# Check all submodule status
git submodule foreach git status

# Pull latest for all submodules
git submodule foreach git pull origin main

# Reset all submodules
git submodule foreach git reset --hard
```

## 🔗 Links

- Full Guide: [docker-compose-submodule.md](./docker-compose-submodule.md)
- Extraction Guide: [../EXTRACTION_GUIDE.md](../EXTRACTION_GUIDE.md)
- Scripts: [../scripts/README.md](../scripts/README.md)

## ⚠️ Important Notes

1. **Detached HEAD**: Submodules start in detached HEAD state. Always `git checkout main` before making changes.
2. **Two Commits**: Changes in submodule require committing in both the submodule and main repo.
3. **Push Order**: Push submodule changes first, then main repo changes.
4. **Update Carefully**: `git submodule update` can discard local changes. Commit first!

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Submodule empty | `git submodule update --init --recursive` |
| Can't push | `cd docker-compose-examples && git checkout main` |
| Modified content | `cd docker-compose-examples && git status` |
| Wrong version | `git submodule update --remote` |
| Clone without submodule | Don't use `--recurse-submodules` flag |

---

**Tip**: Add this to your shell aliases:

```bash
# ~/.bashrc or ~/.zshrc
alias gsub='git submodule update --init --recursive'
alias gsubr='git submodule update --remote'
alias gsubs='git submodule status'
```
