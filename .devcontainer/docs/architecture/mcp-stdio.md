# MCP stdio Architecture

## Overview

Model Context Protocol (MCP) servers run as stdio processes managed by the DevContainer, providing file, git, web fetch, GitHub, and memory capabilities directly to Copilot Chat with sub-500ms latency.

## stdio vs HTTP Transport

**Why stdio?**

- **Performance**: Direct process communication, no TCP/HTTP overhead
- **Latency**: <500ms typical (vs HTTP's network stack latency)
- **Simplicity**: No port management, zero network configuration
- **Security**: No exposed ports, process isolation via filesystem

## Architecture Diagram

```
Copilot Chat → VS Code Extension → DevContainer MCP Client
                                        ↓
                                   stdio streams
                                        ↓
┌─────────────────────────────────────────────────────┐
│ MCP Servers (stdio processes in DevContainer)      │
├─────────────────────────────────────────────────────┤
│ filesystem-mcp → read/write files in workspace     │
│ git-mcp → repo operations, diffs, commits           │
│ fetch-mcp → HTTP requests, web scraping             │
│ github-mcp → GitHub API, repos, issues, PRs         │
│ memory-mcp → KV store, persistent context           │
└─────────────────────────────────────────────────────┘
```

## Configuration Location

**File**: `.devcontainer/devcontainer.json`

```json
{
  "customizations": {
    "vscode": {
      "settings": {
        "mcp.servers": {
          "filesystem": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
          }
        }
      }
    }
  }
}
```

## Server Specifications

### filesystem-mcp

- **Implementation**: `@modelcontextprotocol/server-filesystem`
- **Command**: `npx -y @modelcontextprotocol/server-filesystem <allowed_path>`
- **Capabilities**: read_file, write_file, list_directory, search_files
- **Security**: Path restricted to workspace root
- **Performance**: Direct filesystem I/O, <50ms per operation

### git-mcp

- **Implementation**: `@modelcontextprotocol/server-git`
- **Command**: `npx -y @modelcontextprotocol/server-git`
- **Capabilities**: git_status, git_diff, git_log, git_commit, git_add
- **Repository**: Auto-detects `.git` in workspace
- **Performance**: <100ms for status, <500ms for complex diffs

### fetch-mcp

- **Implementation**: `@modelcontextprotocol/server-fetch`
- **Command**: `npx -y @modelcontextprotocol/server-fetch`
- **Capabilities**: HTTP GET/POST, web scraping, API calls
- **Network**: Uses DevContainer's network (172.20.0.60)
- **Performance**: Depends on external API latency

### github-mcp

- **Implementation**: `@modelcontextprotocol/server-github`
- **Command**: `npx -y @modelcontextprotocol/server-github`
- **Environment**: Requires `GITHUB_TOKEN` from host
- **Capabilities**: repos, issues, PRs, actions, workflows
- **API Rate Limits**: Respects GitHub's rate limiting

### memory-mcp

- **Implementation**: `@modelcontextprotocol/server-memory`
- **Command**: `npx -y @modelcontextprotocol/server-memory`
- **Storage**: Key-value store, in-memory or file-backed
- **Use Case**: Persistent context across Copilot sessions
- **Performance**: <10ms for KV operations

## Lifecycle Management

### Startup

1. DevContainer starts
2. VS Code connects to DevContainer
3. MCP extension reads `devcontainer.json`
4. Spawns stdio processes for each server
5. Establishes JSON-RPC communication

### Runtime

- **Process Supervision**: VS Code MCP extension
- **Restart**: Automatic on crash
- **Logging**: STDERR to VS Code Output panel
- **Health**: Implicit (process alive = healthy)

### Shutdown

- SIGTERM sent to all MCP processes
- Graceful cleanup (5s timeout)
- SIGKILL if unresponsive

## stdio Protocol Flow

```
Client Request → JSON-RPC over stdin → MCP Server Processing
                                           ↓
Client Response ← JSON-RPC over stdout ← Result/Error
```

**Format**: JSON-RPC 2.0 (newline-delimited JSON)

## Error Handling

- **Process Crash**: Auto-restart by VS Code
- **Protocol Error**: Error response to client
- **Timeout**: Configurable per-server
- **Dependency Missing**: Clear error message (e.g., "git not found")

## Performance Optimization

- **Lazy Loading**: Servers start on first request
- **Connection Pooling**: Reuse stdio connections
- **Caching**: MCP servers cache frequently accessed data
- **Parallel Requests**: Multiple servers handle requests concurrently

## Security Model

- **Sandboxing**: stdio processes run as DevContainer user
- **Path Restrictions**: filesystem-mcp limited to workspace
- **Environment Isolation**: Each server has minimal environment
- **No Network Exposure**: No ports, no external access

## Monitoring

- **Logs**: VS Code Output panel → "MCP Servers"
- **Process Status**: Task Manager shows `npx` processes
- **Performance**: MCP extension shows request latency
- **Debugging**: Set `"mcp.debug": true` in VS Code settings

## Comparison: stdio vs Docker Services

| Aspect         | stdio (This Architecture) | Docker Services (Old)   |
| -------------- | ------------------------- | ----------------------- |
| Latency        | <500ms                    | 1-2s (network overhead) |
| Ports          | 0 (no network)            | 5+ ports exposed        |
| Configuration  | devcontainer.json         | docker-compose.mcp.yml  |
| Scaling        | 1 process/server          | 1 container/server      |
| Resource Usage | ~50MB RAM total           | ~500MB RAM total        |
| Startup Time   | <1s                       | ~10s (container init)   |

## Migration from Docker Services

**Before**: MCP servers as separate Docker containers
**After**: MCP servers as stdio processes
**Benefit**: 10x faster, 10x less resource usage, simpler configuration

## Troubleshooting

**Server not responding**: Check VS Code Output → MCP Servers
**Command not found**: Ensure Node.js 22 installed in DevContainer
**Permission denied**: Verify workspace path permissions
**High latency**: Check for blocking I/O operations in server implementation

## References

- MCP Protocol: https://modelcontextprotocol.io/
- stdio Transport: https://modelcontextprotocol.io/docs/concepts/transports#stdio
- Official Servers: https://github.com/modelcontextprotocol/servers
