/**
 * CLI Handler
 * Command-line interface for copilot context management
 */

import type { CopilotPhase } from './types.js';
import { executePhase, executeAll } from './phase-executor.js';
import { validateContext } from './validator.js';
import { log, colors } from './colors.js';

export function handleCommand(
  command: string | undefined,
  phases: CopilotPhase[],
  rootDir: string,
  contextsDir: string
): void {
  switch (command) {
    case 'phase1': {
      const phase = phases.find((p) => p.id === 'phase1');
      if (!phase) {
        log(`❌ Phase "phase1" not found`, colors.red);
        process.exit(1);
      }
      executePhase(phase, rootDir, contextsDir);
      break;
    }
    case 'phase2': {
      const phase = phases.find((p) => p.id === 'phase2');
      if (!phase) {
        log(`❌ Phase "phase2" not found`, colors.red);
        process.exit(1);
      }
      executePhase(phase, rootDir, contextsDir);
      break;
    }
    case 'phase3': {
      const phase = phases.find((p) => p.id === 'phase3');
      if (!phase) {
        log(`❌ Phase "phase3" not found`, colors.red);
        process.exit(1);
      }
      executePhase(phase, rootDir, contextsDir);
      break;
    }
    case 'all':
      executeAll(phases, rootDir, contextsDir);
      break;
    case 'validate':
      validateContext(rootDir);
      break;
    default:
      showUsage();
      process.exit(1);
  }
}

function showUsage(): void {
  log(`\n${colors.bright}Copilot Context Manager${colors.reset}`, colors.blue);
  log('\nUsage:');
  log('  npm run copilot:phase1    - Create root instructions');
  log('  npm run copilot:phase2    - Create workspace instructions');
  log('  npm run copilot:phase3    - Create .copilotignore');
  log('  npm run copilot:all       - Execute all phases');
  log('  npm run copilot:validate  - Validate context files\n');
}
