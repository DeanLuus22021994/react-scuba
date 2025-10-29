# React Scuba Python MCP Utilities

Python utilities for the React Scuba multi-tenant dive shop management platform. Provides MCP (Model Context Protocol) server with HTTP endpoint and real-time health monitoring.

## Features

- **MCP Server**: FastAPI-based HTTP server on internal port 9099
- **Protocol Validation**: Full MCP protocol compliance testing
- **Health Monitoring**: Real-time health checks with WebSocket support
- **Free-Threading**: Python 3.14t with GIL support
- **UV Package Manager**: Ultra-fast dependency management

## Installation

```bash
# Using UV (recommended)
uv pip install -e .

# With development dependencies
uv pip install -e ".[dev]"
```

## Usage

### Running the MCP Server

```bash
# Start the server
python -m react_scuba_utils.mcp_server

# Server runs on http://0.0.0.0:9099 (internal only)
```

### Health Checks

```bash
# Basic health check
python -m react_scuba_utils.health

# With protocol validation
python -m react_scuba_utils.health --protocol-validation

# Custom endpoint
python -m react_scuba_utils.health --endpoint http://localhost:9099/health
```

## Endpoints

- `GET /` - Root endpoint with server information
- `GET /health` - Health check with MCP protocol validation
- `GET /info` - Server capabilities and version information
- `WS /ws` - WebSocket endpoint for real-time communication

## Development

```bash
# Install development dependencies
uv pip install -e ".[dev]"

# Run tests
pytest

# Run tests with coverage
pytest --cov=react_scuba_utils --cov-report=html

# Lint with Ruff
ruff check src/

# Format with Black
black src/

# Sort imports with isort
isort src/
```

## Docker Integration

The MCP service runs as a persistent sidecar container in the React Scuba development environment:

```bash
# Start with MCP profile
docker compose --profile mcp up -d

# Check service health
docker compose exec python-mcp-sidecar python -m react_scuba_utils.health --protocol-validation

# View logs
docker compose logs -f python-mcp-sidecar
```

## Protocol Specification

### Health Check Response

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "protocol": "MCP/1.0",
  "connections": 0
}
```

### Required Fields

- `status`: Health status ("healthy" | "unhealthy")
- `version`: Server version (semver)
- `protocol`: MCP protocol version (format: "MCP/x.y")

## Configuration

Environment variables:

- `MCP_HTTP_PORT`: HTTP server port (default: 9099)
- `MCP_PROTOCOL_VERSION`: Protocol version (default: 1.0.0)
- `PYTHONUNBUFFERED`: Enable unbuffered output (default: 1)
- `PYTHON_GIL_MODE`: GIL mode for free-threading (default: 1)

## License

Part of the React Scuba project.
