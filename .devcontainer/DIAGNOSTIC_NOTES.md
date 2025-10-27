# DevContainer MCP Configuration Notes

## Issues Resolved

### 1. DevContainer JSON Compliance
**Issue**: VS Code devcontainer.json doesn't support custom `servers` property for MCP configuration.

**Solution**: Moved MCP server configuration to separate file:
- **File**: `.devcontainer/mcp-servers.json`
- **Purpose**: Contains all MCP stdio server configurations for manual reference
- **Usage**: Can be referenced by VS Code extensions that support MCP

### 2. Grafana Datasource YAML Schema
**Issue**: VS Code YAML validator incorrectly applying Prometheus schema to Grafana datasource files.

**Current Status**: 
- The YAML file is syntactically correct for Grafana provisioning
- VS Code schema validator shows false positives due to incorrect schema association
- The file works correctly in Grafana (validated in testing)

**Technical Note**: 
The file uses the correct Grafana datasource provisioning format:
```yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    # ... other properties
```

This is the official Grafana format but VS Code incorrectly validates it against a Prometheus schema.

### 3. MCP Server Configuration for VS Code

For VS Code to use MCP servers, they need to be configured in the proper location:
- **VS Code Settings**: Configure in `.vscode/settings.json` under `chat.mcp.serverSampling`
- **Alternative**: Use VS Code MCP extension if available
- **Manual Setup**: Reference the configurations in `mcp-servers.json`

## Files Modified

1. **devcontainer.json**: Removed non-standard `servers` property
2. **prometheus.yml**: Added schema disable directive (false positive warnings remain)
3. **mcp-servers.json**: Created separate MCP configuration file

## Testing Status

✅ All services tested and working correctly:
- DevContainer builds successfully
- MCP servers respond to stdio protocol
- Grafana datasource configuration works in practice
- Docker compose orchestration operational

The diagnostic warnings are cosmetic and do not affect functionality.