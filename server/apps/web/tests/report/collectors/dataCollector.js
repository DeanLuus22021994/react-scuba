/**
 * Data collection module for test results
 */

export class DataCollector {
  constructor() {
    this.testFiles = new Map();
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  /**
   * Process test files and collect results
   */
  processFiles(files) {
    for (const file of files) {
      const fileName = this.getRelativePath(file.filepath);
      const fileTests = {
        passed: [],
        failed: [],
        skipped: [],
        totalDuration: file.result?.duration || 0,
      };

      this.collectTestResults(file.tasks, fileTests);
      this.testFiles.set(fileName, fileTests);
    }
  }

  /**
   * Recursively collect test results from tasks
   */
  collectTestResults(tasks, fileTests) {
    if (!tasks) return;

    for (const task of tasks) {
      if (task.type === 'test') {
        this.totalTests++;
        const testData = {
          name: task.name,
          duration: task.result?.duration || 0,
          state: task.result?.state,
          errors: task.result?.errors || [],
        };

        if (task.result?.state === 'pass') {
          this.passedTests++;
          fileTests.passed.push(testData);
        } else if (task.result?.state === 'fail') {
          this.failedTests++;
          fileTests.failed.push(testData);
        } else if (task.result?.state === 'skip') {
          fileTests.skipped.push(testData);
        }
      }

      if (task.tasks) {
        this.collectTestResults(task.tasks, fileTests);
      }
    }
  }

  /**
   * Get relative file path
   */
  getRelativePath(filepath) {
    return filepath.replace(`${process.cwd()}/`, '');
  }

  /**
   * Get aggregated statistics
   */
  getStatistics() {
    const totalFiles = this.testFiles.size;
    const passedFiles = Array.from(this.testFiles.values()).filter(
      (f) => f.failed.length === 0
    ).length;
    const failedFiles = totalFiles - passedFiles;

    return {
      totalFiles,
      passedFiles,
      failedFiles,
      totalTests: this.totalTests,
      passedTests: this.passedTests,
      failedTests: this.failedTests,
      files: this.testFiles,
    };
  }
}
