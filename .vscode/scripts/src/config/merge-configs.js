#!/usr/bin/env node

/**
 * @fileoverview Enterprise VS Code Configuration Merger
 * @description Intelligently merges domain-specific VS Code configurations while preserving existing settings
 * @author React Scuba Development Team
 * @version 1.0.0
 * @since 2025-10-29
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Configuration merger class with enterprise-grade error handling and logging
 */
class ConfigurationMerger {
  constructor() {
    this.config = {
      configDir: '.vscode/configs',
      settingsPath: '.vscode/settings.json',
      backupDir: '.vscode/backups',
      logPrefix: '[CONFIG]'
    };
    
    this.stats = {
      existingProps: 0,
      mergedProps: 0,
      totalProps: 0,
      backupsCreated: 0
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
  }

  logError(message) {
    console.error(`\x1b[31m${this.config.logPrefix} ERROR: ${message}\x1b[0m`);
  }

  logVerbose(message) {
    if (process.env.VERBOSE === 'true') {
      console.log(`\x1b[36m${this.config.logPrefix} VERBOSE: ${message}\x1b[0m`);
    }
  }

  /**
   * Enhanced JSONC parser with better error handling
   * @param {string} content - JSONC content to parse
   * @returns {Object} Parsed JSON object
   */
  parseJSONC(content) {
    try {
      // Remove single-line comments
      let cleaned = content.replace(/\/\/.*$/gm, '');
      // Remove multi-line comments
      cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove trailing commas
      cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
      
      return JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`JSONC parsing failed: ${error.message}`);
    }
  }

  /**
   * Create backup of existing settings with timestamp
   * @param {string} originalPath - Path to original file
   * @returns {string} Backup file path
   */
  createBackup(originalPath) {
    try {
      if (!existsSync(originalPath)) {
        this.logVerbose(`No existing file to backup: ${originalPath}`);
        return null;
      }

      // Ensure backup directory exists
      if (!existsSync(this.config.backupDir)) {
        mkdirSync(this.config.backupDir, { recursive: true });
        this.logVerbose(`Created backup directory: ${this.config.backupDir}`);
      }

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const backupPath = join(this.config.backupDir, `settings-${timestamp}.json`);
      
      const originalContent = readFileSync(originalPath, 'utf8');
      writeFileSync(backupPath, originalContent);
      
      this.stats.backupsCreated++;
      this.logInfo(`Backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      this.logError(`Backup creation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Load existing settings with enhanced error handling
   * @returns {Object} Existing settings object
   */
  loadExistingSettings() {
    try {
      if (!existsSync(this.config.settingsPath)) {
        this.logInfo('No existing settings.json found, starting with empty configuration');
        return {};
      }

      const content = readFileSync(this.config.settingsPath, 'utf8');
      const settings = this.parseJSONC(content);
      
      this.stats.existingProps = Object.keys(settings).length;
      this.logSuccess(`Loaded existing settings (${this.stats.existingProps} properties)`);
      
      return settings;
    } catch (error) {
      this.logWarning(`Could not parse existing settings: ${error.message}`);
      this.logInfo('Starting with empty configuration');
      return {};
    }
  }

  /**
   * Load domain-specific configurations
   * @returns {Array<Object>} Array of configuration objects
   */
  loadDomainConfigs() {
    const configs = [];
    const configFiles = [
      'settings.client.json'
    ];

    try {
      for (const configFile of configFiles) {
        const configPath = join(this.config.configDir, configFile);
        
        if (!existsSync(configPath)) {
          this.logWarning(`Domain config not found: ${configPath}`);
          continue;
        }

        const content = readFileSync(configPath, 'utf8');
        const config = JSON.parse(content); // Domain configs should be pure JSON
        
        configs.push({
          name: configFile,
          config: config,
          properties: Object.keys(config).length
        });
        
        this.logSuccess(`Loaded domain config: ${configFile} (${Object.keys(config).length} properties)`);
      }
    } catch (error) {
      this.logError(`Failed to load domain configs: ${error.message}`);
      throw error;
    }

    return configs;
  }

  /**
   * Intelligently merge configurations with conflict resolution
   * @param {Object} existing - Existing settings
   * @param {Array<Object>} domainConfigs - Domain-specific configurations
   * @returns {Object} Merged configuration
   */
  mergeConfigurations(existing, domainConfigs) {
    try {
      let merged = { ...existing };
      let mergedCount = 0;

      for (const { name, config, properties } of domainConfigs) {
        this.logVerbose(`Merging configuration: ${name}`);
        
        for (const [key, value] of Object.entries(config)) {
          if (key in merged && merged[key] !== value) {
            this.logVerbose(`Overriding setting: ${key}`);
          }
          merged[key] = value;
          mergedCount++;
        }
        
        this.logInfo(`Merged ${properties} properties from ${name}`);
      }

      // Add Copilot instruction files integration if available
      if (existsSync('.vscode/copilot/instructions.md')) {
        merged['github.copilot.chat.codeGeneration.useInstructionFiles'] = true;
        mergedCount++;
        this.logInfo('Enabled Copilot instruction files integration');
      }

      this.stats.mergedProps = mergedCount;
      this.stats.totalProps = Object.keys(merged).length;
      
      return merged;
    } catch (error) {
      this.logError(`Configuration merge failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Write merged configuration to file
   * @param {Object} mergedConfig - Final merged configuration
   */
  writeMergedConfig(mergedConfig) {
    try {
      const configContent = JSON.stringify(mergedConfig, null, 2);
      writeFileSync(this.config.settingsPath, configContent);
      this.logSuccess(`Configuration written to: ${this.config.settingsPath}`);
    } catch (error) {
      this.logError(`Failed to write configuration: ${error.message}`);
      throw error;
    }
  }

  /**
   * Display comprehensive merge statistics
   */
  displayStats() {
    console.log('\\n' + '='.repeat(50));
    console.log('📊 CONFIGURATION MERGE SUMMARY');
    console.log('='.repeat(50));
    console.log(`   📄 Existing properties: ${this.stats.existingProps}`);
    console.log(`   🔄 Properties merged: ${this.stats.mergedProps}`);
    console.log(`   📋 Total final properties: ${this.stats.totalProps}`);
    console.log(`   💾 Backups created: ${this.stats.backupsCreated}`);
    console.log('='.repeat(50));
  }

  /**
   * Main execution method
   */
  async execute() {
    try {
      console.log('🔧 ENTERPRISE VS CODE CONFIGURATION MERGER');
      console.log('==========================================\\n');

      // Step 1: Create backup
      this.logInfo('Creating backup of existing configuration...');
      this.createBackup(this.config.settingsPath);

      // Step 2: Load existing settings
      this.logInfo('Loading existing settings...');
      const existingSettings = this.loadExistingSettings();

      // Step 3: Load domain configurations
      this.logInfo('Loading domain-specific configurations...');
      const domainConfigs = this.loadDomainConfigs();

      if (domainConfigs.length === 0) {
        this.logWarning('No domain configurations found to merge');
        return;
      }

      // Step 4: Merge configurations
      this.logInfo('Merging configurations...');
      const mergedConfig = this.mergeConfigurations(existingSettings, domainConfigs);

      // Step 5: Write final configuration
      this.logInfo('Writing merged configuration...');
      this.writeMergedConfig(mergedConfig);

      // Step 6: Display results
      this.displayStats();

      this.logSuccess('Configuration merge completed successfully!');
      
      // Step 7: Next steps guidance
      console.log('\\n📝 NEXT STEPS:');
      console.log('1. Reload VS Code window (Ctrl+Shift+P → \"Developer: Reload Window\")');
      console.log('2. Test enhanced features with @workspace commands');
      console.log('3. Verify all extensions work as expected');
      console.log('4. Use backup to restore if any issues occur\\n');

    } catch (error) {
      this.logError(`Configuration merge failed: ${error.message}`);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const merger = new ConfigurationMerger();
  merger.execute();
}

export default ConfigurationMerger;