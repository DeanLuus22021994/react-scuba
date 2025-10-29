/**
 * Template Loader
 * Loads markdown template files from the contexts directory
 */

import * as fs from 'fs';
import * as path from 'path';

export function loadTemplate(contextsDir: string, templateFile: string): string {
  const templatePath = path.join(contextsDir, templateFile);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }
  
  return fs.readFileSync(templatePath, 'utf-8');
}
