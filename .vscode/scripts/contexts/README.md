# Copilot Context Templates

This directory contains template files used by `copilot-context-manager.ts` to generate `.github/copilot-instructions.md` files across the React Scuba monorepo.

## Template Files

### Root Context
- **root-instructions.md** - Main workspace instructions for `.github/copilot-instructions.md`
  - Project overview and directory structure
  - Technology stack details
  - Code standards and conventions
  - Multi-tenant architecture patterns
  - Testing conventions
  - Common commands
  - Key files and documentation references

### Workspace Contexts
- **web-app.md** - React frontend workspace (`server/apps/web`)
- **api.md** - Express backend workspace (`server/apps/api`)
- **content.md** - Multi-tenant content provider (`server/apps/content`)

### Package Contexts
- **config-package.md** - Shared configuration package (`server/packages/config`)
- **types-package.md** - Shared TypeScript types (`server/packages/types`)
- **ui-package.md** - Shared React components (`server/packages/ui`)
- **utils-package.md** - Shared utilities (`server/packages/utils`)

### Ignore Files
- **copilotignore.txt** - Template for `.copilotignore` file
  - Node.js build artifacts
  - Test coverage reports
  - Python artifacts
  - Docker files
  - IDE and OS files
  - Environment variables
  - Logs and databases
  - Client-specific images
  - Data directories

## Usage

Templates are loaded by `copilot-context-manager.ts` using the `loadTemplate()` function:

\`\`\`typescript
const content = loadTemplate('root-instructions.md');
\`\`\`

## Adding New Templates

1. Create a new `.md` file in this directory
2. Add the template content
3. Update the `phases` array in `copilot-context-manager.ts`:

\`\`\`typescript
{
  path: 'destination/path/.github/copilot-instructions.md',
  templateFile: 'your-template.md',
  type: 'instructions',
}
\`\`\`

## Maintenance

- **Keep templates in sync** with actual codebase changes
- **Update technology versions** when dependencies are upgraded
- **Add new workspaces** as the monorepo grows
- **Validate templates** using `npm run copilot:validate`

## File Naming Conventions

- Use kebab-case for template filenames
- Instructions: `*.md` files
- Ignore files: `*.txt` files
- Be descriptive: `web-app.md` not `app1.md`

## Related Files

- **copilot-context-manager.ts** - Main script that uses these templates
- **../../.github/copilot-instructions.md** - Generated root instructions
- **../../../server/*/. github/copilot-instructions.md** - Generated workspace instructions
