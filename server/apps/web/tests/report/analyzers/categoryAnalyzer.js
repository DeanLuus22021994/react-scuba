/**
 * Category analysis module for grouping test results
 */

export class CategoryAnalyzer {
  constructor(testFiles) {
    this.testFiles = testFiles;
  }

  /**
   * Group tests by directory/category
   */
  groupByCategory() {
    const categories = new Map();

    for (const [fileName] of this.testFiles) {
      const category = this.extractCategory(fileName);
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push(fileName);
    }

    return categories;
  }

  /**
   * Extract category from file path
   */
  extractCategory(fileName) {
    const parts = fileName.split('/');
    if (parts.length > 1) {
      return parts[parts.length - 2];
    }
    return 'root';
  }

  /**
   * Get category statistics
   */
  getCategoryStats() {
    const categories = this.groupByCategory();
    const stats = [];

    for (const [category, files] of categories) {
      let totalTests = 0;
      let passedTests = 0;
      let failedTests = 0;
      let totalDuration = 0;

      for (const fileName of files) {
        const fileData = this.testFiles.get(fileName);
        totalTests += fileData.passed.length + fileData.failed.length;
        passedTests += fileData.passed.length;
        failedTests += fileData.failed.length;
        totalDuration += fileData.totalDuration;
      }

      stats.push({
        category,
        fileCount: files.length,
        totalTests,
        passedTests,
        failedTests,
        totalDuration,
        passRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      });
    }

    return stats.sort((a, b) => a.category.localeCompare(b.category));
  }
}
