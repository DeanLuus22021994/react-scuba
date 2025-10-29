/**
 * Phase Definitions
 * Configuration for all copilot context generation phases
 */

import type { CopilotPhase } from './types.js';

export const phases: CopilotPhase[] = [
  {
    id: 'phase1',
    name: 'Root Instructions',
    dependencies: [],
    files: [
      {
        path: '.github/copilot-instructions.md',
        templateFile: 'root-instructions.md',
        type: 'instructions',
      },
    ],
  },
  {
    id: 'phase2',
    name: 'Workspace Instructions',
    dependencies: ['phase1'],
    files: [
      {
        path: 'server/apps/web/.github/copilot-instructions.md',
        templateFile: 'web-app.md',
        type: 'instructions',
      },
      {
        path: 'server/apps/api/.github/copilot-instructions.md',
        templateFile: 'api.md',
        type: 'instructions',
      },
      {
        path: 'server/apps/content/.github/copilot-instructions.md',
        templateFile: 'content.md',
        type: 'instructions',
      },
      {
        path: 'server/packages/config/.github/copilot-instructions.md',
        templateFile: 'config-package.md',
        type: 'instructions',
      },
      {
        path: 'server/packages/types/.github/copilot-instructions.md',
        templateFile: 'types-package.md',
        type: 'instructions',
      },
      {
        path: 'server/packages/ui/.github/copilot-instructions.md',
        templateFile: 'ui-package.md',
        type: 'instructions',
      },
      {
        path: 'server/packages/utils/.github/copilot-instructions.md',
        templateFile: 'utils-package.md',
        type: 'instructions',
      },
    ],
  },
  {
    id: 'phase3',
    name: 'Copilotignore',
    dependencies: ['phase1'],
    files: [
      {
        path: '.copilotignore',
        templateFile: 'copilotignore.txt',
        type: 'ignore',
      },
    ],
  },
];
