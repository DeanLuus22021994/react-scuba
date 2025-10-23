# Docker Compose Examples - Git Submodule Guide

## Overview

The `docker-compose-examples` directory has been extracted into its own dedicated repository to enable focused development and optional inclusion via Git submodules. This separation keeps both repositories clean and maintainable while allowing seamless integration when needed.

## Repository Structure

### Main Repository: react-scuba
- **URL**: https://github.com/DeanLuus22021994/react-scuba
- **Purpose**: React-based scuba diving website platform
- **Includes**: Frontend code, documentation, tests

### Submodule: docker-compose-examples
- **URL**: https://github.com/DeanLuus22021994/docker-compose-examples
- **Purpose**: Docker Compose stack examples and infrastructure
- **Includes**: Docker configurations, validation scripts, testing utilities

## Quick Start

### Initial Setup (First Time)

If you've just cloned `react-scuba` and need the Docker examples:

```bash
# Clone the repository
git clone https://github.com/DeanLuus22021994/react-scuba.git
cd react-scuba

# Initialize and fetch the submodule
git submodule update --init --recursive
```

### Working with the Submodule

#### View Submodule Status
```bash
git submodule status
```

#### Update Submodule to Latest Version
```bash
# Update to the latest commit from the docker-compose-examples repository
git submodule update --remote docker-compose-examples

# Commit the updated submodule reference
git add docker-compose-examples
git commit -m "Update docker-compose-examples submodule"
```

#### Make Changes in the Submodule
```bash
# Navigate to the submodule
cd docker-compose-examples

# Make sure you're on a branch (submodules are in detached HEAD by default)
git checkout main

# Make your changes
# ... edit files ...

# Commit and push changes
git add .
git commit -m "Your change description"
git push origin main

# Go back to main repository
cd ..

# Update the submodule reference
git add docker-compose-examples
git commit -m "Update docker-compose-examples reference"
git push
```

#### Remove Submodule (Temporary)
```bash
# Remove the submodule directory (keeps .gitmodules)
rm -rf docker-compose-examples

# Can be restored later with:
git submodule update --init --recursive
```

## Extraction Process

The extraction was performed using the automated script provided in this repository.

### Automated Extraction Script

A helper script is available to automate the extraction process:

```bash
# Run the extraction script
./scripts/extract-docker-compose-examples.sh
```

The script will:
1. ✅ Verify the docker-compose-examples directory exists
2. 🔍 Check if the target repository exists on GitHub
3. 📦 Copy content to a temporary location
4. 🔧 Initialize a new git repository
5. 📤 Optionally push to GitHub
6. 🗑️ Remove from react-scuba
7. 📥 Add as a submodule

### Manual Extraction Steps

If you prefer to do it manually, follow these steps:

#### 1. Create the New Repository
```bash
# Go to https://github.com/new
# Repository name: docker-compose-examples
# Owner: DeanLuus22021994
# Leave empty (no README, no .gitignore)
```

#### 2. Extract and Push Content
```bash
# From the react-scuba repository
cd /tmp
cp -r /path/to/react-scuba/docker-compose-examples .
cd docker-compose-examples

# Initialize and push
git init
git remote add origin https://github.com/DeanLuus22021994/docker-compose-examples.git
git add .
git commit -m "Extract docker-compose-examples for focused development"
git push -u origin main
```

#### 3. Remove from react-scuba and Add as Submodule
```bash
# Back in react-scuba repository
cd /path/to/react-scuba

# Remove the directory
git rm -r docker-compose-examples
git commit -m "Remove docker-compose-examples to dedicated repo"

# Add as submodule
git submodule add https://github.com/DeanLuus22021994/docker-compose-examples.git docker-compose-examples
git add .gitmodules docker-compose-examples
git commit -m "Add docker-compose-examples as submodule for optional inclusion"

# Push changes
git push origin main
```

## Usage Patterns

### For React Development Only
If you're only working on the React frontend and don't need Docker examples:

```bash
# Clone without initializing submodules
git clone https://github.com/DeanLuus22021994/react-scuba.git
cd react-scuba

# Skip: git submodule update --init --recursive
# The docker-compose-examples directory will be empty
```

### For Full Stack Development
If you need both React and Docker examples:

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/DeanLuus22021994/react-scuba.git
cd react-scuba

# Or if already cloned:
git submodule update --init --recursive
```

### For Docker Examples Only
If you only need the Docker examples:

```bash
# Clone the submodule directly
git clone https://github.com/DeanLuus22021994/docker-compose-examples.git
cd docker-compose-examples

# Validate the stacks
python validate_stacks.py
```

## Testing and Validation

### Validate Docker Stacks

From the submodule directory:

```bash
cd docker-compose-examples

# Validate configuration only
python validate_stacks.py

# Build and validate
python validate_stacks.py --build

# Full validation with health checks
python validate_stacks.py --build --test

# Cleanup after testing
python validate_stacks.py --cleanup
```

### Available Stacks

1. **basic-stack**: Node.js, Python FastAPI, PostgreSQL
2. **cluster-example**: Load-balanced nginx cluster
3. **swarm-stack**: Docker Swarm orchestration
4. **mcp/python_utils**: Testing and validation utilities

## Common Issues and Solutions

### Issue: Submodule is empty after clone
**Solution**: Initialize the submodule
```bash
git submodule update --init --recursive
```

### Issue: Changes in submodule not showing in main repo
**Solution**: Commit the submodule reference
```bash
cd docker-compose-examples
git log -1  # Note the commit hash
cd ..
git add docker-compose-examples
git commit -m "Update docker-compose-examples to [hash]"
```

### Issue: Submodule shows "modified content"
**Solution**: Either commit changes or reset
```bash
cd docker-compose-examples
git status  # Check what changed
git add . && git commit -m "Your changes"  # Or
git reset --hard  # Discard changes
```

### Issue: Cannot push to submodule
**Solution**: Make sure you're on a branch
```bash
cd docker-compose-examples
git checkout main
git pull origin main
# Now you can commit and push
```

## Benefits of This Approach

1. **🎯 Focused Development**: Each repository has a clear purpose
2. **📦 Optional Inclusion**: Clone only what you need
3. **🔄 Independent Versioning**: Version control for Docker configs
4. **🧹 Cleaner Main Repo**: React code separated from infrastructure
5. **🔗 Easy Integration**: Submodule makes inclusion seamless
6. **📚 Better Organization**: Clear boundaries between concerns
7. **🚀 Faster Clones**: Optional Docker examples don't slow down main repo clones

## References

- [Git Submodules Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Docker Compose Examples Repository](https://github.com/DeanLuus22021994/docker-compose-examples)
- [React Scuba Repository](https://github.com/DeanLuus22021994/react-scuba)

## Support

For issues related to:
- **React Scuba**: Open an issue in the [react-scuba repository](https://github.com/DeanLuus22021994/react-scuba/issues)
- **Docker Examples**: Open an issue in the [docker-compose-examples repository](https://github.com/DeanLuus22021994/docker-compose-examples/issues)
