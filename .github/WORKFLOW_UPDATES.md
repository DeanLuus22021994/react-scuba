# GitHub Actions Workflow Updates for Submodules

This document describes the necessary updates to GitHub Actions workflows after the docker-compose-examples extraction.

## Workflows That Need Updates

### 1. test-stacks.yml (Currently Disabled)

**File**: `.github/workflows/test-stacks.yml.disabled`

**Required Changes**: When re-enabling this workflow, add submodule initialization to all checkout steps.

**Before**:
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

**After**:
```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    submodules: recursive
```

**Why**: The workflow tests Docker stacks in the `docker-compose-examples` directory, which will be a submodule after extraction.

### 2. docs.yml (Currently Disabled)

**File**: `.github/workflows/docs.yml.disabled`

**Status**: Review needed - check if documentation build requires docker-compose-examples content.

If the documentation references or includes content from docker-compose-examples:

```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    submodules: recursive
```

## General Pattern for All Workflows

For any workflow that needs access to docker-compose-examples:

```yaml
steps:
  - name: Checkout code with submodules
    uses: actions/checkout@v4
    with:
      submodules: recursive  # Initialize all submodules
      # or
      submodules: true       # Initialize only direct submodules
```

## Alternative: Selective Initialization

If you only need docker-compose-examples in specific workflows:

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4
  
  - name: Initialize docker-compose-examples submodule
    run: git submodule update --init docker-compose-examples
```

This approach:
- ✅ Doesn't clone submodules in workflows that don't need them
- ✅ Faster for React-only CI jobs
- ✅ More explicit about dependencies

## Workflows That DON'T Need Updates

Workflows that only test React code (without Docker):
- Linting workflows
- React unit tests
- Frontend build processes
- Documentation builds (if they don't reference Docker examples)

These can use the standard checkout without submodules:
```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

## Testing Workflow Changes

After updating workflows:

1. **Test with Act (Local GitHub Actions)**:
   ```bash
   # Install act: https://github.com/nektos/act
   act -j test-basic-stack
   ```

2. **Test on a Branch**:
   - Create a test branch
   - Push changes
   - Monitor workflow runs
   - Verify submodule content is available

3. **Verify Submodule Content**:
   Add a verification step in workflows:
   ```yaml
   - name: Verify submodule content
     run: |
       ls -la docker-compose-examples/
       test -f docker-compose-examples/validate_stacks.py && echo "✅ Submodule populated" || exit 1
   ```

## Example: Updated test-stacks.yml

Here's what the updated workflow would look like:

```yaml
name: Test Docker Stacks

on:
  pull_request:
    branches: [main]
    paths:
      - "docker-compose-examples/**"
      - ".github/workflows/test-stacks.yml"
  push:
    branches: [main]
    paths:
      - "docker-compose-examples/**"
  workflow_dispatch:

jobs:
  test-basic-stack:
    name: Test Basic Stack
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code with submodules
        uses: actions/checkout@v4
        with:
          submodules: recursive
      
      - name: Verify submodule
        run: |
          test -f docker-compose-examples/validate_stacks.py || exit 1
          echo "✅ Submodule populated"

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v4

      - name: Test Basic Stack
        run: |
          cd docker-compose-examples/basic-stack
          docker-compose up -d --build
          timeout 300 bash -c 'until curl -f http://localhost:3000/health; do sleep 5; done'
          timeout 300 bash -c 'until curl -f http://localhost:8001/health; do sleep 5; done'
          docker-compose logs
          docker-compose down
```

## Path Filters

Note that path filters in workflows will still work with submodules:

```yaml
on:
  push:
    paths:
      - "docker-compose-examples/**"  # This still triggers when submodule content changes
```

However, the workflow will only trigger if the submodule *reference* in the main repo changes, not for every commit in the submodule repository.

## CI/CD Best Practices with Submodules

1. **Cache Submodules**: Speed up workflows by caching submodule content
   ```yaml
   - name: Cache submodules
     uses: actions/cache@v3
     with:
       path: docker-compose-examples
       key: submodules-${{ hashFiles('.gitmodules') }}
   ```

2. **Verify Submodule Version**: Ensure you're testing the right version
   ```yaml
   - name: Show submodule version
     run: git submodule status
   ```

3. **Update Submodules in Dependabot**: Add to `.github/dependabot.yml`
   ```yaml
   version: 2
   updates:
     - package-ecosystem: "gitsubmodule"
       directory: "/"
       schedule:
         interval: "weekly"
   ```

## Checklist for Re-Enabling Workflows

When you're ready to re-enable disabled workflows:

- [ ] Review workflow to determine if docker-compose-examples is needed
- [ ] Add `submodules: recursive` to checkout steps if needed
- [ ] Add verification step to confirm submodule content
- [ ] Test workflow on a branch first
- [ ] Rename `.disabled` back to `.yml`
- [ ] Update this document with actual changes made
- [ ] Monitor first few runs to ensure everything works

## Questions?

If you're unsure whether a workflow needs submodule access:

1. Check if it references `docker-compose-examples/**` paths
2. Check if it runs Docker commands
3. Check if it needs Python validation scripts
4. When in doubt, add submodule initialization - it won't hurt

## References

- [GitHub Actions - Checkout Action](https://github.com/actions/checkout)
- [Git Submodules in CI/CD](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Submodule Quick Reference](../docs/submodule-quick-reference.md)

---

**Last Updated**: 2025-10-23
**Status**: Documentation only - workflows currently disabled
