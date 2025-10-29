#!/usr/bin/env node

/**
 * @fileoverview Enterprise Workspace Setup Utility
 * @description Initializes new React Scuba workspace configurations with enterprise standards
 * @author React Scuba Development Team
 * @version 1.0.0
 * @since 2025-10-29
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Workspace setup utility with comprehensive configuration management
 */
class WorkspaceSetup {
  constructor() {
    this.config = {
      logPrefix: '[SETUP]',
      templatesDir: join(__dirname, '..', 'templates'),
      backupDir: '.vscode/backups',
      setupSteps: [
        'environment',
        'vscode-config',
        'git-config',
        'npm-workspaces',
        'docker-config',
        'documentation'
      ]
    };

    this.state = {
      currentStep: 0,
      completedSteps: [],
      errors: [],
      warnings: [],
      created: [],
      modified: []
    };

    this.templates = this.initializeTemplates();
  }

  /**
   * Initialize configuration templates
   */
  initializeTemplates() {
    return {
      // VS Code Settings Template
      vscodeSettings: {
        "workbench.colorTheme": "Default Dark+",
        "editor.formatOnSave": true,
        "editor.codeActionsOnSave": {
          "source.fixAll": "explicit",
          "source.organizeImports": "explicit"
        },
        "files.associations": {
          "*.json": "jsonc"
        },
        "typescript.preferences.includePackageJsonAutoImports": "auto",
        "javascript.preferences.includePackageJsonAutoImports": "auto",
        "npm.enableScriptExplorer": true,
        "github.copilot.enable": {
          "*": true,
          "yaml": false,
          "plaintext": false
        },
        "github.copilot.chat.codeGeneration.useInstructionFiles": true
      },

      // VS Code Tasks Template
      vscodeTasks: {
        "version": "2.0.0",
        "tasks": [
          {
            "label": "npm: dev",
            "type": "npm",
            "script": "dev",
            "isBackground": true,
            "options": {
              "cwd": "${workspaceFolder}/server"
            },
            "group": "build",
            "runOptions": {
              "instanceLimit": 1
            }
          },
          {
            "label": "npm: build",
            "type": "npm",
            "script": "build",
            "group": {
              "kind": "build",
              "isDefault": true
            },
            "options": {
              "cwd": "${workspaceFolder}/server"
            }
          },
          {
            "label": "npm: test",
            "type": "npm",
            "script": "test",
            "group": {
              "kind": "test",
              "isDefault": true
            },
            "options": {
              "cwd": "${workspaceFolder}/server"
            }
          }
        ]
      },

      // VS Code Extensions Template
      vscodeExtensions: {
        "recommendations": [
          "ms-vscode.vscode-typescript-next",
          "bradlc.vscode-tailwindcss",
          "ms-vscode.vscode-json",
          "github.copilot",
          "github.copilot-chat",
          "ms-azuretools.vscode-docker",
          "ms-vscode.powershell"
        ]
      },

      // Package.json Scripts Template
      npmScripts: {
        "dev": "concurrently \"npm:dev:*\"",
        "dev:web": "cd apps/web && npm run dev",
        "dev:api": "cd apps/api && npm run dev",
        "build": "npm run build:packages && npm run build:apps",
        "build:packages": "npm run build --workspace=packages/*",
        "build:apps": "npm run build --workspace=apps/*",
        "test": "npm run test --workspaces --if-present",
        "test:coverage": "npm run test:coverage --workspaces --if-present",
        "lint": "npm run lint --workspaces --if-present",
        "lint:fix": "npm run lint:fix --workspaces --if-present",
        "format": "npm run format --workspaces --if-present",
        "format:check": "npm run format:check --workspaces --if-present",
        "clean": "npm run clean --workspaces --if-present",
        "clean:all": "npm run clean && rm -rf node_modules"
      },

      // Docker Compose Template
      dockerCompose: {
        "version": "3.8",
        "services": {
          "web": {
            "build": "./server",
            "ports": ["3000:3000"],
            "environment": {
              "NODE_ENV": "development"
            },
            "volumes": [
              "./server:/app",
              "/app/node_modules"
            ],
            "depends_on": ["api"]
          },
          "api": {
            "build": "./server",
            "ports": ["3001:3001"],
            "environment": {
              "NODE_ENV": "development",
              "DATABASE_URL": "postgresql://user:pass@db:5432/react_scuba"
            },
            "depends_on": ["db"]
          },
          "db": {
            "image": "postgres:17-alpine",
            "environment": {
              "POSTGRES_DB": "react_scuba",
              "POSTGRES_USER": "user",
              "POSTGRES_PASSWORD": "pass"
            },
            "volumes": ["postgres_data:/var/lib/postgresql/data"],
            "ports": ["5432:5432"]
          }
        },
        "volumes": {
          "postgres_data": {}
        }
      }
    };
  }

  /**
   * Logging utilities with consistent formatting
   */
  logInfo(message) {
    console.log(`${this.config.logPrefix} INFO: ${message}`);
  }

  logSuccess(message) {
    console.log(`\x1b[32m${this.config.logPrefix} SUCCESS: ${message}\x1b[0m`);
  }

  logWarning(message) {
    console.log(`\x1b[33m${this.config.logPrefix} WARN: ${message}\x1b[0m`);
    this.state.warnings.push(message);
  }

  logError(message) {
    console.error(`\x1b[31m${this.config.logPrefix} ERROR: ${message}\x1b[0m`);
    this.state.errors.push(message);
  }

  logVerbose(message) {
    if (process.env.VERBOSE === 'true') {
      console.log(`\x1b[36m${this.config.logPrefix} VERBOSE: ${message}\x1b[0m`);
    }
  }

  logStep(stepName) {
    console.log(`\\n🔧 Step ${this.state.currentStep + 1}/${this.config.setupSteps.length}: ${stepName}`);
    console.log('-'.repeat(50));
  }

  /**
   * Ensure directory exists, create if necessary
   * @param {string} dirPath - Directory path to ensure
   */
  ensureDirectory(dirPath) {
    try {
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
        this.logVerbose(`Created directory: ${dirPath}`);
        this.state.created.push(dirPath);
      }
      return true;
    } catch (error) {
      this.logError(`Failed to create directory ${dirPath}: ${error.message}`);
      return false;
    }
  }

  /**
   * Safely write JSON file with backup
   * @param {string} filePath - Path to write file
   * @param {Object} content - JSON content
   * @param {boolean} backup - Whether to create backup
   */
  writeJSONFile(filePath, content, backup = true) {
    try {
      // Create backup if file exists and backup requested
      if (backup && existsSync(filePath)) {
        this.ensureDirectory(this.config.backupDir);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const backupPath = join(this.config.backupDir, `${dirname(filePath).replace(/[\/\\\\]/g, '-')}-${timestamp}.json`);
        copyFileSync(filePath, backupPath);
        this.logVerbose(`Backup created: ${backupPath}`);
      }

      // Ensure parent directory exists
      this.ensureDirectory(dirname(filePath));

      // Write file with proper formatting
      const jsonContent = JSON.stringify(content, null, 2);
      writeFileSync(filePath, jsonContent);

      if (existsSync(filePath)) {
        this.logSuccess(`Configuration written: ${filePath}`);
        this.state.created.push(filePath);
      } else {
        this.state.modified.push(filePath);
      }

      return true;
    } catch (error) {
      this.logError(`Failed to write ${filePath}: ${error.message}`);
      return false;
    }
  }

  /**
   * Setup development environment configuration
   */
  setupEnvironment() {
    this.logStep('Environment Configuration');

    try {
      // Create .env template if it doesn't exist
      const envPath = '.env.example';
      if (!existsSync(envPath)) {
        const envContent = [
          '# React Scuba Environment Configuration',
          '# Copy to .env and customize for your environment',
          '',
          '# Application Configuration',
          'NODE_ENV=development',
          'PORT=3000',
          'API_PORT=3001',
          '',
          '# Database Configuration',
          'DATABASE_URL=postgresql://user:pass@localhost:5432/react_scuba',
          'DATABASE_HOST=localhost',
          'DATABASE_PORT=5432',
          'DATABASE_NAME=react_scuba',
          'DATABASE_USER=user',
          'DATABASE_PASSWORD=pass',
          '',
          '# Client Configuration',
          'DEFAULT_CLIENT_ID=ocean-spirit-mauritius',
          'CLIENT_DOMAIN_MAPPING=true',
          '',
          '# Security',
          'JWT_SECRET=your-jwt-secret-here',
          'SESSION_SECRET=your-session-secret-here',
          '',
          '# Development',
          'DEBUG=react-scuba:*',
          'VERBOSE=false'
        ].join('\\n');

        writeFileSync(envPath, envContent);
        this.logSuccess('Environment template created');
      }

      // Create .gitignore additions if needed
      const gitignorePath = '.gitignore';
      if (existsSync(gitignorePath)) {
        const content = readFileSync(gitignorePath, 'utf8');
        const additions = [
          '# Environment variables',
          '.env',
          '.env.local',
          '.env.*.local',
          '',
          '# VS Code backups',
          '.vscode/backups/',
          '',
          '# Coverage reports',
          'coverage/',
          '*.lcov',
          '',
          '# Build artifacts',
          'dist/',
          'build/',
          '.turbo/'
        ];

        let needsUpdate = false;
        for (const addition of additions) {
          if (addition && !content.includes(addition)) {
            needsUpdate = true;
            break;
          }
        }

        if (needsUpdate) {
          const updatedContent = content + '\\n' + additions.join('\\n') + '\\n';
          writeFileSync(gitignorePath, updatedContent);
          this.logSuccess('Updated .gitignore with additional patterns');
        }
      }

      this.state.completedSteps.push('environment');
      return true;
    } catch (error) {
      this.logError(`Environment setup failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Setup VS Code configuration
   */
  setupVSCodeConfig() {
    this.logStep('VS Code Configuration');

    try {
      // Ensure .vscode directory exists
      this.ensureDirectory('.vscode');

      // Setup settings.json
      const settingsPath = '.vscode/settings.json';
      let existingSettings = {};

      if (existsSync(settingsPath)) {
        try {
          const content = readFileSync(settingsPath, 'utf8');
          // Basic JSONC parsing
          const cleaned = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
          existingSettings = JSON.parse(cleaned);
        } catch (error) {
          this.logWarning(`Could not parse existing settings.json: ${error.message}`);
        }
      }

      const mergedSettings = { ...this.templates.vscodeSettings, ...existingSettings };
      this.writeJSONFile(settingsPath, mergedSettings);

      // Setup tasks.json
      const tasksPath = '.vscode/tasks.json';
      this.writeJSONFile(tasksPath, this.templates.vscodeTasks);

      // Setup extensions.json
      const extensionsPath = '.vscode/extensions.json';
      this.writeJSONFile(extensionsPath, this.templates.vscodeExtensions);

      // Setup launch.json for debugging
      const launchPath = '.vscode/launch.json';
      const launchConfig = {
        "version": "0.2.0",
        "configurations": [
          {
            "name": "Launch Web App",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/server/apps/web/src/index.jsx",
            "env": {
              "NODE_ENV": "development"
            },
            "console": "integratedTerminal"
          },
          {
            "name": "Launch API Server",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/server/apps/api/src/index.js",
            "env": {
              "NODE_ENV": "development"
            },
            "console": "integratedTerminal"
          }
        ]
      };
      this.writeJSONFile(launchPath, launchConfig);

      this.state.completedSteps.push('vscode-config');
      return true;
    } catch (error) {
      this.logError(`VS Code configuration failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Setup Git configuration
   */
  setupGitConfig() {
    this.logStep('Git Configuration');

    try {
      // Setup Git hooks directory
      this.ensureDirectory('.githooks');

      // Create pre-commit hook
      const preCommitPath = '.githooks/pre-commit';
      const preCommitContent = [
        '#!/bin/sh',
        '# Pre-commit hook for React Scuba',
        '',
        'echo "Running pre-commit checks..."',
        '',
        '# Run linting',
        'npm run lint --silent',
        'if [ $? -ne 0 ]; then',
        '  echo "❌ Linting failed. Please fix errors and try again."',
        '  exit 1',
        'fi',
        '',
        '# Run tests',
        'npm run test --silent',
        'if [ $? -ne 0 ]; then',
        '  echo "❌ Tests failed. Please fix tests and try again."',
        '  exit 1',
        'fi',
        '',
        'echo "✅ Pre-commit checks passed!"',
        'exit 0'
      ].join('\\n');

      writeFileSync(preCommitPath, preCommitContent);

      // Make hook executable (Unix systems)
      try {
        execSync(`chmod +x ${preCommitPath}`, { stdio: 'ignore' });
      } catch (error) {
        this.logVerbose('Could not make pre-commit hook executable (Windows system)');
      }

      // Configure Git to use hooks directory
      try {
        execSync('git config core.hooksPath .githooks', { stdio: 'ignore' });
        this.logSuccess('Git hooks configured');
      } catch (error) {
        this.logWarning('Could not configure Git hooks directory');
      }

      this.state.completedSteps.push('git-config');
      return true;
    } catch (error) {
      this.logError(`Git configuration failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Setup npm workspaces configuration
   */
  setupNpmWorkspaces() {
    this.logStep('NPM Workspaces Configuration');

    try {
      const serverPackagePath = 'server/package.json';

      if (!existsSync(serverPackagePath)) {
        this.logError('Server package.json not found. Cannot configure workspaces.');
        return false;
      }

      const pkg = JSON.parse(readFileSync(serverPackagePath, 'utf8'));

      // Merge npm scripts
      pkg.scripts = { ...pkg.scripts, ...this.templates.npmScripts };

      // Ensure workspaces are configured
      if (!pkg.workspaces) {
        pkg.workspaces = [
          "apps/*",
          "packages/*"
        ];
      }

      // Add development dependencies if missing
      const devDeps = {
        "concurrently": "^9.1.0",
        "cross-env": "^7.0.3"
      };

      pkg.devDependencies = { ...pkg.devDependencies, ...devDeps };

      this.writeJSONFile(serverPackagePath, pkg);
      this.logSuccess('NPM workspaces configuration updated');

      this.state.completedSteps.push('npm-workspaces');
      return true;
    } catch (error) {
      this.logError(`NPM workspaces setup failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Setup Docker configuration
   */
  setupDockerConfig() {
    this.logStep('Docker Configuration');

    try {
      // Create docker-compose.yml if it doesn't exist
      const dockerComposePath = 'docker-compose.yml';
      if (!existsSync(dockerComposePath)) {
        const yamlContent = [
          'version: "3.8"',
          'services:',
          '  web:',
          '    build: ./server',
          '    ports:',
          '      - "3000:3000"',
          '    environment:',
          '      NODE_ENV: development',
          '    volumes:',
          '      - ./server:/app',
          '      - /app/node_modules',
          '    depends_on:',
          '      - api',
          '',
          '  api:',
          '    build: ./server',
          '    ports:',
          '      - "3001:3001"',
          '    environment:',
          '      NODE_ENV: development',
          '      DATABASE_URL: postgresql://user:pass@db:5432/react_scuba',
          '    depends_on:',
          '      - db',
          '',
          '  db:',
          '    image: postgres:17-alpine',
          '    environment:',
          '      POSTGRES_DB: react_scuba',
          '      POSTGRES_USER: user',
          '      POSTGRES_PASSWORD: pass',
          '    volumes:',
          '      - postgres_data:/var/lib/postgresql/data',
          '    ports:',
          '      - "5432:5432"',
          '',
          'volumes:',
          '  postgres_data:'
        ].join('\\n');

        writeFileSync(dockerComposePath, yamlContent);
        this.logSuccess('Docker Compose configuration created');
      }

      // Note: Dockerfiles are managed in .devcontainer/infrastructure/ cluster structure
      // No standalone dockerfiles should exist outside the cluster architecture

      this.state.completedSteps.push('docker-config');
      return true;
    } catch (error) {
      this.logError(`Docker configuration failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Setup documentation
   */
  setupDocumentation() {
    this.logStep('Documentation Setup');

    try {
      // Ensure docs directory exists
      this.ensureDirectory('docs');

      // Create README.md template if it doesn't exist
      const readmePath = 'README.md';
      if (!existsSync(readmePath)) {
        const readmeContent = [
          '# React Scuba - Multi-Tenant Dive Shop Platform',
          '',
          'A modern, enterprise-grade dive shop management platform built with React 19 and a comprehensive monorepo architecture.',
          '',
          '## Quick Start',
          '',
          '```bash',
          '# Install dependencies',
          'npm install',
          '',
          '# Start development environment',
          'npm run dev',
          '',
          '# Run tests',
          'npm test',
          '',
          '# Build for production',
          'npm run build',
          '```',
          '',
          '## Architecture',
          '',
          '- **Frontend**: React 19 + Vite 7 + TypeScript',
          '- **Backend**: Express.js 5 + PostgreSQL 17',
          '- **Monorepo**: NPM Workspaces',
          '- **Multi-tenant**: Client-specific configurations',
          '',
          '## Development',
          '',
          'See [Development Guide](docs/DEVELOPMENT.md) for detailed setup instructions.',
          '',
          '## Contributing',
          '',
          '1. Follow the established code patterns',
          '2. Ensure all tests pass',
          '3. Update documentation as needed',
          '4. Submit pull requests for review'
        ].join('\\n');

        writeFileSync(readmePath, readmeContent);
        this.logSuccess('README.md created');
      }

      // Create development documentation
      const devDocsPath = 'docs/DEVELOPMENT.md';
      if (!existsSync(devDocsPath)) {
        const devDocsContent = [
          '# Development Guide',
          '',
          '## Prerequisites',
          '',
          '- Node.js 20+',
          '- npm 10+',
          '- Docker (for local services)',
          '- VS Code (recommended)',
          '',
          '## Setup',
          '',
          '1. Clone the repository',
          '2. Run `npm install` to install dependencies',
          '3. Copy `.env.example` to `.env` and configure',
          '4. Start development with `npm run dev`',
          '',
          '## Project Structure',
          '',
          '```',
          'server/',
          '├── apps/           # Applications',
          '│   ├── web/        # React frontend',
          '│   ├── api/        # Express backend',
          '│   └── content/    # Content management',
          '├── packages/       # Shared packages',
          '│   ├── config/     # Build configurations',
          '│   ├── types/      # TypeScript types',
          '│   ├── ui/         # UI components',
          '│   └── utils/      # Utilities',
          '└── clients/        # Multi-tenant configs',
          '    ├── _template/',
          '    └── [client-id]/',
          '```',
          '',
          '## Available Scripts',
          '',
          '- `npm run dev` - Start all development servers',
          '- `npm run build` - Build all packages and apps',
          '- `npm test` - Run all tests',
          '- `npm run lint` - Lint all code',
          '- `npm run format` - Format all code',
          '',
          '## Testing',
          '',
          '- Unit tests: Vitest',
          '- E2E tests: Playwright',
          '- Coverage: `npm run test:coverage`'
        ].join('\\n');

        writeFileSync(devDocsPath, devDocsContent);
        this.logSuccess('Development documentation created');
      }

      this.state.completedSteps.push('documentation');
      return true;
    } catch (error) {
      this.logError(`Documentation setup failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Generate setup completion report
   */
  generateReport() {
    console.log('\\n' + '='.repeat(60));
    console.log('🎉 WORKSPACE SETUP COMPLETION REPORT');
    console.log('='.repeat(60));

    console.log(`✅ Completed Steps: ${this.state.completedSteps.length}/${this.config.setupSteps.length}`);
    console.log(`📄 Files Created: ${this.state.created.length}`);
    console.log(`📝 Files Modified: ${this.state.modified.length}`);
    console.log(`⚠️  Warnings: ${this.state.warnings.length}`);
    console.log(`❌ Errors: ${this.state.errors.length}`);

    if (this.state.completedSteps.length > 0) {
      console.log('\\n✅ COMPLETED STEPS:');
      this.state.completedSteps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
      });
    }

    if (this.state.warnings.length > 0) {
      console.log('\\n⚠️  WARNINGS:');
      this.state.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
    }

    if (this.state.errors.length > 0) {
      console.log('\\n❌ ERRORS:');
      this.state.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    console.log('\\n📝 NEXT STEPS:');
    if (this.state.errors.length === 0) {
      console.log('1. Reload VS Code window for new configurations');
      console.log('2. Install recommended extensions');
      console.log('3. Run `npm install` to install dependencies');
      console.log('4. Start development with `npm run dev`');
      console.log('5. Review and customize configurations as needed');
    } else {
      console.log('1. Address errors listed above');
      console.log('2. Re-run setup after fixing issues');
      console.log('3. Check file permissions and dependencies');
    }
    console.log('='.repeat(60) + '\\n');
  }

  /**
   * Main execution method
   */
  async execute() {
    try {
      console.log('🏗️  ENTERPRISE WORKSPACE SETUP UTILITY');
      console.log('=====================================\\n');

      this.logInfo('Initializing React Scuba workspace configuration...');

      // Execute setup steps
      const setupMethods = [
        this.setupEnvironment,
        this.setupVSCodeConfig,
        this.setupGitConfig,
        this.setupNpmWorkspaces,
        this.setupDockerConfig,
        this.setupDocumentation
      ];

      for (let i = 0; i < setupMethods.length; i++) {
        this.state.currentStep = i;
        const success = setupMethods[i].call(this);

        if (!success && this.config.setupSteps[i] === 'required') {
          this.logError(`Required setup step failed: ${this.config.setupSteps[i]}`);
          break;
        }
      }

      // Generate final report
      this.generateReport();

      // Exit with appropriate code
      if (this.state.errors.length > 0) {
        this.logError('Setup completed with errors');
        process.exit(1);
      } else {
        this.logSuccess('Workspace setup completed successfully!');
        process.exit(0);
      }

    } catch (error) {
      this.logError(`Setup failed: ${error.message}`);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new WorkspaceSetup();
  setup.execute();
}

export default WorkspaceSetup;
