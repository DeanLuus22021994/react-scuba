#!/bin/bash
# Python Environment Setup Script for React Scuba
# This script sets up UV and creates a Python virtual environment

set -e

echo "🐍 Setting up Python environment with UV..."

# Check if UV is installed
if ! command -v uv &> /dev/null; then
    echo "❌ UV is not installed. Installing UV..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

# Verify UV installation
uv --version

# Create virtual environment with UV
echo "📦 Creating virtual environment..."
uv venv .venv --python 3.13

# Activate the environment and install dependencies
echo "🔧 Installing dependencies..."
source .venv/bin/activate
uv pip install -e .

echo "✅ Python environment setup complete!"
echo ""
echo "To activate the environment manually:"
echo "  source .venv/bin/activate"
echo ""
echo "To run Python tools:"
echo "  uv run black ."
echo "  uv run isort ."
echo "  uv run pylint src/"
echo "  uv run pytest"
