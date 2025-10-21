/**
 * Performance analysis module for test results
 */

export class PerformanceAnalyzer {
  constructor(testFiles) {
    this.testFiles = testFiles;
  }

  /**
   * Get all tests with performance data
   */
  getAllTests() {
    const allTests = [];
    for (const [fileName, data] of this.testFiles) {
      for (const test of [...data.passed, ...data.failed, ...data.skipped]) {
        allTests.push({ ...test, fileName });
      }
    }
    return allTests;
  }

  /**
   * Calculate performance metrics
   */
  getMetrics() {
    const allTests = this.getAllTests();
    const totalDuration = allTests.reduce((sum, t) => sum + t.duration, 0);
    const avgDuration = allTests.length > 0 ? totalDuration / allTests.length : 0;

    return {
      totalDuration,
      avgDuration,
      testCount: allTests.length,
    };
  }

  /**
   * Get slowest tests
   */
  getSlowestTests(limit = 10) {
    return this.getAllTests()
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get slowest test files
   */
  getSlowestFiles(limit = 10) {
    return Array.from(this.testFiles.entries())
      .map(([fileName, data]) => ({
        fileName,
        duration: data.totalDuration,
        testCount: data.passed.length + data.failed.length + data.skipped.length,
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get performance distribution
   */
  getDistribution() {
    const allTests = this.getAllTests();
    const ranges = [
      { label: '< 10ms', min: 0, max: 10, count: 0 },
      { label: '10-50ms', min: 10, max: 50, count: 0 },
      { label: '50-100ms', min: 50, max: 100, count: 0 },
      { label: '100-500ms', min: 100, max: 500, count: 0 },
      { label: '> 500ms', min: 500, max: Infinity, count: 0 },
    ];

    for (const test of allTests) {
      const range = ranges.find((r) => test.duration >= r.min && test.duration < r.max);
      if (range) range.count++;
    }

    return ranges;
  }
}
