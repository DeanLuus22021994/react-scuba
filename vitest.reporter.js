import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default class MarkdownReporter {
  onFinished(files, _errors) {
    const runTime = new Date().toISOString();
    const testFiles = new Map();
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    // Process all test files
    for (const file of files) {
      const fileName = file.filepath.replace(process.cwd() + '/', '');
      const fileTests = {
        passed: [],
        failed: [],
        totalDuration: file.result?.duration || 0,
      };

      // Process all tasks in the file
      const processTasks = (tasks) => {
        for (const task of tasks) {
          if (task.type === 'test') {
            totalTests++;
            const testData = {
              name: task.name,
              duration: task.result?.duration || 0,
              state: task.result?.state,
            };

            if (task.result?.state === 'pass') {
              passedTests++;
              fileTests.passed.push(testData);
            } else if (task.result?.state === 'fail') {
              failedTests++;
              fileTests.failed.push(testData);
            }
          }
          if (task.tasks) {
            processTasks(task.tasks);
          }
        }
      };

      if (file.tasks) {
        processTasks(file.tasks);
      }

      testFiles.set(fileName, fileTests);
    }

    const totalFiles = testFiles.size;
    const passedFiles = Array.from(testFiles.values()).filter((f) => f.failed.length === 0).length;
    const failedFiles = totalFiles - passedFiles;

    // Generate Markdown report
    const docsTestingDir = join(__dirname, 'docs/testing');
    const mdFile = join(docsTestingDir, 'testing.md');

    let markdown = `# Test Results\n\n`;
    markdown += `**Generated:** ${new Date(runTime).toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    // Summary section
    markdown += `## Summary\n\n`;
    markdown += `| Metric | Count | Percentage |\n`;
    markdown += `|--------|-------|------------|\n`;
    markdown += `| **Total Test Files** | ${totalFiles} | 100% |\n`;
    markdown += `| ✅ **Passed Files** | ${passedFiles} | ${((passedFiles / totalFiles) * 100).toFixed(1)}% |\n`;
    markdown += `| ❌ **Failed Files** | ${failedFiles} | ${((failedFiles / totalFiles) * 100).toFixed(1)}% |\n`;
    markdown += `| **Total Tests** | ${totalTests} | 100% |\n`;
    markdown += `| ✅ **Passed Tests** | ${passedTests} | ${((passedTests / totalTests) * 100).toFixed(1)}% |\n`;
    markdown += `| ❌ **Failed Tests** | ${failedTests} | ${((failedTests / totalTests) * 100).toFixed(1)}% |\n\n`;

    // Test Files Overview
    markdown += `---\n\n## Test Files Overview\n\n`;

    // Passed files
    if (passedFiles > 0) {
      markdown += `### ✅ Passed Files (${passedFiles})\n\n`;
      const passedFilesList = Array.from(testFiles.entries())
        .filter(([, data]) => data.failed.length === 0)
        .sort((a, b) => a[0].localeCompare(b[0]));

      for (const [fileName, data] of passedFilesList) {
        const testCount = data.passed.length;
        const duration = data.totalDuration.toFixed(0);
        markdown += `- **${fileName}** - ${testCount} test${testCount !== 1 ? 's' : ''} (${duration}ms)\n`;
      }
      markdown += `\n`;
    }

    // Failed files
    if (failedFiles > 0) {
      markdown += `### ❌ Failed Files (${failedFiles})\n\n`;
      const failedFilesList = Array.from(testFiles.entries())
        .filter(([, data]) => data.failed.length > 0)
        .sort((a, b) => a[0].localeCompare(b[0]));

      for (const [fileName, data] of failedFilesList) {
        const passedCount = data.passed.length;
        const failedCount = data.failed.length;
        const duration = data.totalDuration.toFixed(0);
        markdown += `- **${fileName}** - ${failedCount} failed, ${passedCount} passed (${duration}ms)\n`;
      }
      markdown += `\n`;
    }

    // Detailed Results by Category
    markdown += `---\n\n## Detailed Results\n\n`;

    // Group by directory
    const categories = new Map();
    for (const [fileName] of testFiles) {
      const parts = fileName.split('/');
      const category = parts.length > 1 ? parts[parts.length - 2] : 'root';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category).push(fileName);
    }

    // Sort categories
    const sortedCategories = Array.from(categories.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    for (const [category, files] of sortedCategories) {
      markdown += `### 📁 ${category}\n\n`;

      for (const fileName of files.sort()) {
        const data = testFiles.get(fileName);
        const totalFileTests = data.passed.length + data.failed.length;
        const fileStatus = data.failed.length === 0 ? '✅' : '❌';

        markdown += `#### ${fileStatus} ${fileName.split('/').pop()}\n\n`;
        markdown += `- **Tests:** ${totalFileTests} (${data.passed.length} passed, ${data.failed.length} failed)\n`;
        markdown += `- **Duration:** ${data.totalDuration.toFixed(0)}ms\n\n`;

        if (data.failed.length > 0) {
          markdown += `**Failed Tests:**\n\n`;
          for (const test of data.failed) {
            markdown += `- ❌ ${test.name} (${test.duration.toFixed(0)}ms)\n`;
          }
          markdown += `\n`;
        }
      }
    }

    // Performance metrics
    markdown += `---\n\n## Performance\n\n`;
    const allTests = [];
    for (const [fileName, data] of testFiles) {
      for (const test of [...data.passed, ...data.failed]) {
        allTests.push({ ...test, fileName });
      }
    }
    const totalDuration = allTests.reduce((sum, t) => sum + t.duration, 0);
    const avgDuration = totalDuration / totalTests;
    const slowestTests = [...allTests].sort((a, b) => b.duration - a.duration).slice(0, 10);

    markdown += `- **Total Duration:** ${totalDuration.toFixed(0)}ms\n`;
    markdown += `- **Average Test Duration:** ${avgDuration.toFixed(2)}ms\n\n`;

    markdown += `### Slowest Tests\n\n`;
    markdown += `| Test | File | Duration |\n`;
    markdown += `|------|------|----------|\n`;
    for (const test of slowestTests) {
      markdown += `| ${test.name} | ${test.fileName.split('/').pop()} | ${test.duration.toFixed(0)}ms |\n`;
    }
    markdown += `\n`;

    markdown += `---\n\n`;
    markdown += `*Report generated automatically by Vitest on ${new Date(runTime).toLocaleString()}*\n`;

    try {
      writeFileSync(mdFile, markdown);

      // Also create JSON for programmatic access
      const jsonFile = join(docsTestingDir, 'test-results.json');
      writeFileSync(
        jsonFile,
        JSON.stringify(
          {
            runTime,
            summary: {
              totalFiles,
              passedFiles,
              failedFiles,
              totalTests,
              passedTests,
              failedTests,
            },
            files: Object.fromEntries(testFiles),
          },
          null,
          2
        )
      );
    } catch (error) {
      console.error('Failed to write test report:', error);
    }
  }
}
