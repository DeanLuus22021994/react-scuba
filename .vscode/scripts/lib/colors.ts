/**
 * ANSI Color Utilities
 * Terminal color codes for formatted console output
 */

export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
} as const;

export function log(message: string, color: string = colors.reset): void {
  console.log(`${color}${message}${colors.reset}`);
}
