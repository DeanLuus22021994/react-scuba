#!/bin/bash
set -e

# Docker Compose Examples Extraction Script
# This script helps extract the docker-compose-examples directory into a separate repository
# and set it up as a git submodule in the react-scuba repository.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
EXAMPLES_DIR="$REPO_DIR/docker-compose-examples"
NEW_REPO_URL="https://github.com/DeanLuus22021994/docker-compose-examples.git"
TEMP_EXTRACT_DIR="/tmp/docker-compose-examples-extract"

echo "🚀 Docker Compose Examples Extraction Script"
echo "=============================================="
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command_exists git; then
    echo "❌ git is not installed"
    exit 1
fi
echo "✅ git is installed"

if ! command_exists docker-compose; then
    echo "⚠️  docker-compose is not installed (optional for validation)"
fi

# Phase 1: Verify the docker-compose-examples directory exists
echo ""
echo "Phase 1: Verification"
echo "---------------------"
if [ ! -d "$EXAMPLES_DIR" ]; then
    echo "❌ docker-compose-examples directory not found at: $EXAMPLES_DIR"
    exit 1
fi
echo "✅ docker-compose-examples directory found"

# Count files
FILE_COUNT=$(find "$EXAMPLES_DIR" -type f | wc -l)
echo "📊 Found $FILE_COUNT files in docker-compose-examples"

# Phase 2: Check if the new repository exists
echo ""
echo "Phase 2: Repository Status Check"
echo "--------------------------------"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$NEW_REPO_URL" || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Target repository exists: $NEW_REPO_URL"
    REPO_EXISTS=true
elif [ "$HTTP_STATUS" = "404" ]; then
    echo "⚠️  Target repository does not exist yet: $NEW_REPO_URL"
    echo ""
    echo "📝 Manual Action Required:"
    echo "   1. Go to https://github.com/new"
    echo "   2. Create a new repository named 'docker-compose-examples'"
    echo "   3. Under DeanLuus22021994"
    echo "   4. Leave it empty (no README, no .gitignore)"
    echo "   5. Make it public or private as needed"
    echo ""
    echo "Once created, re-run this script."
    REPO_EXISTS=false
else
    echo "⚠️  Could not check repository status (HTTP $HTTP_STATUS)"
    REPO_EXISTS=false
fi

# Phase 3: Extract content (if repository exists)
if [ "$REPO_EXISTS" = true ]; then
    echo ""
    echo "Phase 3: Content Extraction"
    echo "---------------------------"
    
    # Clean up any previous extraction
    if [ -d "$TEMP_EXTRACT_DIR" ]; then
        echo "🧹 Cleaning up previous extraction..."
        rm -rf "$TEMP_EXTRACT_DIR"
    fi
    
    # Create temporary directory and copy content
    echo "📦 Copying docker-compose-examples to temporary location..."
    mkdir -p "$TEMP_EXTRACT_DIR"
    cp -r "$EXAMPLES_DIR"/* "$TEMP_EXTRACT_DIR/"
    cp -r "$EXAMPLES_DIR"/.[!.]* "$TEMP_EXTRACT_DIR/" 2>/dev/null || true
    
    echo "✅ Content copied to: $TEMP_EXTRACT_DIR"
    
    # Initialize git repository in extracted content
    echo ""
    echo "🔧 Initializing git repository in extracted content..."
    cd "$TEMP_EXTRACT_DIR"
    
    if [ ! -d ".git" ]; then
        git init
        echo "✅ Git repository initialized"
    fi
    
    # Add remote
    if ! git remote get-url origin >/dev/null 2>&1; then
        git remote add origin "$NEW_REPO_URL"
        echo "✅ Added remote: origin → $NEW_REPO_URL"
    fi
    
    # Stage all files
    git add .
    echo "✅ Staged all files"
    
    # Commit
    if git diff --cached --quiet; then
        echo "ℹ️  No changes to commit (already committed)"
    else
        git commit -m "Extract docker-compose-examples for focused development

This extraction creates a dedicated repository for Docker Compose examples,
enabling focused development and optional inclusion via git submodules.

Content includes:
- Basic stack (Node.js, Python FastAPI, PostgreSQL)
- Cluster example (Load-balanced nginx)
- Swarm stack (Docker Swarm orchestration)
- MCP Python utilities (Testing and validation)
- Validation script (validate_stacks.py)

Extracted from: react-scuba repository
Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
        echo "✅ Committed changes"
    fi
    
    echo ""
    echo "📤 Ready to push to GitHub"
    echo "   Location: $TEMP_EXTRACT_DIR"
    echo "   Remote: $NEW_REPO_URL"
    echo ""
    read -p "Push to GitHub now? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -u origin main || git push -u origin master
        echo "✅ Pushed to GitHub"
    else
        echo "⏸️  Skipped push. You can push manually later from:"
        echo "   cd $TEMP_EXTRACT_DIR"
        echo "   git push -u origin main"
    fi
    
    # Phase 4: Remove from react-scuba and add as submodule
    echo ""
    echo "Phase 4: Submodule Setup"
    echo "-----------------------"
    cd "$REPO_DIR"
    
    echo ""
    read -p "Remove docker-compose-examples from react-scuba and add as submodule? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Remove the directory
        echo "🗑️  Removing docker-compose-examples directory..."
        git rm -r docker-compose-examples
        git commit -m "Remove docker-compose-examples to dedicated repo"
        echo "✅ Removed and committed"
        
        # Add as submodule
        echo "📥 Adding as submodule..."
        git submodule add "$NEW_REPO_URL" docker-compose-examples
        git commit -m "Add docker-compose-examples as submodule for optional inclusion"
        echo "✅ Added as submodule"
        
        echo ""
        echo "📤 Ready to push react-scuba changes"
        read -p "Push to GitHub? (y/N) " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push origin "$(git branch --show-current)"
            echo "✅ Pushed to GitHub"
        fi
    fi
fi

echo ""
echo "✨ Extraction process complete!"
echo ""
echo "📚 Next Steps:"
echo "   1. To include submodule: git submodule update --init --recursive"
echo "   2. To update submodule: git submodule update --remote"
echo "   3. To work on submodule: cd docker-compose-examples && git checkout main"
echo ""
echo "📝 Documentation updated in: docs/docker-compose-submodule.md"
echo ""
