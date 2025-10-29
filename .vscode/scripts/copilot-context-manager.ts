#!/usr/bin/env node
/**
 * Copilot Workspace Context Manager
 * Generates .github/copilot-instructions.md files across the monorepo
 * for enhanced GitHub Copilot workspace agent context awareness
 * 
 * Context templates are stored in .vscode/scripts/contexts/ directory
 * for maintainability and modularity.
 */

import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { phases } from './lib/phases.js';
import { handleCommand } from './lib/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');
const CONTEXTS_DIR = path.join(__dirname, 'contexts');

// Parse command-line arguments and execute
const args = process.argv.slice(2);
const command = args[0];

handleCommand(command, phases, ROOT_DIR, CONTEXTS_DIR);
