/**
 * Context Validator
 * Validates and reports on existing copilot context files
 */

import * as fs from 'fs';
import * as path from 'path';
import { log, colors } from './colors.js';

export function validateContext(rootDir: string): void {
  log(`\n${colors.bright}🔍 Validating Copilot Context Files${colors.reset}\n`);

  const instructionFiles: string[] = [];
  const ignoreFiles: string[] = [];

  function findFiles(dir: string): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
          findFiles(fullPath);
        } else if (entry.isFile()) {
          if (entry.name === 'copilot-instructions.md') {
            instructionFiles.push(fullPath);
          } else if (entry.name === '.copilotignore') {
            ignoreFiles.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  findFiles(rootDir);

  log(`${colors.bright}Instruction Files:${colors.reset}`);
  if (instructionFiles.length === 0) {
    log('  None found', colors.yellow);
  } else {
    instructionFiles.forEach((file) => {
      const relativePath = path.relative(rootDir, file);
      log(`  ✅ ${relativePath}`, colors.green);
    });
  }

  log(`\n${colors.bright}Ignore Files:${colors.reset}`);
  if (ignoreFiles.length === 0) {
    log('  None found', colors.yellow);
  } else {
    ignoreFiles.forEach((file) => {
      const relativePath = path.relative(rootDir, file);
      log(`  ✅ ${relativePath}`, colors.green);
    });
  }

  log(`\n${colors.bright}Summary:${colors.reset}`);
  log(`📄 Total instruction files: ${instructionFiles.length}`, colors.blue);
  log(`🚫 Total ignore files: ${ignoreFiles.length}`, colors.blue);
  log('');
}
