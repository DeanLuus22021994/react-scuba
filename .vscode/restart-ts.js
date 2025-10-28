#!/usr/bin/env node
/**
 * TypeScript Language Server Restart Utility
 * Forces VS Code to restart TypeScript and clear module cache
 */

const fs = require('fs');
const path = require('path');

// Clear TypeScript cache
const tscacheDir = path.join(process.cwd(), 'apps', 'web', '.tscache');
if (fs.existsSync(tscacheDir)) {
  fs.rmSync(tscacheDir, { recursive: true, force: true });
  console.log('✅ TypeScript cache cleared');
}

// Touch tsconfig to trigger reload
const tsconfigPath = path.join(process.cwd(), 'apps', 'web', 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  const now = new Date();
  fs.utimesSync(tsconfigPath, now, now);
  console.log('✅ tsconfig.json touched - TypeScript will reload');
}

// Create a temporary file to force module resolution refresh
const tempFile = path.join(process.cwd(), 'apps', 'web', 'src', '.ts-refresh.tmp');
fs.writeFileSync(tempFile, '// Temporary file to force TS refresh\nexport {};');
setTimeout(() => {
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
    console.log('✅ TypeScript module resolution refreshed');
  }
}, 1000);

console.log('🔄 TypeScript language server should restart automatically');
console.log('💡 If issues persist, use Ctrl+Shift+P → "TypeScript: Restart TS Server"');
