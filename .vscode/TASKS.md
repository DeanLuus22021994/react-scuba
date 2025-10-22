# VS Code Tasks Documentation

This workspace includes comprehensive pre-configured VS Code tasks to streamline your development workflow for both React/JavaScript and Python components.

## 📋 Available Tasks

### JavaScript/React Quality & Linting

- **Run All Linters** - Run ESLint and Prettier checks on the entire codebase
- **Lint & Fix** - Run ESLint and Prettier with automatic fixes
- **ESLint Check** - Run ESLint on src directory only
- **Prettier Check** - Check code formatting with Prettier
- **Prettier Fix** - Format code with Prettier

### JavaScript/React Build & Test

- **Build Project** ⌨️ `Ctrl+Shift+B` - Build production bundle with Vite (default build task)
- **Run Tests** - Run all tests with Vitest (default test task)
- **Test Coverage** - Run tests with coverage report
- **Dev Server** - Start Vite development server on port 3000

### Python Environment & Setup

- **Python Setup** - Set up Python environment with UV and freethreaded Python 3.14

### Python Quality & Linting

- **Ruff Lint** - Run Ruff linter on Python code with freethreaded Python 3.14
- **Ruff Fix** - Run Ruff linter with auto-fix on Python code
- **isort Check** - Check Python import sorting with isort
- **isort Fix** - Fix Python import sorting with isort

### Python Testing

- **Python Test** - Run Python tests with pytest
- **Python Coverage** - Run Python tests with coverage report

### Docker Operations

- **Docker Build Basic** - Build Docker containers for basic stack
- **Docker Up Basic** - Start Docker containers for basic stack
- **Docker Down Basic** - Stop Docker containers for basic stack
- **Docker Build Cluster** - Build Docker containers for cluster example
- **Docker Up Cluster** - Start Docker containers for cluster example
- **Docker Down Cluster** - Stop Docker containers for cluster example
- **Docker Build Swarm** - Build Docker containers for swarm stack
- **Docker Up Swarm** - Start Docker containers for swarm stack
- **Docker Down Swarm** - Stop Docker containers for swarm stack

### MCP Server

- **MCP Server Start** - Start MCP server with freethreaded Python 3.14

### Quality Assurance

- **Full Quality Check** - Run linters, tests, and build in sequence (JavaScript/React only)
- **Python Quality Check** - Run Python linters and tests in sequence

## 🚀 How to Use

### Method 1: Command Palette

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Tasks: Run Task"
3. Select the task you want to run

### Method 2: Keyboard Shortcuts

- **Build**: `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)
- **Test**: `Ctrl+Shift+T` (configured if using Test Explorer)

### Method 3: Terminal Menu

1. Go to **Terminal** → **Run Task...**
2. Select the desired task

## 💡 Task Details

### JavaScript/React Tasks

#### Run All Linters

Executes both ESLint and Prettier checks to ensure code quality and formatting standards.

**Equivalent CLI:**
```bash
npm run lint && npm run format:check
```

#### Lint & Fix

Automatically fixes ESLint and Prettier issues where possible.

**Equivalent CLI:**
```bash
npm run lint:fix && npm run format
```

#### Full Quality Check

Comprehensive check that runs:

1. All linters (ESLint + Prettier)
2. All tests (Vitest)
3. Production build (Vite)

This is perfect for running before pushing code or creating a PR.

**Equivalent CLI:**
```bash
npm run check && npm test -- --run && npm run build
```

### Python Tasks

#### Python Setup

Sets up the Python virtual environment using UV with freethreaded Python 3.14.

**Requirements:**
- UV package manager installed
- Freethreaded Python 3.14 available

**Equivalent CLI:**
```bash
powershell -ExecutionPolicy Bypass -File setup-python.ps1
```

#### Ruff Linting

Ruff is a fast Python linter written in Rust. These tasks use freethreaded Python 3.14 to ensure compatibility.

**Ruff Lint** - Check for linting issues
**Ruff Fix** - Automatically fix linting issues where possible

**Equivalent CLI:**
```bash
uv run --python 3.13 ruff check docker-compose-examples/mcp/python_utils/
uv run --python 3.13 ruff check --fix docker-compose-examples/mcp/python_utils/
```

#### Import Sorting (isort)

Checks and fixes Python import ordering.

**isort Check** - Verify import sorting
**isort Fix** - Automatically sort imports

**Equivalent CLI:**
```bash
uv run --python 3.13 isort --check-only --diff --settings-path docker-compose-examples/mcp/python_utils/pyproject.toml docker-compose-examples/mcp/python_utils/
uv run --python 3.13 isort --settings-path docker-compose-examples/mcp/python_utils/pyproject.toml docker-compose-examples/mcp/python_utils/
```

#### Python Test Tasks

Runs pytest on the Python test suite with coverage reporting.

**Python Test** - Run tests with verbose output
**Python Coverage** - Run tests with HTML coverage report

**Equivalent CLI:**
```bash
uv run --python 3.13 pytest docker-compose-examples/mcp/python_utils/tests/ -v --tb=short
uv run --python 3.13 pytest docker-compose-examples/mcp/python_utils/tests/ --cov=react_scuba_utils --cov-report=html --cov-report=term-missing
```

#### Python Quality Check

Runs all Python quality checks in sequence:

1. Ruff linting
2. isort import checking
3. Python tests

**Equivalent CLI:**
```bash
# Run all checks manually
uv run --python 3.13 ruff check docker-compose-examples/mcp/python_utils/
uv run --python 3.13 isort --check-only --diff --settings-path docker-compose-examples/mcp/python_utils/pyproject.toml docker-compose-examples/mcp/python_utils/
uv run --python 3.13 pytest docker-compose-examples/mcp/python_utils/tests/ -v --tb=short
```

### Docker Tasks

Each Docker stack has three tasks:

- **Build** - Build the Docker containers
- **Up** - Start the containers (background task)
- **Down** - Stop and remove the containers

Available stacks:
- **Basic** - Simple single-container setup
- **Cluster** - Multi-container cluster example
- **Swarm** - Docker Swarm orchestration example

**Example CLI:**
```bash
# Basic stack
docker-compose -f docker-compose-examples/basic-stack/docker-compose.yml build
docker-compose -f docker-compose-examples/basic-stack/docker-compose.yml up -d
docker-compose -f docker-compose-examples/basic-stack/docker-compose.yml down
```

### MCP Server Tasks

Starts the Model Context Protocol server using freethreaded Python 3.14.

**MCP Server Start** - Launch the MCP server (background task)

**Equivalent CLI:**
```bash
uv run --python 3.13 python -m react_scuba_utils.cli serve
```

## 🎨 Task Icons

Each task has a color-coded icon for easy identification:

- 🔵 Blue - Linting (ESLint, Ruff)
- 💜 Magenta - Formatting (Prettier, isort)
- 🟡 Yellow - Testing
- 🟢 Green - Build/Fix
- 🔴 Red - Stop/Down operations
- 🔵 Cyan - Servers/Dev environments
- 🟣 Purple - Setup/Configuration

## ⚙️ Customization

To add or modify tasks:

1. Open `.vscode/tasks.json`
2. Add/edit task configuration
3. Refer to [VS Code Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)

## 📝 NPM Scripts Reference

| Task | NPM Script |
|------|------------|
| ESLint Check | `npm run lint` |
| ESLint Fix | `npm run lint:fix` |
| Prettier Check | `npm run format:check` |
| Prettier Fix | `npm run format` |
| Build | `npm run build` |
| Test | `npm test -- --run` |
| Test Coverage | `npm run test:coverage` |
| Dev Server | `npm start` |

## 🐍 Python Environment Reference

| Task | UV Command |
|------|------------|
| Ruff Lint | `uv run --python 3.13 ruff check docker-compose-examples/mcp/python_utils/` |
| Ruff Fix | `uv run --python 3.13 ruff check --fix docker-compose-examples/mcp/python_utils/` |
| isort Check | `uv run --python 3.13 isort --check-only --diff --settings-path docker-compose-examples/mcp/python_utils/pyproject.toml docker-compose-examples/mcp/python_utils/` |
| isort Fix | `uv run --python 3.13 isort --settings-path docker-compose-examples/mcp/python_utils/pyproject.toml docker-compose-examples/mcp/python_utils/` |
| Python Test | `uv run --python 3.13 pytest docker-compose-examples/mcp/python_utils/tests/ -v --tb=short` |
| Python Coverage | `uv run --python 3.13 pytest docker-compose-examples/mcp/python_utils/tests/ --cov=react_scuba_utils --cov-report=html --cov-report=term-missing` |
| MCP Server | `uv run --python 3.13 python -m react_scuba_utils.cli serve` |

## 🐳 Docker Compose Reference

| Stack | Build | Up | Down |
|-------|-------|----|------|
| Basic | `docker-compose -f docker-compose-examples/basic-stack/docker-compose.yml build` | `up -d` | `down` |
| Cluster | `docker-compose -f docker-compose-examples/cluster-example/docker-compose.yml build` | `up -d` | `down` |
| Swarm | `docker-compose -f docker-compose-examples/swarm-stack/docker-compose.yml build` | `up -d` | `down` |

## 🔧 Troubleshooting

### Python 3.14.0rc3 Issues

If you encounter "Fatal Python error: config_read_gil", "write EPIPE", or server crashes:

1. **Use Python 3.13**: All Python tasks are configured to use Python 3.13
2. **Disable native servers**: Ruff and isort native servers are disabled in settings
3. **Check interpreter path**: Ensure `.venv/Scripts/python.exe` points to Python 3.13

### Common Issues

#### Python Environment Not Found
```bash
# Run Python setup first
powershell -ExecutionPolicy Bypass -File setup-python.ps1
```

#### UV Not Installed
```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh
# Or on Windows
powershell -ExecutionPolicy Bypass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### Docker Not Running
```bash
# Start Docker Desktop
# Or install Docker Engine
```

#### Port Conflicts
- React dev server: `http://localhost:3000`
- FastAPI server: `http://localhost:8000`
- MCP server: Check configuration for port settings

#### Permission Issues
```bash
# On Windows, run terminal as Administrator
# Or use PowerShell with ExecutionPolicy Bypass
powershell -ExecutionPolicy Bypass -Command "your-command-here"
```

### Debug Configurations

Use the debug configurations in `.vscode/launch.json`:

- **Run React App** - Launch React development server
- **Debug React App** - Debug React app in Chrome
- **Debug FastAPI Server** - Debug Python FastAPI server
- **Debug MCP Server** - Debug MCP server
- **Debug Python Tests** - Debug Python test execution
- **Attach to Python Process** - Attach debugger to running Python process
- **Debug Docker Container** - Debug Python code in Docker container

### Performance Optimization

- Tasks use `--python 3.13` to avoid Python 3.14 compatibility issues
- Background tasks (`isBackground: true`) don't block the terminal
- Problem matchers provide clickable error navigation
- Presentation settings optimize terminal usage

### Environment Variables

Set these environment variables for optimal performance:

```bash
# For React development
BROWSER=none
WDS_SOCKET_PORT=0

# For Python development
PYTHONPATH=/path/to/python_utils
UV_CACHE_DIR=/path/to/cache
```

## 📚 Additional Resources

- [VS Code Tasks Documentation](https://code.visualstudio.com/docs/editor/tasks)
- [Ruff Linter](https://github.com/astral-sh/ruff)
- [UV Package Manager](https://github.com/astral-sh/uv)
- [Docker Compose](https://docs.docker.com/compose/)
- [Python Debugpy](https://github.com/microsoft/debugpy)
