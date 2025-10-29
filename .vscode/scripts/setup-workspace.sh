#!/usr/bin/env bash

# React Scuba VS Code Workspace Setup Script
# This script configures the organized .vscode directory structure

set -e  # Exit on any error

echo "🚀 React Scuba VS Code Workspace Setup"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "ROOT_DIR.TAG" ]; then
    echo "❌ Error: Please run this script from the React Scuba root directory"
    exit 1
fi

# Create directory structure if not exists
echo "📁 Creating organized .vscode directory structure..."

mkdir -p .vscode/configs
mkdir -p .vscode/schemas
mkdir -p .vscode/mcp-servers
mkdir -p .vscode/scripts
mkdir -p .vscode/copilot

echo "✅ Directory structure created"

# Validate configuration files exist
echo "🔍 Validating configuration files..."

required_files=(
    ".vscode/configs/"
    ".vscode/configs/settings.client.json"
    ".vscode/configs/README.md"
    ".vscode/copilot/instructions.md"
    ".vscode/copilot/agent-best-practices.md"
    ".vscode/copilot/azure-best-practices.md"
    ".vscode/scripts/merge-configs.js"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo "Please ensure all configuration files are created before running setup."
    exit 1
fi

echo "✅ All configuration files present"

# Install dependencies for scripts
echo "📦 Installing script dependencies..."
cd .vscode/scripts

if [ ! -f "package.json" ]; then
    echo '{"type": "module", "devDependencies": {"@types/node": "^24.9.1"}}' > package.json
fi

if [ ! -d "node_modules" ]; then
    npm install
fi

cd ../..
echo "✅ Script dependencies installed"

# Run configuration merge
echo "⚙️ Merging configurations..."
node .vscode/scripts/merge-configs.js

# Validate merged settings
echo "🔍 Validating merged settings..."
if ! node -e "JSON.parse(require('fs').readFileSync('.vscode/settings.json', 'utf8'))" 2>/dev/null; then
    echo "❌ Error: Merged settings.json is invalid JSON"
    exit 1
fi

echo "✅ Configuration merge successful"

# Update .copilotignore if needed
echo "📝 Updating .copilotignore..."
if [ ! -f ".copilotignore" ]; then
    echo "Creating .copilotignore..."
    cat > .copilotignore << 'EOF'
# VS Code organized configs (exclude redundant files)
.vscode/configs/
.vscode/scripts/node_modules/
.vscode/scripts/package-lock.json

# Keep important VS Code files for Copilot context
!.vscode/settings.json
!.vscode/extensions.json
!.vscode/launch.json
!.vscode/tasks.json
!.vscode/mcp.json
!.vscode/copilot/
!.vscode/schemas/
EOF
fi

# Create VS Code workspace file for better monorepo support
echo "📄 Creating VS Code workspace configuration..."
cat > react-scuba.code-workspace << 'EOF'
{
  "folders": [
    {
      "name": "🏠 React Scuba (Root)",
      "path": "."
    },
    {
      "name": "🌐 Frontend (React + Vite)",
      "path": "./server/apps/web"
    },
    {
      "name": "🔧 Backend API (Express)",
      "path": "./server/apps/api"
    },
    {
      "name": "📝 Content Provider",
      "path": "./server/apps/content"
    },
    {
      "name": "📚 Documentation",
      "path": "./server/apps/docs"
    },
    {
      "name": "🔧 Shared Packages",
      "path": "./server/packages"
    },
    {
      "name": "🏢 Client Configurations",
      "path": "./server/clients"
    },
    {
      "name": "🐍 Python MCP Utils",
      "path": "./docker-compose-examples/mcp/python_utils"
    }
  ],
  "settings": {
    "files.exclude": {
      "**/node_modules": false,
      "**/.npm": true,
      "**/dist": false,
      "**/build": false
    },
    "search.exclude": {
      "**/node_modules": true,
      "**/.npm": true
    }
  },
  "extensions": {
    "recommendations": [
      "ms-vscode.vscode-typescript-next",
      "bradlc.vscode-tailwindcss",
      "github.copilot",
      "github.copilot-chat",
      "ms-azuretools.vscode-azureresourcegroups",
      "ms-python.python",
      "ms-toolsai.vscode-ai-toolkit"
    ]
  }
}
EOF

echo "✅ VS Code workspace file created"

# Final validation
echo "🔍 Final validation..."

# Check if Copilot can read the instruction files
if command -v code &> /dev/null; then
    echo "VS Code CLI detected - you can open the workspace with:"
    echo "  code react-scuba.code-workspace"
fi

echo ""
echo "🎉 VS Code Workspace Setup Complete!"
echo "=================================="
echo ""
echo "✅ Organized directory structure created"
echo "✅ Configuration files validated"
echo "✅ Settings merged successfully"
echo "✅ Copilot instructions configured"
echo "✅ Workspace file created"
echo ""
echo "📖 Next Steps:"
echo "1. Reload VS Code window (Ctrl/Cmd + Shift + P → 'Developer: Reload Window')"
echo "2. Open react-scuba.code-workspace for better monorepo support"
echo "3. Test GitHub Copilot with: @workspace explain the project structure"
echo "4. Use npm run workspace:setup to re-merge configurations when needed"
echo ""
echo "📁 Configuration files are organized in:"
echo "   - .vscode/configs/     (domain-specific settings)"
echo "   - .vscode/copilot/     (AI assistant instructions)"
echo "   - .vscode/schemas/     (JSON schema definitions)"
echo "   - .vscode/mcp-servers/ (Model Context Protocol servers)"
echo "   - .vscode/scripts/     (automation scripts)"
echo ""
echo "Happy coding with React Scuba! 🤿"

