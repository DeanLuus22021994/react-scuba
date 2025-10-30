# Scripts Directory

This directory contains utility scripts for repository maintenance and development workflows.

## Available Scripts

### extract-docker-compose-examples.sh

**Purpose**: Automates the extraction of the `docker-compose-examples` directory into a separate repository and sets it up as a git submodule.

**Usage**:

```bash
./scripts/extract-docker-compose-examples.sh
```

**Prerequisites**:

- Git installed
- GitHub repository created (https://github.com/DeanLuus22021994/docker-compose-examples)
- Write access to both repositories

**What it does**:

1. Verifies the docker-compose-examples directory exists
2. Checks if the target GitHub repository exists
3. Extracts content to a temporary location
4. Initializes a new git repository
5. Commits and pushes to the new repository
6. Removes docker-compose-examples from react-scuba
7. Adds it back as a git submodule

**Interactive prompts**:

- Confirm push to new repository
- Confirm removal and submodule addition
- Confirm push to react-scuba

**Documentation**: See [docs/docker-compose-submodule.md](../docs/docker-compose-submodule.md)

### verify-submodule-setup.sh

**Purpose**: Verifies that the docker-compose-examples submodule is correctly configured and working.

**Usage**:

```bash
./scripts/verify-submodule-setup.sh
```

**Prerequisites**:

- Git installed
- Repository is a git repository

**What it checks**:

1. .gitmodules file exists and is configured
2. Submodule directory exists
3. Git submodule status is correct
4. Key files present in submodule
5. References in main repository (.vscode/settings.json, etc.)
6. Python validation script is available
7. Docker availability (optional)

**Output**:

- ✅ Pass: Test succeeded
- ❌ Fail: Critical issue found
- ⚠️ Warn: Non-critical issue or optional feature

**Documentation**: See [docs/docker-compose-submodule.md](../docs/docker-compose-submodule.md)

## Adding New Scripts

When adding new scripts to this directory:

1. **Name**: Use kebab-case (e.g., `my-script.sh`)
2. **Shebang**: Start with `#!/bin/bash` or appropriate interpreter
3. **Documentation**: Add description to this README
4. **Executable**: Make executable with `chmod +x scripts/your-script.sh`
5. **Error handling**: Use `set -e` for bash scripts
6. **Help text**: Include usage information with `-h` or `--help` flag

## Best Practices

- Keep scripts focused on a single task
- Include error handling and validation
- Provide clear output and progress indicators
- Use emoji for visual feedback (✅ ❌ ⚠️ 📦 🚀)
- Document prerequisites and dependencies
- Test scripts in a clean environment before committing
