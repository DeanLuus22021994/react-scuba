/**
 * JSON report generator
 */

export class JsonGenerator {
  constructor(statistics, runTime) {
    this.statistics = statistics;
    this.runTime = runTime;
  }

  /**
   * Generate comprehensive JSON report
   */
  generate(performanceAnalyzer, categoryAnalyzer) {
    return {
      runTime: this.runTime,
      summary: {
        totalFiles: this.statistics.totalFiles,
        passedFiles: this.statistics.passedFiles,
        failedFiles: this.statistics.failedFiles,
        totalTests: this.statistics.totalTests,
        passedTests: this.statistics.passedTests,
        failedTests: this.statistics.failedTests,
        passRate:
          this.statistics.totalTests > 0
            ? (this.statistics.passedTests / this.statistics.totalTests) * 100
            : 0,
      },
      performance: {
        ...performanceAnalyzer.getMetrics(),
        slowestTests: performanceAnalyzer.getSlowestTests(),
        slowestFiles: performanceAnalyzer.getSlowestFiles(),
        distribution: performanceAnalyzer.getDistribution(),
      },
      categories: categoryAnalyzer.getCategoryStats(),
      files: Object.fromEntries(this.statistics.files),
    };
  }
}
