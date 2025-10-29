# Copilot Context Manager Library

This directory contains the modular library modules for the Copilot Context Manager.

## Module Structure

### Core Modules

- **types.ts** - TypeScript interface definitions
  - `CopilotFile` - File configuration interface
  - `CopilotPhase` - Phase configuration interface

- **colors.ts** - ANSI color utilities for terminal output
  - Color constants (reset, bright, green, yellow, blue, red)
  - `log()` function for colored console output

- **template-loader.ts** - Template file loading
  - `loadTemplate()` - Reads markdown templates from contexts directory

- **file-operations.ts** - File system operations
  - `ensureDir()` - Creates directories recursively
  - `createFile()` - Creates copilot instruction files from templates

- **phases.ts** - Phase configuration data
  - Exported `phases` array with all phase definitions

- **phase-executor.ts** - Phase execution logic
  - `executePhase()` - Executes a single phase
  - `executeAll()` - Executes all phases sequentially

- **validator.ts** - Context file validation
  - `validateContext()` - Scans workspace for copilot context files

- **cli.ts** - Command-line interface handler
  - `handleCommand()` - Routes CLI commands to appropriate functions
  - `showUsage()` - Displays help text

## Module Dependencies

```
copilot-context-manager.ts (entry point)
├── lib/phases.ts
├── lib/cli.ts
│   ├── lib/phase-executor.ts
│   │   ├── lib/file-operations.ts
│   │   │   ├── lib/template-loader.ts
│   │   │   ├── lib/colors.ts
│   │   │   └── lib/types.ts
│   │   └── lib/colors.ts
│   ├── lib/validator.ts
│   │   └── lib/colors.ts
│   └── lib/colors.ts
└── lib/types.ts
```

## Adding New Modules

1. Create a new `.ts` file in this directory
2. Add JSDoc comments explaining the module's purpose
3. Export functions/constants using ES modules syntax
4. Import where needed using relative paths with `.js` extension
5. Update this README with module documentation

## Module Design Principles

- **Single Responsibility**: Each module has one clear purpose
- **No Circular Dependencies**: Import hierarchy flows downward
- **Type Safety**: Use TypeScript interfaces from `types.ts`
- **ES Modules**: Use `.js` extensions in import statements
- **Documentation**: JSDoc comments for all public functions
