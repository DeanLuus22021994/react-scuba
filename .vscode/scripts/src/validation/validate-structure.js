#!/usr/bin/env node

/**
 * @fileoverview Enterprise Workspace Structure Validator
 * @description Validates React Scuba workspace structure against enterprise standards
 * @author React Scuba Development Team
 * @version 1.0.0
 * @since 2025-10-29
 */

import { existsSync, statSync, readFileSync, readdirSync } from 'fs';
import { join, relative, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Workspace structure validator with comprehensive rule engine
 */
class WorkspaceValidator {
  constructor() {
    this.config = {
      logPrefix: '[VALIDATOR]',
      severity: {
        ERROR: 'ERROR',
        WARNING: 'WARNING',
        INFO: 'INFO',
        SUCCESS: 'SUCCESS'
      }
    };
    
    this.results = {
      errors: [],
      warnings: [],
      infos: [],
      successes: [],
      totalChecks: 0,
      passedChecks: 0
    };

    this.rules = this.initializeRules();
  }

  /**
   * Initialize validation rules based on React Scuba architecture
   */
  initializeRules() {
    return {
      // Core workspace structure
      coreFiles: [
        { path: 'package.json', type: 'file', required: true },
        { path: 'README.md', type: 'file', required: true },
        { path: 'docker-compose.yml', type: 'file', required: true },
        { path: '.gitignore', type: 'file', required: true },
        { path: 'react-scuba.code-workspace', type: 'file', required: true }
      ],

      // VS Code configuration
      vscodeConfig: [
        { path: '.vscode', type: 'directory', required: true },
        { path: '.vscode/settings.json', type: 'file', required: true },
        { path: '.vscode/tasks.json', type: 'file', required: true },
        { path: '.vscode/extensions.json', type: 'file', required: false },
        { path: '.vscode/scripts', type: 'directory', required: true }
      ],

      // Monorepo structure
      monorepoStructure: [
        { path: 'server', type: 'directory', required: true },
        { path: 'server/package.json', type: 'file', required: true },
        { path: 'server/apps', type: 'directory', required: true },
        { path: 'server/packages', type: 'directory', required: true },
        { path: 'server/clients', type: 'directory', required: true }
      ],

      // Applications
      applications: [
        { path: 'server/apps/web', type: 'directory', required: true },
        { path: 'server/apps/api', type: 'directory', required: true },
        { path: 'server/apps/content', type: 'directory', required: true },
        { path: 'server/apps/web/package.json', type: 'file', required: true },
        { path: 'server/apps/api/package.json', type: 'file', required: true },
        { path: 'server/apps/content/package.json', type: 'file', required: true }
      ],

      // Shared packages
      packages: [
        { path: 'server/packages/config', type: 'directory', required: true },
        { path: 'server/packages/types', type: 'directory', required: true },
        { path: 'server/packages/ui', type: 'directory', required: true },
        { path: 'server/packages/utils', type: 'directory', required: true }
      ],

      // Multi-tenant clients
      multiTenant: [
        { path: 'server/clients/_template', type: 'directory', required: true },
        { path: 'server/clients/_template/config.json', type: 'file', required: true }
      ],

      // Docker infrastructure
      dockerInfra: [
        { path: 'docker-compose-examples', type: 'directory', required: true },
        { path: 'docker-compose-examples/basic-stack', type: 'directory', required: false },
        { path: 'docker-compose-examples/cluster-example', type: 'directory', required: false }
      ],

      // Documentation
      documentation: [
        { path: 'docs', type: 'directory', required: true },
        { path: '.github', type: 'directory', required: true },
        { path: '.github/copilot-instructions.md', type: 'file', required: true }
      ]
    };
  }

  /**
   * Logging utilities with color coding and severity levels
   */
  log(level, message, details = null) {
    const colors = {
      ERROR: '\x1b[31m',
      WARNING: '\x1b[33m',
      INFO: '\x1b[36m',
      SUCCESS: '\x1b[32m',
      RESET: '\x1b[0m'
    };

    const color = colors[level] || colors.INFO;
    const prefix = `${color}${this.config.logPrefix} ${level}:${colors.RESET}`;
    
    console.log(`${prefix} ${message}`);
    if (details && process.env.VERBOSE === 'true') {
      console.log(`${' '.repeat(15)} ${details}`);
    }

    // Store results for summary
    this.results[`${level.toLowerCase()}s`].push({
      message,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Check if a path exists and matches expected type
   * @param {string} path - Path to check
   * @param {string} type - Expected type ('file' or 'directory')
   * @returns {boolean} Whether path exists and matches type
   */
  pathExists(path, type) {
    try {
      if (!existsSync(path)) {
        return false;
      }

      const stats = statSync(path);
      return type === 'file' ? stats.isFile() : stats.isDirectory();
    } catch (error) {
      this.log('ERROR', `Failed to check path: ${path}`, error.message);
      return false;
    }
  }

  /**
   * Validate package.json structure and dependencies
   * @param {string} packagePath - Path to package.json
   * @returns {Object} Validation results
   */
  validatePackageJson(packagePath) {
    const results = { valid: false, errors: [], info: [] };
    
    try {
      if (!this.pathExists(packagePath, 'file')) {
        results.errors.push('package.json not found');
        return results;
      }

      const content = readFileSync(packagePath, 'utf8');
      const pkg = JSON.parse(content);

      // Required fields
      const requiredFields = ['name', 'version'];
      for (const field of requiredFields) {
        if (!pkg[field]) {
          results.errors.push(`Missing required field: ${field}`);
        }
      }

      // Check for workspace configuration (root package.json)
      if (packagePath.endsWith('server/package.json')) {
        if (!pkg.workspaces) {
          results.errors.push('Root package.json missing workspaces configuration');
        } else {
          results.info.push(`Workspaces configured: ${pkg.workspaces.length} patterns`);
        }
      }

      // Check for modern Node.js version requirement
      if (pkg.engines && pkg.engines.node) {
        const nodeVersion = pkg.engines.node;
        if (!nodeVersion.includes('20') && !nodeVersion.includes('>=18')) {
          results.errors.push(`Node.js version should be 18+ or 20+, found: ${nodeVersion}`);
        } else {
          results.info.push(`Node.js version requirement: ${nodeVersion}`);
        }
      }

      results.valid = results.errors.length === 0;
      return results;
    } catch (error) {
      results.errors.push(`Failed to parse package.json: ${error.message}`);
      return results;
    }
  }

  /**
   * Validate VS Code configuration files
   */
  validateVSCodeConfig() {
    this.log('INFO', 'Validating VS Code configuration...');

    // Check settings.json
    const settingsPath = '.vscode/settings.json';
    if (this.pathExists(settingsPath, 'file')) {
      try {
        const content = readFileSync(settingsPath, 'utf8');
        // Basic JSONC parsing
        const cleaned = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        JSON.parse(cleaned);
        this.log('SUCCESS', 'VS Code settings.json is valid');
      } catch (error) {
        this.log('ERROR', 'VS Code settings.json has syntax errors', error.message);
      }
    }

    // Check tasks.json
    const tasksPath = '.vscode/tasks.json';
    if (this.pathExists(tasksPath, 'file')) {
      try {
        const content = readFileSync(tasksPath, 'utf8');
        const tasks = JSON.parse(content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''));
        
        if (tasks.tasks && Array.isArray(tasks.tasks)) {
          this.log('SUCCESS', `VS Code tasks.json is valid (${tasks.tasks.length} tasks)`);
        } else {
          this.log('WARNING', 'VS Code tasks.json missing tasks array');
        }
      } catch (error) {
        this.log('ERROR', 'VS Code tasks.json has syntax errors', error.message);
      }
    }
  }

  /**
   * Validate npm workspaces structure
   */
  validateWorkspaces() {
    this.log('INFO', 'Validating npm workspaces structure...');

    const rootPackage = this.validatePackageJson('server/package.json');
    if (!rootPackage.valid) {
      this.log('ERROR', 'Root package.json validation failed', rootPackage.errors.join(', '));
      return;
    }

    // Check workspace apps
    const appPaths = ['server/apps/web', 'server/apps/api', 'server/apps/content'];
    for (const appPath of appPaths) {
      if (this.pathExists(appPath, 'directory')) {
        const packageResult = this.validatePackageJson(join(appPath, 'package.json'));
        if (packageResult.valid) {
          this.log('SUCCESS', `Workspace app validated: ${relative('.', appPath)}`);
        } else {
          this.log('ERROR', `Workspace app invalid: ${relative('.', appPath)}`, packageResult.errors.join(', '));
        }
      }
    }

    // Check workspace packages
    const packagePaths = ['server/packages/config', 'server/packages/types', 'server/packages/ui', 'server/packages/utils'];
    for (const pkgPath of packagePaths) {
      if (this.pathExists(pkgPath, 'directory')) {
        const packageResult = this.validatePackageJson(join(pkgPath, 'package.json'));
        if (packageResult.valid) {
          this.log('SUCCESS', `Workspace package validated: ${relative('.', pkgPath)}`);
        } else {
          this.log('ERROR', `Workspace package invalid: ${relative('.', pkgPath)}`, packageResult.errors.join(', '));
        }
      }
    }
  }

  /**
   * Validate multi-tenant client configurations
   */
  validateMultiTenant() {
    this.log('INFO', 'Validating multi-tenant client configurations...');

    const clientsDir = 'server/clients';
    if (!this.pathExists(clientsDir, 'directory')) {
      this.log('ERROR', 'Clients directory not found');
      return;
    }

    try {
      const clients = readdirSync(clientsDir).filter(item => {
        const itemPath = join(clientsDir, item);
        return statSync(itemPath).isDirectory();
      });

      for (const client of clients) {
        const clientPath = join(clientsDir, client);
        const configPath = join(clientPath, 'config.json');
        
        if (this.pathExists(configPath, 'file')) {
          try {
            const config = JSON.parse(readFileSync(configPath, 'utf8'));
            const requiredFields = ['id', 'name', 'domain'];
            const missingFields = requiredFields.filter(field => !config[field]);
            
            if (missingFields.length === 0) {
              this.log('SUCCESS', `Client configuration valid: ${client}`);
            } else {
              this.log('ERROR', `Client configuration invalid: ${client}`, `Missing: ${missingFields.join(', ')}`);
            }
          } catch (error) {
            this.log('ERROR', `Client configuration parsing failed: ${client}`, error.message);
          }
        } else {
          this.log('WARNING', `Client missing config.json: ${client}`);
        }
      }
    } catch (error) {
      this.log('ERROR', 'Failed to read clients directory', error.message);
    }
  }

  /**
   * Validate individual rule group
   * @param {string} groupName - Name of the rule group
   * @param {Array} rules - Array of validation rules
   */
  validateRuleGroup(groupName, rules) {
    this.log('INFO', `Validating ${groupName}...`);
    
    for (const rule of rules) {
      this.results.totalChecks++;
      
      if (this.pathExists(rule.path, rule.type)) {
        this.results.passedChecks++;
        this.log('SUCCESS', `${rule.type} exists: ${rule.path}`);
      } else if (rule.required) {
        this.log('ERROR', `Required ${rule.type} missing: ${rule.path}`);
      } else {
        this.log('WARNING', `Optional ${rule.type} missing: ${rule.path}`);
      }
    }
  }

  /**
   * Generate comprehensive validation report
   */
  generateReport() {
    const passRate = ((this.results.passedChecks / this.results.totalChecks) * 100).toFixed(1);
    
    console.log('\\n' + '='.repeat(60));
    console.log('📋 WORKSPACE STRUCTURE VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`🎯 Pass Rate: ${passRate}% (${this.results.passedChecks}/${this.results.totalChecks})`);
    console.log(`✅ Successes: ${this.results.successes.length}`);
    console.log(`⚠️  Warnings: ${this.results.warnings.length}`);
    console.log(`❌ Errors: ${this.results.errors.length}`);
    console.log('='.repeat(60));

    if (this.results.errors.length > 0) {
      console.log('\\n🚨 CRITICAL ISSUES TO ADDRESS:');
      this.results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.message}`);
      });
    }

    if (this.results.warnings.length > 0) {
      console.log('\\n⚠️  RECOMMENDATIONS:');
      this.results.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning.message}`);
      });
    }

    console.log('\\n📝 NEXT STEPS:');
    if (this.results.errors.length > 0) {
      console.log('1. Address critical issues listed above');
      console.log('2. Ensure all required files and directories exist');
      console.log('3. Fix any configuration syntax errors');
    } else {
      console.log('1. All critical validations passed! ✅');
      console.log('2. Consider addressing warnings for optimal setup');
      console.log('3. Regular validation helps maintain code quality');
    }
    console.log('='.repeat(60) + '\\n');
  }

  /**
   * Main execution method
   */
  async execute() {
    try {
      console.log('🔍 ENTERPRISE WORKSPACE STRUCTURE VALIDATOR');
      console.log('===========================================\\n');

      // Execute all validation groups
      for (const [groupName, rules] of Object.entries(this.rules)) {
        this.validateRuleGroup(groupName, rules);
      }

      // Specialized validations
      this.validateVSCodeConfig();
      this.validateWorkspaces();
      this.validateMultiTenant();

      // Generate final report
      this.generateReport();

      // Exit with appropriate code
      const hasErrors = this.results.errors.length > 0;
      if (hasErrors) {
        this.log('ERROR', 'Validation completed with errors');
        process.exit(1);
      } else {
        this.log('SUCCESS', 'All validations passed successfully!');
        process.exit(0);
      }

    } catch (error) {
      this.log('ERROR', `Validation failed: ${error.message}`);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new WorkspaceValidator();
  validator.execute();
}

export default WorkspaceValidator;