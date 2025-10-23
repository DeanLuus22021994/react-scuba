# Docker Compose Examples - Extraction Guide

This guide provides step-by-step instructions for extracting the `docker-compose-examples` directory into its own repository and setting it up as a git submodule.

## 📋 Overview

**Goal**: Separate Docker infrastructure code from React application code while maintaining easy integration through git submodules.

**Benefits**:
- 🎯 Focused repositories (React vs Docker)
- 📦 Optional inclusion (clone only what you need)
- 🔄 Independent versioning
- 🧹 Cleaner main repository
- 🚀 Faster clones for React-only development

## 🔧 Prerequisites

Before starting the extraction process:

1. ✅ **Git installed**: `git --version`
2. ✅ **GitHub account**: Access to DeanLuus22021994 organization
3. ✅ **Repository permissions**: Write access to both repositories
4. ✅ **Clean working directory**: Commit or stash any changes

## 🚀 Extraction Methods

You can choose between automated or manual extraction:

### Method 1: Automated (Recommended)

Use the provided extraction script:

```bash
# Run the extraction script
./scripts/extract-docker-compose-examples.sh
```

The script will:
1. ✅ Verify prerequisites
2. 🔍 Check repository status
3. 📦 Extract content
4. 🔧 Initialize git repository
5. 📤 Push to GitHub
6. 🗑️ Remove from react-scuba
7. 📥 Add as submodule

**Interactive prompts** guide you through each step.

### Method 2: Manual

If you prefer manual control, follow these steps:

#### Step 1: Create the GitHub Repository

1. Go to https://github.com/new
2. Set **Repository name**: `docker-compose-examples`
3. Set **Owner**: DeanLuus22021994
4. Set **Visibility**: Public or Private (your choice)
5. ⚠️ **Important**: Leave empty (no README, no .gitignore, no license)
6. Click **Create repository**

#### Step 2: Extract and Push Content

```bash
# Create temporary directory for extraction
mkdir -p /tmp/docker-compose-examples-extract
cd /tmp/docker-compose-examples-extract

# Copy docker-compose-examples content
cp -r /path/to/react-scuba/docker-compose-examples/* .
cp -r /path/to/react-scuba/docker-compose-examples/.[!.]* . 2>/dev/null || true

# Initialize git repository
git init
git remote add origin https://github.com/DeanLuus22021994/docker-compose-examples.git

# Commit and push
git add .
git commit -m "Extract docker-compose-examples for focused development

This extraction creates a dedicated repository for Docker Compose examples,
enabling focused development and optional inclusion via git submodules.

Content includes:
- Basic stack (Node.js, Python FastAPI, PostgreSQL)
- Cluster example (Load-balanced nginx)
- Swarm stack (Docker Swarm orchestration)
- MCP Python utilities (Testing and validation)
- Validation script (validate_stacks.py)

Extracted from: react-scuba repository"

git push -u origin main
```

#### Step 3: Remove from react-scuba

```bash
# Go to react-scuba repository
cd /path/to/react-scuba

# Remove docker-compose-examples directory
git rm -r docker-compose-examples

# Commit removal
git commit -m "Remove docker-compose-examples to dedicated repo

Extracted to: https://github.com/DeanLuus22021994/docker-compose-examples
Will be re-added as git submodule for optional inclusion"

# Push changes
git push origin main  # or your current branch
```

#### Step 4: Add as Submodule

```bash
# Still in react-scuba repository
git submodule add https://github.com/DeanLuus22021994/docker-compose-examples.git docker-compose-examples

# Commit submodule addition
git add .gitmodules docker-compose-examples
git commit -m "Add docker-compose-examples as submodule for optional inclusion

This allows developers to:
- Clone react-scuba without Docker examples
- Include Docker examples on-demand with: git submodule update --init
- Work on Docker examples independently
- Update Docker examples with: git submodule update --remote"

# Push changes
git push origin main  # or your current branch
```

## ✅ Verification

After extraction, verify the setup:

```bash
# Run verification script
./scripts/verify-submodule-setup.sh
```

Expected output:
- ✅ .gitmodules file exists
- ✅ Submodule configured in git
- ✅ Key files present in submodule
- ✅ References in main repository work

## 📚 Post-Extraction Usage

### For New Clones

**React development only** (no Docker):
```bash
git clone https://github.com/DeanLuus22021994/react-scuba.git
cd react-scuba
npm install
```

**Full stack development** (React + Docker):
```bash
git clone --recurse-submodules https://github.com/DeanLuus22021994/react-scuba.git
cd react-scuba
npm install
```

**Add Docker examples later**:
```bash
git submodule update --init --recursive
```

### Working with Submodule

**Update submodule to latest**:
```bash
git submodule update --remote docker-compose-examples
git add docker-compose-examples
git commit -m "Update docker-compose-examples submodule"
```

**Make changes in submodule**:
```bash
cd docker-compose-examples
git checkout main
# ... make changes ...
git add .
git commit -m "Your changes"
git push origin main
cd ..
git add docker-compose-examples
git commit -m "Update docker-compose-examples reference"
```

**Validate Docker stacks**:
```bash
cd docker-compose-examples
python validate_stacks.py
python validate_stacks.py --build --test
```

## 🐛 Troubleshooting

### Issue: "Repository does not exist"
**Solution**: Make sure you created the repository on GitHub first
```bash
# Check if repository exists
curl -I https://github.com/DeanLuus22021994/docker-compose-examples
```

### Issue: "Permission denied"
**Solution**: Check GitHub authentication
```bash
# Check SSH key
ssh -T git@github.com

# Or use HTTPS with token
git remote set-url origin https://YOUR_TOKEN@github.com/DeanLuus22021994/docker-compose-examples.git
```

### Issue: "Submodule is empty after clone"
**Solution**: Initialize the submodule
```bash
git submodule update --init --recursive
```

### Issue: "Modified content in submodule"
**Solution**: Check what changed
```bash
cd docker-compose-examples
git status
git diff

# Commit changes or reset
git add . && git commit -m "Changes"
# OR
git reset --hard
```

### Issue: "Cannot push to submodule"
**Solution**: Make sure you're on a branch
```bash
cd docker-compose-examples
git checkout main
git pull origin main
# Now you can commit and push
```

## 📖 Additional Resources

- **Submodule Guide**: [docs/docker-compose-submodule.md](./docs/docker-compose-submodule.md)
- **Git Submodules Docs**: https://git-scm.com/book/en/v2/Git-Tools-Submodules
- **Docker Compose Docs**: https://docs.docker.com/compose/
- **Validation Script**: `docker-compose-examples/validate_stacks.py`

## 🤝 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Run the verification script: `./scripts/verify-submodule-setup.sh`
3. Review the documentation: [docs/docker-compose-submodule.md](./docs/docker-compose-submodule.md)
4. Open an issue in the appropriate repository:
   - React Scuba issues: https://github.com/DeanLuus22021994/react-scuba/issues
   - Docker examples issues: https://github.com/DeanLuus22021994/docker-compose-examples/issues

## 📝 Checklist

Use this checklist to track your progress through the extraction process:

### Preparation
- [ ] Git installed and configured
- [ ] Clean working directory
- [ ] Write access to repositories

### Extraction
- [ ] Create new GitHub repository (docker-compose-examples)
- [ ] Extract content to temporary location
- [ ] Initialize git in extracted content
- [ ] Commit and push to new repository

### Integration
- [ ] Remove docker-compose-examples from react-scuba
- [ ] Commit removal
- [ ] Add docker-compose-examples as submodule
- [ ] Commit submodule addition
- [ ] Push to react-scuba

### Verification
- [ ] Run verification script
- [ ] Test cloning with submodules
- [ ] Test updating submodule
- [ ] Verify references in .vscode/settings.json
- [ ] Test Python validation script

### Documentation
- [ ] Update team about the change
- [ ] Share submodule usage instructions
- [ ] Update CI/CD if applicable

---

**Last Updated**: 2025-10-23

**Script Version**: 1.0.0

**Status**: Ready for use
