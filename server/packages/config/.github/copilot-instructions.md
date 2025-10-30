# React Scuba Config Package - Copilot Instructions

## Workspace: @react-scuba/config

This package contains **shared tooling configurations** for the monorepo.

## Configurations

- **tsconfig.base.json**: Base TypeScript config (extended by all workspaces)
- Code formatting and linting handled by VS Code built-in language servers
- **tsconfig.node.json**: Node.js TypeScript config
- **tsconfig.react.json**: React TypeScript config

## Usage

Other workspaces extend these configs:

```json
{
  "extends": "@react-scuba/config/tsconfig.react.json"
}
```

## Standards

- **Line length**: 100 characters
- **Indentation**: 2 spaces
- **Quotes**: Single quotes (JS/TS)
- **TypeScript strict mode**: Enabled

## Copilot Output Guidelines

**IMPORTANT**: Do NOT generate summary documents, changelog files, or markdown reports unless explicitly requested. Provide only enterprise-focused explicit output for tasks. Make changes directly without documentation overhead.
