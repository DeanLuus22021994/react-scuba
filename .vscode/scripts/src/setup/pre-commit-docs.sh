#!/bin/bash
# .vscode/scripts/pre-commit-docs.sh
# Pre-commit hook for documentation validation
# Ensures documentation integrity before commits

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCS_PATH="docs/.copilot"
SERVER_PATH="server"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}🔍 React Scuba Documentation Pre-commit Validation${NC}"
echo "=================================================="

# Change to root directory
cd "$ROOT_DIR"

# Check if documentation files are staged
DOCS_STAGED=$(git diff --cached --name-only | grep -E "^docs/\.copilot/" | wc -l)
TOC_STAGED=$(git diff --cached --name-only | grep -E "^docs/\.copilot/toc\.yml$" | wc -l)
SCRIPTS_STAGED=$(git diff --cached --name-only | grep -E "^server/scripts/validate-toc\.js$" | wc -l)

if [ "$DOCS_STAGED" -eq 0 ] && [ "$TOC_STAGED" -eq 0 ] && [ "$SCRIPTS_STAGED" -eq 0 ]; then
    echo -e "${YELLOW}⏭️  No documentation changes detected, skipping validation${NC}"
    exit 0
fi

echo -e "${BLUE}📄 Documentation changes detected: $DOCS_STAGED files${NC}"

# Ensure we're in the server directory for npm commands
cd "$SERVER_PATH"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install --legacy-peer-deps
fi

# Validation steps
VALIDATION_FAILED=0

echo
echo -e "${BLUE}🔎 Step 1: TOC Validation${NC}"
echo "-------------------------"
if npm run validate:toc; then
    echo -e "${GREEN}✅ TOC validation passed${NC}"
else
    echo -e "${RED}❌ TOC validation failed${NC}"
    VALIDATION_FAILED=1
fi

echo
echo -e "${BLUE}🧪 Step 2: Documentation Tests${NC}"
echo "------------------------------"
if npm run test:docs; then
    echo -e "${GREEN}✅ Documentation tests passed${NC}"
else
    echo -e "${RED}❌ Documentation tests failed${NC}"
    VALIDATION_FAILED=1
fi

echo
echo -e "${BLUE}📋 Step 3: Comprehensive Validation${NC}"
echo "----------------------------------"
if npm run validate:all; then
    echo -e "${GREEN}✅ Full validation suite passed${NC}"
else
    echo -e "${RED}❌ Full validation suite failed${NC}"
    VALIDATION_FAILED=1
fi

# Summary
echo
echo "=================================================="
if [ $VALIDATION_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All documentation validation checks passed!${NC}"
    echo -e "${GREEN}✨ Your documentation changes are ready for commit.${NC}"
    echo
    echo -e "${BLUE}📝 Committed files will include:${NC}"
    git diff --cached --name-only | grep -E "(docs/\.copilot/|server/scripts/validate-toc\.js)" | sed 's/^/   - /'
    echo
    exit 0
else
    echo -e "${RED}💥 Documentation validation failed!${NC}"
    echo
    echo -e "${YELLOW}🔧 To fix these issues:${NC}"
    echo "   1. Review the error messages above"
    echo "   2. Run 'npm run validate:docs' in the server directory"
    echo "   3. Fix any reported issues"
    echo "   4. Re-stage your files and commit again"
    echo
    echo -e "${BLUE}💡 Common issues:${NC}"
    echo "   - Missing files referenced in toc.yml"
    echo "   - Broken cross-references between documents"
    echo "   - Orphaned files not listed in TOC"
    echo "   - Invalid YAML structure in toc.yml"
    echo
    echo -e "${BLUE}🔗 Helpful commands:${NC}"
    echo "   - npm run validate:toc     # Check TOC structure"
    echo "   - npm run test:docs        # Run all documentation tests"
    echo "   - npm run validate:all     # Full validation suite"
    echo
    exit 1
fi