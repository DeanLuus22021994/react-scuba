# React Scuba VS Code Scripts

> Enterprise-grade automation scripts for VS Code workspace management

## Overview

This directory contains enterprise-level automation scripts for managing the React Scuba multi-tenant development environment. All scripts follow strict coding standards, include comprehensive error handling, and provide detailed logging.

## Directory Structure

```text
.vscode/scripts/
├── README.md                    # This documentation
├── package.json                 # Script dependencies and metadata
├── tsconfig.json               # TypeScript configuration for scripts
├── src/                        # Organized source code
│   ├── config/                # Configuration management
│   │   └── merge-configs.js   # Settings merge utility
│   ├── development/           # Development tools
│   │   └── restart-ts-server.ps1  # TypeScript server restart
│   ├── documentation/         # Documentation tools
│   │   ├── generate-docs.js   # Auto-documentation generator
│   │   └── validate-toc.js    # TOC validation
│   ├── git/                   # Git integration
│   │   └── install-hooks.js   # Git hooks installer
│   ├── maintenance/           # Workspace maintenance
│   │   └── clean-workspace.js # Cleanup utilities
│   ├── mcp/                   # Model Context Protocol
│   │   └── validate-servers.js # MCP server validation
│   ├── setup/                 # Initial setup
│   │   └── setup-workspace.sh # Workspace initialization
│   └── validation/            # Quality assurance
│       ├── lint-scripts.js    # Script linting
│       ├── test-all.js        # Test runner
│       └── validate-structure.js # Structure validation
└── legacy/                    # Legacy scripts (to be refactored)
    ├── copilot-context-manager.js
    ├── copilot-context-manager.ts
    └── install-hooks.js
```

## Available Scripts

### Workspace Management

| Script | Command | Description |
|--------|---------|-------------|
| Setup | `npm run workspace:setup` | Merge VS Code configurations |
| Initialize | `npm run workspace:init` | Complete workspace initialization |
| Validate | `npm run workspace:validate` | Validate workspace structure |
| Clean | `npm run workspace:clean` | Clean temporary files and caches |

### Development Tools

| Script | Command | Description |
|--------|---------|-------------|
| TypeScript Restart | `npm run typescript:restart` | Restart TypeScript language server |
| Documentation | `npm run docs:generate` | Generate project documentation |
| Git Hooks | `npm run hooks:install` | Install Git pre-commit hooks |

### Quality Assurance

| Script | Command | Description |
|--------|---------|-------------|
| Lint | `npm run lint` | Lint all scripts for quality |
| Test | `npm run test` | Run all script tests |
| MCP Validation | `npm run mcp:validate` | Validate MCP server configurations |
| TOC Validation | `npm run toc:validate` | Validate documentation table of contents |

## Usage Examples

### Initial Setup

```bash
# Navigate to scripts directory
cd .vscode/scripts

# Install dependencies
npm install

# Run initial workspace setup
npm run workspace:init

# Validate everything is working
npm run workspace:validate
```

### Development Workflow

```bash
# Daily development workflow
npm run workspace:validate  # Check structure
npm run typescript:restart  # Restart TS server if needed
npm run lint                # Check script quality
npm run test                # Run tests
```

### Maintenance

```bash
# Weekly maintenance
npm run workspace:clean     # Clean temporary files
npm run docs:generate       # Update documentation
npm run mcp:validate        # Validate MCP servers
```

## Standards and Conventions

### Code Quality

- **Error Handling**: All scripts include comprehensive try-catch blocks
- **Logging**: Standardized logging with prefixes and color coding
- **Documentation**: JSDoc comments for all functions
- **Testing**: Unit tests for all critical functions

### File Naming

- **kebab-case**: For script files (`merge-configs.js`)
- **PascalCase**: For class/component files
- **Descriptive**: Names clearly indicate purpose

### PowerShell Standards

- **Comment-Based Help**: All PowerShell scripts include help blocks
- **Parameter Validation**: Proper parameter definitions with types
- **Error Action**: Explicit error handling preferences
- **Verbose Support**: Optional verbose logging

### JavaScript/Node.js Standards

- **ES Modules**: Use import/export syntax
- **Async/Await**: Prefer over Promise chains
- **Destructuring**: Use for cleaner code
- **Template Literals**: For string interpolation

## Environment Requirements

- **Node.js**: >=20.0.0
- **npm**: >=10.0.0
- **PowerShell**: >=7.0 (for PowerShell scripts)
- **Git**: Latest stable version

## Contributing

### Adding New Scripts

1. Place in appropriate `src/` subdirectory
2. Follow naming conventions
3. Include comprehensive documentation
4. Add to package.json scripts section
5. Create tests in `tests/` directory
6. Update this README

### Testing

```bash
# Test individual script
node src/validation/test-all.js --script=config/merge-configs.js

# Test all scripts
npm test

# Lint all scripts
npm run lint
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| TypeScript server not restarting | Run `npm run typescript:restart` |
| Config merge fails | Check `.vscode/configs/` permissions |
| Script permissions denied | Run `Set-ExecutionPolicy RemoteSigned` |
| Node version mismatch | Upgrade to Node.js >=20.0.0 |

### Logs and Debugging

All scripts output logs with prefixes:

- `[CONFIG]` - Configuration operations
- `[TS-RESTART]` - TypeScript server operations  
- `[VALIDATE]` - Validation operations
- `[SETUP]` - Setup operations

Use `-Verbose` or `--verbose` flags for detailed output.

## Security

- Scripts run with minimal required permissions
- No external network calls without explicit user consent
- All file operations are scoped to workspace directory
- Sensitive data is never logged or stored

## Version History

- **v1.0.0** - Initial enterprise-grade reorganization
- **v0.9.x** - Legacy scattered scripts (deprecated)

---

**Enterprise Development Team**  
*React Scuba Multi-Tenant Platform*
