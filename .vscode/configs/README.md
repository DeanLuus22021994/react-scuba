# VS Code Configuration Structure

This directory contains organized VS Code workspace configurations for the React Scuba monorepo.

## Directory Structure

```
.vscode/
├── settings.json                    # Main settings (orchestration)
├── extensions.json                  # Recommended extensions
├── launch.json                      # Debug configurations
├── tasks.json                       # Build/test tasks
├── mcp.json                         # MCP server configurations
│
├── configs/                         # Extended configuration files
│   ├── settings.turbo.json         # Turbo monorepo optimizations
│   ├── settings.client.json        # Multi-tenant client settings
│   └── README.md                   # This documentation
│
├── schemas/                         # JSON Schema definitions
│   ├── mcp-server.schema.json      # MCP server validation
│   ├── client-config.schema.json   # Client configuration validation
│   └── turbo-pipeline.schema.json  # Turbo pipeline validation
│
├── mcp-servers/                     # MCP server implementations
│   ├── filesystem/                 # File system operations
│   ├── github/                     # GitHub integrations
│   └── docker/                     # Docker management
│
├── scripts/                         # Automation scripts
│   ├── copilot-context-manager.js  # Copilot context generation
│   ├── validate-mcp-servers.ts     # MCP server validation
│   ├── merge-configs.js            # Configuration merging
│   └── setup-workspace.sh          # Workspace setup
│
└── copilot/                         # GitHub Copilot instructions
    ├── instructions.md             # Main Copilot instructions
    ├── agent-best-practices.md     # AI Toolkit guidance
    └── azure-best-practices.md     # Azure development patterns
```

## Configuration Files

### settings.turbo.json

Turbo monorepo-specific optimizations including:

- TypeScript server memory allocation (12GB)
- File watching exclusions for build artifacts
- NPM workspace integration
- Biome linter path resolution
- Explorer file nesting patterns

### settings.client.json

Multi-tenant client development settings:

- Client configuration JSON schema validation
- File associations for client configs
- Tailwind CSS client theming support
- Content provider TypeScript settings

## Usage

### Configuration Merging Options

#### Option 1: Apply Domain-Specific Settings (Replaces Current Settings)

```bash
npm run workspace:setup
# This creates a new settings.json with only domain-specific configurations
# Original settings are backed up to .vscode/settings.json.pre-merge-backup
```

#### Option 2: Manual Selective Application

Copy specific settings from `settings.turbo.json` or `settings.client.json` into the main `settings.json` file as needed.

#### Option 3: Workspace-Specific Overrides

Use VS Code's multi-root workspace feature with the generated `react-scuba.code-workspace` file for workspace-specific settings.

### Restoring Original Settings

```bash
# If you need to restore the comprehensive original settings:
mv .vscode/settings.json.pre-merge-backup .vscode/settings.json
```

### Automatic Merging (Future Enhancement)

The `merge-configs.js` script can be extended to automatically merge configurations from this directory into the main `settings.json` file.

## Best Practices

1. **Keep Root Files Minimal**: Main configuration files should only contain orchestration logic
2. **Domain-Specific Configs**: Use subdirectory configs for specific concerns (Turbo, clients, etc.)
3. **Schema Validation**: All JSON configurations should have corresponding schemas
4. **Documentation**: Update this README when adding new configuration files
5. **Version Control**: All configuration files are tracked in Git (no `.gitignore` exclusions)

## Development Workflow

1. **Initial Setup**: Run workspace setup script to merge configurations
2. **Development**: Use domain-specific settings for focused development
3. **Team Sync**: Commit configuration changes to share with team
4. **Validation**: Use MCP server validation scripts before committing

## Future Enhancements

- [ ] Automatic configuration merging on VS Code startup
- [ ] Environment-specific configuration overrides
- [ ] Client-specific debug configurations
- [ ] Automated schema generation from TypeScript types
