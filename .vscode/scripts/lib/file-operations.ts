/**
 * File Operations
 * File system utilities for creating copilot context files
 */

import * as fs from 'fs';
import * as path from 'path';
import type { CopilotFile } from './types.js';
import { loadTemplate } from './template-loader.js';
import { log, colors } from './colors.js';

export function ensureDir(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function createFile(
  file: CopilotFile,
  rootDir: string,
  contextsDir: string
): boolean {
  const fullPath = path.resolve(rootDir, file.path);

  if (fs.existsSync(fullPath)) {
    log(`⚠️  Skipping ${file.path} (already exists)`, colors.yellow);
    return false;
  }

  const content = loadTemplate(contextsDir, file.templateFile);
  ensureDir(fullPath);
  fs.writeFileSync(fullPath, content, 'utf-8');
  log(`✅ Created ${file.path}`, colors.green);
  return true;
}
