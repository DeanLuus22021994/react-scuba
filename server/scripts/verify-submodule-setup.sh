#!/bin/bash
# Don't exit on error - we want to run all tests
set +e

# Submodule Setup Verification Script
# This script verifies that the docker-compose-examples submodule is set up correctly

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
SUBMODULE_DIR="$REPO_DIR/docker-compose-examples"

echo "🔍 Docker Compose Examples Submodule Verification"
echo "=================================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success_count=0
failure_count=0

# Function to print test results
test_result() {
    local test_name="$1"
    local result="$2"
    
    if [ "$result" = "pass" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        ((success_count++))
    elif [ "$result" = "fail" ]; then
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        ((failure_count++))
    else
        echo -e "${YELLOW}⚠️  WARN${NC}: $test_name"
    fi
}

# Test 1: Check if .gitmodules exists
echo "Test 1: Checking .gitmodules file..."
if [ -f "$REPO_DIR/.gitmodules" ]; then
    test_result ".gitmodules file exists" "pass"
    
    # Check content
    if grep -q "docker-compose-examples" "$REPO_DIR/.gitmodules"; then
        test_result ".gitmodules references docker-compose-examples" "pass"
    else
        test_result ".gitmodules references docker-compose-examples" "fail"
    fi
else
    test_result ".gitmodules file exists" "fail"
    echo "   Note: This file is created when the submodule is added"
fi
echo ""

# Test 2: Check if submodule directory exists
echo "Test 2: Checking submodule directory..."
if [ -d "$SUBMODULE_DIR" ]; then
    test_result "docker-compose-examples directory exists" "pass"
    
    # Check if it's a submodule
    if [ -f "$SUBMODULE_DIR/.git" ] || [ -d "$SUBMODULE_DIR/.git" ]; then
        test_result "docker-compose-examples has .git" "pass"
    else
        test_result "docker-compose-examples has .git (is it initialized?)" "warn"
    fi
else
    test_result "docker-compose-examples directory exists" "warn"
    echo "   Note: Run 'git submodule update --init --recursive' to populate"
fi
echo ""

# Test 3: Check submodule status
echo "Test 3: Checking git submodule status..."
cd "$REPO_DIR"

if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    if git config --file .gitmodules --get-regexp path | grep -q docker-compose-examples; then
        test_result "Submodule configured in git" "pass"
        
        # Get submodule status
        submodule_status=$(git submodule status 2>&1 || echo "not configured")
        
        if echo "$submodule_status" | grep -q "docker-compose-examples"; then
            if echo "$submodule_status" | grep -q "^+"; then
                test_result "Submodule has uncommitted changes" "warn"
            elif echo "$submodule_status" | grep -q "^-"; then
                test_result "Submodule not initialized" "warn"
                echo "   Run: git submodule update --init --recursive"
            else
                test_result "Submodule status is clean" "pass"
            fi
        else
            test_result "Submodule tracked by git" "warn"
        fi
    else
        test_result "Submodule configured in git" "warn"
        echo "   Note: Will be configured after running extraction script"
    fi
else
    test_result "Repository is a git repository" "fail"
fi
echo ""

# Test 4: Check key files in submodule
echo "Test 4: Checking for key files in submodule..."
if [ -d "$SUBMODULE_DIR" ]; then
    key_files=(
        "README.md"
        "validate_stacks.py"
        "basic-stack/docker-compose.yml"
        "cluster-example/docker-compose.yml"
        "swarm-stack/docker-compose.yml"
        "mcp/python_utils/docker-compose.yml"
    )
    
    for file in "${key_files[@]}"; do
        if [ -e "$SUBMODULE_DIR/$file" ]; then
            test_result "File exists: $file" "pass"
        else
            test_result "File exists: $file" "warn"
        fi
    done
else
    test_result "Submodule directory populated" "warn"
    echo "   Run: git submodule update --init --recursive"
fi
echo ""

# Test 5: Check references in main repository
echo "Test 5: Checking references in main repository..."

reference_files=(
    ".vscode/settings.json"
    ".vscode/TASKS.md"
)

for file in "${reference_files[@]}"; do
    if [ -f "$REPO_DIR/$file" ]; then
        if grep -q "docker-compose-examples" "$REPO_DIR/$file"; then
            test_result "References in $file" "pass"
            
            # Count references
            ref_count=$(grep -c "docker-compose-examples" "$REPO_DIR/$file" || echo 0)
            echo "   Found $ref_count reference(s)"
        fi
    fi
done
echo ""

# Test 6: Verify Python validation script
echo "Test 6: Checking Python validation capability..."
if [ -d "$SUBMODULE_DIR" ] && [ -f "$SUBMODULE_DIR/validate_stacks.py" ]; then
    if command -v python3 > /dev/null 2>&1; then
        test_result "Python 3 is available" "pass"
        
        # Try to run help
        cd "$SUBMODULE_DIR"
        if python3 validate_stacks.py -h > /dev/null 2>&1; then
            test_result "validate_stacks.py is executable" "pass"
        else
            test_result "validate_stacks.py is executable" "warn"
        fi
        cd "$REPO_DIR"
    else
        test_result "Python 3 is available" "warn"
        echo "   Python 3 not found in PATH"
    fi
else
    test_result "validate_stacks.py exists" "warn"
fi
echo ""

# Test 7: Check Docker availability
echo "Test 7: Checking Docker availability (optional)..."
if command -v docker > /dev/null 2>&1; then
    test_result "Docker is installed" "pass"
    
    if docker info > /dev/null 2>&1; then
        test_result "Docker daemon is running" "pass"
    else
        test_result "Docker daemon is running" "warn"
        echo "   Docker is installed but daemon is not running"
    fi
    
    if command -v docker-compose > /dev/null 2>&1; then
        test_result "docker-compose is installed" "pass"
    else
        test_result "docker-compose is installed" "warn"
        echo "   docker-compose not found, but docker compose might work"
    fi
else
    test_result "Docker is installed" "warn"
    echo "   Docker not required for React development"
fi
echo ""

# Summary
echo "=========================================="
echo "📊 Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $success_count${NC}"
echo -e "${RED}Failed: $failure_count${NC}"
echo ""

if [ $failure_count -eq 0 ]; then
    echo -e "${GREEN}✅ All critical tests passed!${NC}"
    
    if [ -f "$REPO_DIR/.gitmodules" ]; then
        echo ""
        echo "🎉 Submodule setup is complete and verified!"
        echo ""
        echo "📚 Useful commands:"
        echo "   git submodule status              - Check submodule status"
        echo "   git submodule update --remote     - Update to latest version"
        echo "   cd docker-compose-examples        - Work in submodule"
        echo ""
    else
        echo ""
        echo "📝 Next steps:"
        echo "   1. Run: ./scripts/extract-docker-compose-examples.sh"
        echo "   2. Or manually create the submodule"
        echo "   3. Run this verification script again"
        echo ""
    fi
else
    echo -e "${RED}❌ Some tests failed. Review the output above.${NC}"
    exit 1
fi

echo "📖 Documentation: docs/docker-compose-submodule.md"
echo ""
