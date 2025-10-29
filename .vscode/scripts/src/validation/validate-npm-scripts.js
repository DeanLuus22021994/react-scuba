#!/usr/bin/env node

/**
 * @fileoverview Enterprise NPM Scripts Validator
 * @description Validates npm scripts across the React Scuba monorepo for consistency and best practices
 * @author React Scuba Development Team
 * @version 1.0.0
 * @since 2025-10-29
 */

import { readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { glob } from 'glob';

/**
 * NPM Scripts validator with enterprise-grade analysis
 */
class NPMScriptsValidator {
  constructor() {
    this.config = {
      logPrefix: '[NPM-VALIDATOR]',
      workspaceRoot: 'server',
      standardScripts: {
        // Standard scripts that should exist in most packages
        dev: { required: false, pattern: /^(vite|webpack-dev-server|nodemon|ts-node-dev)/ },
        build: { required: true, pattern: /^(vite build|webpack|tsc|rollup)/ },
        test: { required: true, pattern: /^(vitest|jest|playwright|mocha)/ },
        lint: { required: false, pattern: /^(eslint|biome|ruff)/ },
        format: { required: false, pattern: /^(prettier|biome format|ruff format)/ }
      }
    };
    
    this.results = {
      packages: [],
      issues: [],
      recommendations: [],
      statistics: {
        totalPackages: 0,
        scriptsAnalyzed: 0,
        issuesFound: 0,
        consistencyScore: 0
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
   * Find all package.json files in the workspace
   * @returns {Array<string>} Array of package.json file paths
   */
  findPackageFiles() {
    try {
      const patterns = [
        'package.json',                    // Root
        'server/package.json',            // Server root
        'server/apps/*/package.json',     // Applications
        'server/packages/*/package.json', // Shared packages
        '.vscode/scripts/package.json'    // Scripts package
      ];

      const packageFiles = [];
      
      for (const pattern of patterns) {
        try {
          const matches = glob.sync(pattern);
          packageFiles.push(...matches);
        } catch (error) {
          this.logVerbose(`Pattern "${pattern}" yielded no results: ${error.message}`);
        }
      }

      return [...new Set(packageFiles)]; // Remove duplicates
    } catch (error) {
      this.logError(`Failed to find package files: ${error.message}`);
      return [];
    }
  }

  /**
   * Parse and analyze a package.json file
   * @param {string} packagePath - Path to package.json
   * @returns {Object} Package analysis results
   */
  analyzePackage(packagePath) {
    const analysis = {
      path: packagePath,
      name: '',
      version: '',
      scripts: {},
      dependencies: {},
      devDependencies: {},
      issues: [],
      recommendations: [],
      score: 100
    };

    try {
      if (!existsSync(packagePath)) {
        analysis.issues.push(`Package file not found: ${packagePath}`);
        analysis.score = 0;
        return analysis;
      }

      const content = readFileSync(packagePath, 'utf8');
      const pkg = JSON.parse(content);

      analysis.name = pkg.name || 'unnamed';
      analysis.version = pkg.version || 'unversioned';
      analysis.scripts = pkg.scripts || {};
      analysis.dependencies = pkg.dependencies || {};
      analysis.devDependencies = pkg.devDependencies || {};

      // Validate basic package structure
      this.validatePackageStructure(pkg, analysis);
      
      // Analyze npm scripts
      this.analyzeScripts(analysis);
      
      // Check dependency consistency
      this.validateDependencies(analysis);

      this.logVerbose(`Analyzed package: ${analysis.name} (${Object.keys(analysis.scripts).length} scripts)`);
      
    } catch (error) {
      analysis.issues.push(`Failed to parse package.json: ${error.message}`);
      analysis.score = 0;
      this.logError(`Package analysis failed for ${packagePath}: ${error.message}`);
    }

    return analysis;
  }

  /**
   * Validate basic package.json structure
   * @param {Object} pkg - Parsed package.json
   * @param {Object} analysis - Analysis results object
   */
  validatePackageStructure(pkg, analysis) {
    // Required fields
    const requiredFields = ['name', 'version'];
    for (const field of requiredFields) {
      if (!pkg[field]) {
        analysis.issues.push(`Missing required field: ${field}`);
        analysis.score -= 10;
      }
    }

    // Check for proper naming convention
    if (pkg.name && !pkg.name.match(/^(@[\w-]+\/)?[\w-]+$/)) {
      analysis.issues.push(`Package name doesn't follow naming conventions: ${pkg.name}`);
      analysis.score -= 5;
    }

    // Validate version format
    if (pkg.version && !pkg.version.match(/^\d+\.\d+\.\d+/)) {
      analysis.issues.push(`Version doesn't follow semver format: ${pkg.version}`);
      analysis.score -= 5;
    }

    // Check for description
    if (!pkg.description) {
      analysis.recommendations.push('Add a description field for better package documentation');
      analysis.score -= 2;
    }

    // Modern Node.js version check
    if (pkg.engines?.node) {
      const nodeVersion = pkg.engines.node;
      if (!nodeVersion.includes('20') && !nodeVersion.includes('>=18')) {
        analysis.recommendations.push(`Consider updating Node.js version requirement: ${nodeVersion}`);
        analysis.score -= 3;
      }
    }
  }

  /**
   * Analyze npm scripts for best practices and consistency
   * @param {Object} analysis - Analysis results object
   */
  analyzeScripts(analysis) {
    const scripts = analysis.scripts;
    
    // Check for standard scripts
    for (const [scriptName, config] of Object.entries(this.config.standardScripts)) {
      if (config.required && !scripts[scriptName]) {
        analysis.issues.push(`Missing required script: ${scriptName}`);
        analysis.score -= 8;
      }
      
      if (scripts[scriptName] && !config.pattern.test(scripts[scriptName])) {
        analysis.recommendations.push(`Script "${scriptName}" may not follow best practices: ${scripts[scriptName]}`);
        analysis.score -= 2;
      }
    }

    // Check for script naming consistency
    for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
      // Check for deprecated patterns
      if (scriptCommand.includes('node_modules/.bin/')) {
        analysis.recommendations.push(`Script "${scriptName}" uses deprecated node_modules/.bin/ path`);
        analysis.score -= 1;
      }

      // Check for security issues
      if (scriptCommand.includes('sudo') || scriptCommand.includes('rm -rf /')) {
        analysis.issues.push(`Script "${scriptName}" contains potentially dangerous commands`);
        analysis.score -= 15;
      }

      // Check for proper parallel execution
      if (scriptName.includes('&&') && !scriptName.includes('concurrently')) {
        analysis.recommendations.push(`Consider using 'concurrently' for parallel script execution in "${scriptName}"`);
        analysis.score -= 1;
      }
    }

    // Specific checks for React Scuba patterns
    this.validateReactScubaPatterns(analysis);
  }

  /**
   * Validate React Scuba specific script patterns
   * @param {Object} analysis - Analysis results object
   */
  validateReactScubaPatterns(analysis) {
    const { scripts, name } = analysis;

    // Web app specific validations
    if (name.includes('web') || analysis.path.includes('apps/web')) {
      if (scripts.dev && !scripts.dev.includes('vite')) {
        analysis.recommendations.push('Web app should use Vite for development server');
        analysis.score -= 3;
      }
      
      if (scripts.build && !scripts.build.includes('vite build')) {
        analysis.recommendations.push('Web app should use "vite build" for production builds');
        analysis.score -= 3;
      }
    }

    // API specific validations
    if (name.includes('api') || analysis.path.includes('apps/api')) {
      if (scripts.dev && !scripts.dev.includes('nodemon')) {
        analysis.recommendations.push('API should use nodemon for development');
        analysis.score -= 2;
      }
    }

    // Package specific validations
    if (analysis.path.includes('packages/')) {
      if (!scripts.build) {
        analysis.recommendations.push('Shared packages should have build scripts');
        analysis.score -= 5;
      }
    }

    // Root package validations
    if (analysis.path === 'server/package.json') {
      if (!scripts.dev || !scripts.dev.includes('concurrently')) {
        analysis.recommendations.push('Root package should orchestrate workspace development with concurrently');
        analysis.score -= 5;
      }
      
      if (!scripts.build) {
        analysis.issues.push('Root package missing build script for workspace coordination');
        analysis.score -= 8;
      }
    }
  }

  /**
   * Validate dependency consistency across workspace
   * @param {Object} analysis - Analysis results object
   */
  validateDependencies(analysis) {
    const allDeps = { ...analysis.dependencies, ...analysis.devDependencies };
    
    // Check for common dependency issues
    const problematicDeps = {
      'node-sass': 'Consider migrating to dart-sass (sass package)',
      'babel-core': 'Consider updating to @babel/core',
      'eslint-loader': 'ESLint loader is deprecated, use eslint-webpack-plugin'
    };

    for (const [dep, suggestion] of Object.entries(problematicDeps)) {
      if (allDeps[dep]) {
        analysis.recommendations.push(`${suggestion} (currently using ${dep})`);
        analysis.score -= 3;
      }
    }

    // Check for React 18+ compatibility
    if (allDeps.react && !allDeps.react.includes('19') && !allDeps.react.includes('^18')) {
      analysis.recommendations.push(`Consider updating React to version 18+ (current: ${allDeps.react})`);
      analysis.score -= 2;
    }

    // Check for TypeScript in appropriate packages
    if (analysis.name.includes('types') && !allDeps.typescript) {
      analysis.recommendations.push('Types package should include TypeScript dependency');
      analysis.score -= 3;
    }
  }

  /**
   * Generate cross-package consistency analysis
   */
  analyzeConsistency() {
    this.logInfo('Analyzing cross-package consistency...');

    const scriptCounts = {};
    const dependencyVersions = {};

    // Collect script usage patterns
    for (const pkg of this.results.packages) {
      for (const scriptName of Object.keys(pkg.scripts)) {
        scriptCounts[scriptName] = (scriptCounts[scriptName] || 0) + 1;
      }

      // Collect dependency versions
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      for (const [dep, version] of Object.entries(allDeps)) {
        if (!dependencyVersions[dep]) {
          dependencyVersions[dep] = {};
        }
        dependencyVersions[dep][version] = (dependencyVersions[dep][version] || 0) + 1;
      }
    }

    // Check for version inconsistencies
    for (const [dep, versions] of Object.entries(dependencyVersions)) {
      const versionCount = Object.keys(versions).length;
      if (versionCount > 1) {
        this.results.issues.push({
          type: 'version-inconsistency',
          message: `Dependency "${dep}" has ${versionCount} different versions across packages`,
          details: Object.entries(versions).map(([v, count]) => `${v} (${count} packages)`).join(', ')
        });
      }
    }

    // Calculate consistency score
    const totalPackages = this.results.packages.length;
    const avgScore = this.results.packages.reduce((sum, pkg) => sum + pkg.score, 0) / totalPackages;
    this.results.statistics.consistencyScore = Math.round(avgScore);
  }

  /**
   * Generate comprehensive validation report
   */
  generateReport() {
    console.log('\\n' + '='.repeat(70));
    console.log('📦 NPM SCRIPTS VALIDATION REPORT');
    console.log('='.repeat(70));
    
    const stats = this.results.statistics;
    console.log(`🎯 Overall Consistency Score: ${stats.consistencyScore}/100`);
    console.log(`📊 Packages Analyzed: ${stats.totalPackages}`);
    console.log(`🔧 Scripts Analyzed: ${stats.scriptsAnalyzed}`);
    console.log(`⚠️  Issues Found: ${stats.issuesFound}`);
    console.log('='.repeat(70));

    // Package-by-package summary
    console.log('\\n📋 PACKAGE SUMMARY:');
    for (const pkg of this.results.packages) {
      const status = pkg.score >= 80 ? '✅' : pkg.score >= 60 ? '⚠️' : '❌';
      const scriptCount = Object.keys(pkg.scripts).length;
      console.log(`   ${status} ${pkg.name} (Score: ${pkg.score}/100, Scripts: ${scriptCount})`);
      
      if (pkg.issues.length > 0 && process.env.VERBOSE === 'true') {
        pkg.issues.forEach(issue => {
          console.log(`      ❌ ${issue}`);
        });
      }
    }

    // Cross-package issues
    if (this.results.issues.length > 0) {
      console.log('\\n🔍 CROSS-PACKAGE ISSUES:');
      for (const issue of this.results.issues) {
        console.log(`   ❌ ${issue.message}`);
        if (issue.details) {
          console.log(`      Details: ${issue.details}`);
        }
      }
    }

    // Recommendations
    const allRecommendations = this.results.packages.flatMap(pkg => pkg.recommendations);
    if (allRecommendations.length > 0) {
      console.log('\\n💡 TOP RECOMMENDATIONS:');
      const recommendationCounts = {};
      allRecommendations.forEach(rec => {
        recommendationCounts[rec] = (recommendationCounts[rec] || 0) + 1;
      });
      
      Object.entries(recommendationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([rec, count]) => {
          console.log(`   💡 ${rec} (${count} package${count > 1 ? 's' : ''})`);
        });
    }

    // Next steps
    console.log('\\n📝 NEXT STEPS:');
    if (stats.consistencyScore >= 80) {
      console.log('1. Excellent script consistency! 🎉');
      console.log('2. Continue monitoring for new packages');
      console.log('3. Address any remaining recommendations');
    } else if (stats.consistencyScore >= 60) {
      console.log('1. Address critical issues identified above');
      console.log('2. Standardize script naming across packages');
      console.log('3. Update deprecated dependencies and patterns');
    } else {
      console.log('1. URGENT: Address critical issues immediately');
      console.log('2. Review and standardize all npm scripts');
      console.log('3. Update package.json files to follow conventions');
      console.log('4. Re-run validation after fixes');
    }
    console.log('='.repeat(70) + '\\n');
  }

  /**
   * Main execution method
   */
  async execute() {
    try {
      console.log('📦 ENTERPRISE NPM SCRIPTS VALIDATOR');
      console.log('===================================\\n');

      // Step 1: Find all package.json files
      this.logInfo('Discovering package.json files...');
      const packageFiles = this.findPackageFiles();
      
      if (packageFiles.length === 0) {
        this.logError('No package.json files found in workspace');
        process.exit(1);
      }

      this.logSuccess(`Found ${packageFiles.length} package.json files`);

      // Step 2: Analyze each package
      this.logInfo('Analyzing package configurations...');
      for (const packageFile of packageFiles) {
        const analysis = this.analyzePackage(packageFile);
        this.results.packages.push(analysis);
        
        // Update statistics
        this.results.statistics.scriptsAnalyzed += Object.keys(analysis.scripts).length;
        this.results.statistics.issuesFound += analysis.issues.length;
      }

      this.results.statistics.totalPackages = this.results.packages.length;

      // Step 3: Cross-package consistency analysis
      this.analyzeConsistency();

      // Step 4: Generate comprehensive report
      this.generateReport();

      // Exit with appropriate code
      const hasErrors = this.results.packages.some(pkg => pkg.issues.length > 0);
      if (hasErrors || this.results.statistics.consistencyScore < 60) {
        this.logError('Validation completed with issues requiring attention');
        process.exit(1);
      } else {
        this.logSuccess('All packages validated successfully!');
        process.exit(0);
      }

    } catch (error) {
      this.logError(`NPM scripts validation failed: ${error.message}`);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new NPMScriptsValidator();
  validator.execute();
}

export default NPMScriptsValidator;