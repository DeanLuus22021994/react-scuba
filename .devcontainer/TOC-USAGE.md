# DevContainer TOC - Usage Guide

## Files Created

### 1. devcontainer-toc.yml
**Purpose**: Machine-readable table of contents for the `.devcontainer` directory
**Format**: YAML 1.2 (lintable, parseable)
**Size**: Token-optimized structure (~6KB compressed)

**Features**:
- Complete service inventory (28 services across 6 tiers)
- Network architecture with IP allocation map
- Volume strategy (13 named volumes, bind mounts)
- Health check endpoints (9 services)
- Development workflows and commands
- Troubleshooting guide

### 2. devcontainer-toc.schema.json
**Purpose**: JSON Schema for validating `devcontainer-toc.yml`
**Standard**: JSON Schema Draft-07
**Use**: Static validation of structure and data types

**Validates**:
- Required fields and structure
- Data type constraints
- Enum values (status, protocol, etc.)
- Pattern matching (IPs, versions)
- Array item schemas

### 3. validate-toc.ps1
**Purpose**: PowerShell validation script
**Dependencies**: `powershell-yaml` module (auto-installable)

**Features**:
- YAML syntax validation
- Required field checking
- Data consistency validation
- Statistical analysis
- JSON output mode

## Quick Start

### Install Dependencies
```powershell
cd .devcontainer
.\validate-toc.ps1 -InstallDependencies
```

### Run Validation
```powershell
.\validate-toc.ps1
```

### JSON Output
```powershell
.\validate-toc.ps1 -Json | jq
```

## Validation Checks

### 1. YAML Syntax
- Parses YAML structure
- Validates data types
- Checks for syntax errors

### 2. Required Fields
- `metadata` (version, status, service count)
- `directory_structure` (root, files, directories)
- `core_configuration` (devcontainer, MCP servers)
- `infrastructure_components` (compose, databases, etc.)
- `network_architecture` (IP allocation)
- `volume_strategy` (named volumes, bind mounts)
- `service_health` (health checks)
- `status` (last updated, operational state)

### 3. Consistency Checks
- **Service count**: Metadata matches compose tier totals
- **IP format**: All IPs match `x.x.x.x` pattern
- **Volume naming**: Follow `react_scuba_*` convention
- **Status values**: Valid enum values

### 4. Statistics
- Total services: 28
- MCP servers: 9
- Named volumes: 13
- Health checks: 9
- Workflow steps: 5
- IP allocations: 25

## Integration Examples

### CI/CD Validation
```yaml
# .github/workflows/validate-devcontainer.yml
name: Validate DevContainer TOC
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install PowerShell
        run: |
          sudo apt-get update
          sudo apt-get install -y powershell
      - name: Validate TOC
        run: |
          cd .devcontainer
          pwsh -File validate-toc.ps1
```

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
cd .devcontainer
pwsh -ExecutionPolicy Bypass -File validate-toc.ps1
if [ $? -ne 0 ]; then
    echo "DevContainer TOC validation failed!"
    exit 1
fi
```

### VS Code Task
```json
{
  "label": "Validate DevContainer TOC",
  "type": "shell",
  "command": "pwsh",
  "args": [
    "-ExecutionPolicy", "Bypass",
    "-File", "${workspaceFolder}/.devcontainer/validate-toc.ps1"
  ],
  "group": "test"
}
```

## Programmatic Usage

### PowerShell
```powershell
# Load YAML data
Import-Module powershell-yaml
$toc = Get-Content .devcontainer/devcontainer-toc.yml -Raw | ConvertFrom-Yaml

# Query services
$toc.infrastructure_components.compose.tiers.base.services

# Get network info
$toc.network_architecture.ip_allocation.mcp_services

# Check status
$toc.status.devcontainer_status
```

### Python
```python
import yaml

with open('.devcontainer/devcontainer-toc.yml') as f:
    toc = yaml.safe_load(f)

# Get service count
total = toc['metadata']['total_services']

# List MCP servers
for server in toc['core_configuration']['mcp_servers']['servers']:
    print(f"{server['name']}: {server['purpose']}")

# Get IPs
for tier, data in toc['network_architecture']['ip_allocation'].items():
    for service in data['services']:
        print(f"{service['name']}: {service['ip']}")
```

### Node.js
```javascript
const yaml = require('js-yaml');
const fs = require('fs');

const toc = yaml.load(fs.readFileSync('.devcontainer/devcontainer-toc.yml', 'utf8'));

// Get services by tier
const mcpServices = toc.infrastructure_components.compose.tiers.mcp.services;

// Query volumes
const volumes = Object.values(toc.volume_strategy.named_volumes).flat();

// Check health endpoints
toc.service_health.health_checks.forEach(check => {
  console.log(`${check.service}: http://localhost:${check.port}${check.endpoint}`);
});
```

## Maintenance

### Updating Service Count
When adding/removing services, update:
1. `metadata.total_services`
2. `status.total_services`
3. `infrastructure_components.compose.tiers.<tier>.service_count`
4. Add/remove service entries in relevant tier

### Adding New Tier
```yaml
infrastructure_components:
  compose:
    tiers:
      new_tier:
        file: "new-tier.yml"
        service_count: 2
        services:
          - { name: "service-1", ip: "172.28.0.90", port: 8080 }
          - { name: "service-2", ip: "172.28.0.91", port: 8081 }
```

### Network Allocation
```yaml
network_architecture:
  ip_allocation:
    new_tier:
      range: "172.28.0.90-99"
      services:
        - { name: "service-1", ip: "172.28.0.90" }
        - { name: "service-2", ip: "172.28.0.91" }
```

## Troubleshooting

### Validation Fails
```powershell
# Check which validation failed
.\validate-toc.ps1 -Verbose

# Get JSON output for debugging
.\validate-toc.ps1 -Json | ConvertFrom-Json | Format-List
```

### YAML Parsing Errors
- Check indentation (2 spaces, no tabs)
- Verify quotes around strings with special characters
- Ensure array syntax is consistent

### Schema Validation
- Install ajv-cli: `npm install -g ajv-cli`
- Convert YAML to JSON and validate manually

## Benefits

### For AI/Copilot
- Structured, parseable format
- Token-optimized (minimal verbosity)
- Complete context in single file
- Semantic relationships preserved

### For Automation
- Machine-readable (YAML/JSON)
- Validated structure (schema)
- Consistent data types
- Programmatic access

### For Documentation
- Single source of truth
- Always current (validated)
- Easy to query/search
- Version controlled

## Related Documentation

- [DevContainer Architecture](../.copilot/infrastructure/devcontainer-architecture.md)
- [MCP Services](../.copilot/infrastructure/devcontainer-mcp-services.md)
- [Validation Results](../.copilot-tracking/20251029-devcontainer-cluster-analysis-final-report.md)

---

**Status**: ✅ All validations passed (28 services, 9 health checks, 13 volumes)
**Last Validated**: 2025-10-30
