/**
 * Phase Executor
 * Executes individual phases or all phases of context generation
 */

import type { CopilotPhase } from './types.js';
import { createFile } from './file-operations.js';
import { log, colors } from './colors.js';

export function executePhase(
  phase: CopilotPhase,
  rootDir: string,
  contextsDir: string
): void {
  log(`\n${colors.bright}📋 Executing Phase: ${phase.name}${colors.reset}\n`);

  let created = 0;
  let skipped = 0;

  for (const file of phase.files) {
    if (createFile(file, rootDir, contextsDir)) {
      created++;
    } else {
      skipped++;
    }
  }

  log(`\n${colors.bright}Summary:${colors.reset}`);
  log(`✅ Created: ${created}`, colors.green);
  log(`⚠️  Skipped: ${skipped}`, colors.yellow);
  log(`✨ Phase "${phase.name}" complete!\n`, colors.blue);
}

export function executeAll(
  phases: CopilotPhase[],
  rootDir: string,
  contextsDir: string
): void {
  log(`\n${colors.bright}🚀 Executing All Phases${colors.reset}\n`);

  for (const phase of phases) {
    executePhase(phase, rootDir, contextsDir);
  }

  log(`${colors.bright}${colors.green}✨ All phases complete!${colors.reset}\n`);
}
