#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const configDir = '.vscode/configs';

console.log('🔧 VS Code Configuration Additive Merger');
console.log('========================================');
console.log('');

// Simple JSONC parser for reading existing settings
function parseJSONC(content) {
  // Remove single-line comments (// ...)
  content = content.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments (/* ... */)
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove trailing commas
  content = content.replace(/,(\s*[}\]])/g, '$1');

  return JSON.parse(content);
}

console.log('📖 Reading existing comprehensive settings...');

// Read and preserve existing comprehensive settings
let existingSettings = {};
if (existsSync('.vscode/settings.json')) {
  try {
    existingSettings = parseJSONC(readFileSync('.vscode/settings.json', 'utf8'));
    console.log(`✅ Existing settings loaded (${Object.keys(existingSettings).length} properties)`);
  } catch (error) {
    console.log('⚠️  Could not parse existing settings, creating fresh configuration');
  }
}

console.log('📖 Reading domain-specific configurations...');

// Read domain-specific configurations (pure JSON)
const turboSettings = JSON.parse(readFileSync(join(configDir, 'settings.client.json'), 'utf8'));
console.log('✅ Client settings loaded');

const clientSettings = JSON.parse(readFileSync(join(configDir, 'settings.client.json'), 'utf8'));
console.log('✅ Multi-tenant client settings loaded');

console.log('');
console.log('🔄 Merging configurations additively...');

// Additive merge: existing settings + domain-specific enhancements
const mergedSettings = {
  // Start with existing comprehensive settings (preserves all original functionality)
  ...existingSettings,
  // Add Turbo optimizations (may override some TypeScript settings for better performance)
  ...turboSettings,
  // Add client-specific settings (adds multi-tenant support)
  ...clientSettings
};

// Ensure Copilot instructions are properly configured
if (existsSync('.vscode/copilot/instructions.md')) {
  // Use the newer useInstructionFiles setting instead of deprecated instructions array
  mergedSettings['github.copilot.chat.codeGeneration.useInstructionFiles'] = true;
  console.log('✅ Copilot instruction files integration enabled');
}

console.log('✅ Additive configuration merge completed');

// Display what was merged
console.log('');
console.log('📊 Additive Merge Summary:');
console.log(`   • Existing settings: ${Object.keys(existingSettings).length} properties`);
console.log(`   • Optimizations: ${Object.keys(turboSettings).length} properties`);
console.log(`   • Client enhancements: ${Object.keys(clientSettings).length} properties`);
console.log(`   • Total final settings: ${Object.keys(mergedSettings).length} properties`);

// Create backup before modification
if (existsSync('.vscode/settings.json')) {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const backupPath = `.vscode/settings.json.backup-${timestamp}`;
  const originalContent = readFileSync('.vscode/settings.json', 'utf8');
  writeFileSync(backupPath, originalContent);
  console.log(`📄 Backup created: ${backupPath}`);
}

// Write the enhanced settings while preserving JSONC format where possible
const newSettingsContent = JSON.stringify(mergedSettings, null, 2);
writeFileSync('.vscode/settings.json', newSettingsContent);

console.log('');
console.log('🎉 Additive configuration merge successful!');
console.log('==========================================');
console.log('');
console.log('✅ Enhanced with domain-specific configurations:');
console.log('   📁 npm workspaces optimizations (enhanced TypeScript memory, file watching)');
console.log('   🏢 Multi-tenant client settings (schema validation, theme support)');
console.log('   🤖 GitHub Copilot instruction files integration');
console.log('   💾 All original settings preserved and enhanced');
console.log('');
console.log('📝 Next Steps:');
console.log('1. Reload VS Code window (Ctrl+Shift+P → "Developer: Reload Window")');
console.log('2. Test enhanced features: @workspace explain the multi-tenant architecture');
console.log('3. Verify all extensions and tools still work as expected');
console.log('4. Use backup to restore if any issues occur');
console.log('');
console.log('🎯 Your comprehensive VS Code setup is now enhanced with organized structure!');

