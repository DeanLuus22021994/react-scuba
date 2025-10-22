# Python Environment Setup Script for React Scuba
# This script sets up UV and creates a Python virtual environment

Write-Host "🐍 Setting up Python environment with UV..." -ForegroundColor Green

# Check if UV is installed
if (!(Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "❌ UV is not installed. Installing UV..." -ForegroundColor Yellow
    try {
        # Download and install UV
        $installScript = Invoke-WebRequest -Uri "https://astral.sh/uv/install.sh" -UseBasicParsing
        $installScript.Content | bash
        $env:PATH = "$env:USERPROFILE\.local\bin;$env:PATH"
    }
    catch {
        Write-Host "❌ Failed to install UV. Please install it manually from https://github.com/astral-sh/uv" -ForegroundColor Red
        exit 1
    }
}

# Verify UV installation
try {
    uv --version
}
catch {
    Write-Host "❌ UV installation failed. Please check your PATH." -ForegroundColor Red
    exit 1
}

# Create virtual environment with UV
Write-Host "📦 Creating virtual environment..." -ForegroundColor Blue
try {
    uv venv .venv --python 3.13
}
catch {
    Write-Host "❌ Failed to create virtual environment. Make sure Python 3.13 is installed." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "🔧 Installing dependencies..." -ForegroundColor Blue
try {
    & ".venv\Scripts\Activate.ps1"
    uv pip install -e .
}
catch {
    Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Python environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To activate the environment manually:" -ForegroundColor Cyan
Write-Host "  .venv\Scripts\Activate.ps1"
Write-Host ""
Write-Host "To run Python tools:" -ForegroundColor Cyan
Write-Host "  uv run black ."
Write-Host "  uv run isort ."
Write-Host "  uv run pylint src/"
Write-Host "  uv run pytest"
