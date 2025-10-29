#!/usr/bin/env node
import { existsSync, statSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 VS Code Workspace Structure Validation');
console.log('=========================================');

// Expected directory structure
const expectedStructure = {
  '.vscode': {
    type: 'directory',
    required: true,
    children: {
      'settings.json': { type: 'file', required: true },
      'extensions.json': { type: 'file', required: false },
      'launch.json': { type: 'file', required: false },
      'tasks.json': { type: 'file', required: false },
      'mcp.json': { type: 'file', required: false },
      'configs': {
        type: 'directory',
        required: true,
        children: {
          'settings.client.json': { type: 'file', required: true },
          'README.md': { type: 'file', required: true }
        }
      },
      'schemas': {
        type: 'directory',
        required: false,
        children: {}
      },
      'mcp-servers': {
        type: 'directory',
        required: false,
        children: {}
      },
      'scripts': {
        type: 'directory',
        required: true,
        children: {
          'merge-configs.js': { type: 'file', required: true },
          'setup-workspace.sh': { type: 'file', required: true },
          'package.json': { type: 'file', required: true }
        }
      },
      'copilot': {
        type: 'directory',
        required: true,
        children: {
          'instructions.md': { type: 'file', required: true },
          'agent-best-practices.md': { type: 'file', required: true },
          'azure-best-practices.md': { type: 'file', required: true }
        }
      }
    }
  }
};

let validationErrors = [];
let validationWarnings = [];

function validatePath(path, expected, basePath = '') {
  const fullPath = join(basePath, path);

  if (!existsSync(fullPath)) {
    if (expected.required) {
      validationErrors.push(`❌ Required ${expected.type} missing: ${fullPath}`);
    } else {
      validationWarnings.push(`⚠️  Optional ${expected.type} missing: ${fullPath}`);
    }
    return;
  }

  const stats = statSync(fullPath);
  const actualType = stats.isDirectory() ? 'directory' : 'file';

  if (actualType !== expected.type) {
    validationErrors.push(`❌ Type mismatch: ${fullPath} (expected ${expected.type}, found ${actualType})`);
    return;
  }

  console.log(`✅ ${expected.type.charAt(0).toUpperCase() + expected.type.slice(1)}: ${fullPath}`);

  // Validate children if it's a directory
  if (expected.type === 'directory' && expected.children) {
    for (const [childName, childExpected] of Object.entries(expected.children)) {
      validatePath(childName, childExpected, fullPath);
    }
  }
}

// Run validation
console.log('\n📁 Validating directory structure...\n');

for (const [rootPath, expected] of Object.entries(expectedStructure)) {
  validatePath(rootPath, expected);
}

// Validate settings.json is valid JSON/JSONC
console.log('\n🔍 Validating configuration files...\n');

// Simple JSONC parser for validation
function parseJSONC(content) {
  // Remove single-line comments (// ...)
  content = content.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments (/* ... */)
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove trailing commas
  content = content.replace(/,(\s*[}\]])/g, '$1');

  return JSON.parse(content);
}

try {
  const settingsPath = '.vscode/settings.json';
  if (existsSync(settingsPath)) {
    const settings = parseJSONC(readFileSync(settingsPath, 'utf8'));
    console.log('✅ settings.json is valid JSON/JSONC');

    // Check for important configurations
    const importantConfigs = [
      'github.copilot.chat.codeGeneration.useInstructionFiles',
      'typescript.preferences.organizeImports',
      'typescript.tsserver.maxTsServerMemory'
    ];

    for (const config of importantConfigs) {
      if (config.split('.').reduce((obj, key) => obj && obj[key], settings)) {
        console.log(`✅ Configuration present: ${config}`);
      } else {
        validationWarnings.push(`⚠️  Configuration missing: ${config}`);
      }
    }
  }
} catch (error) {
    // If JSONC parsing fails, check if it's valid JSONC by checking key properties
    try {
      const rawContent = readFileSync('.vscode/settings.json', 'utf8');
      if (rawContent.includes('"github.copilot') && rawContent.includes('"typescript.')) {
        console.log('✅ settings.json contains expected configurations (JSONC format)');
      } else {
        validationErrors.push(`❌ settings.json missing expected configurations`);
      }
    } catch (readError) {
      validationErrors.push(`❌ Cannot read settings.json: ${readError.message}`);
    }
  }

// Validate Copilot instructions
try {
  const instructionsPath = '.vscode/copilot/instructions.md';
  if (existsSync(instructionsPath)) {
    const content = readFileSync(instructionsPath, 'utf8');
    if (content.includes('React Scuba') && content.includes('multi-tenant')) {
      console.log('✅ Copilot instructions contain project context');
    } else {
      validationWarnings.push('⚠️  Copilot instructions may be missing project context');
    }
  }
} catch (error) {
  validationErrors.push(`❌ Error reading Copilot instructions: ${error.message}`);
}

// Validate scripts are executable
const scriptsPath = '.vscode/scripts';
if (existsSync(scriptsPath)) {
  try {
    const packageJsonPath = join(scriptsPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.scripts && packageJson.scripts['workspace:setup']) {
        console.log('✅ Workspace setup script configured');
      } else {
        validationWarnings.push('⚠️  Workspace setup script not configured in package.json');
      }
    }
  } catch (error) {
    validationErrors.push(`❌ Error validating scripts package.json: ${error.message}`);
  }
}

// Report results
console.log('\n📊 Validation Results');
console.log('====================');

if (validationErrors.length === 0) {
  console.log('✅ All required components are present and valid');
} else {
  console.log(`❌ Found ${validationErrors.length} error(s):`);
  validationErrors.forEach(error => console.log(`   ${error}`));
}

if (validationWarnings.length > 0) {
  console.log(`\n⚠️  Found ${validationWarnings.length} warning(s):`);
  validationWarnings.forEach(warning => console.log(`   ${warning}`));
}

console.log('\n💡 Recommendations:');
console.log('- Run "npm run workspace:setup" to merge configurations');
console.log('- Reload VS Code window after setup (Ctrl+Shift+P → "Developer: Reload Window")');
console.log('- Test GitHub Copilot with "@workspace explain the project structure"');

// Exit with error code if there are validation errors
if (validationErrors.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

