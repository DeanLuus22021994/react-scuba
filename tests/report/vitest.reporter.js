import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { CategoryAnalyzer } from './analyzers/categoryAnalyzer.js';
import { PerformanceAnalyzer } from './analyzers/performanceAnalyzer.js';
import { DataCollector } from './collectors/dataCollector.js';
import { HtmlGenerator } from './generators/htmlGenerator.js';
import { JsonGenerator } from './generators/jsonGenerator.js';
import { MarkdownGenerator } from './generators/markdownGenerator.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Modular Vitest Reporter
 * Generates interactive HTML, concise Markdown, and comprehensive JSON reports
 */
export default class ModularTestReporter {
  onFinished(files, _errors) {
    const runTime = new Date().toISOString();

    // Ensure output directory exists
    const outputDir = join(__dirname, '../../docs/testing');
    mkdirSync(outputDir, { recursive: true });

    try {
      // Step 1: Collect data
      const collector = new DataCollector();
      collector.processFiles(files);
      const statistics = collector.getStatistics();

      // Step 2: Analyze data
      const performanceAnalyzer = new PerformanceAnalyzer(statistics.files);
      const categoryAnalyzer = new CategoryAnalyzer(statistics.files);

      // Step 3: Generate reports

      // JSON report (comprehensive data)
      const jsonGenerator = new JsonGenerator(statistics, runTime);
      const jsonData = jsonGenerator.generate(performanceAnalyzer, categoryAnalyzer);
      writeFileSync(join(outputDir, 'test-results.json'), JSON.stringify(jsonData, null, 2));

      // Markdown report (concise summary with link to full report)
      const markdownGenerator = new MarkdownGenerator(statistics, runTime);
      const markdown = markdownGenerator.generate();
      writeFileSync(join(outputDir, 'testing.md'), markdown);

      // HTML report (interactive dashboard)
      const htmlGenerator = new HtmlGenerator(statistics, runTime);
      const html = htmlGenerator.generate(performanceAnalyzer, categoryAnalyzer);
      writeFileSync(join(outputDir, 'index.html'), html);

      console.info(`\n✅ Test reports generated in ${outputDir}/`);
      console.info(`   📊 HTML Dashboard: index.html`);
      console.info(`   📝 Markdown Summary: testing.md`);
      console.info(`   📋 JSON Data: test-results.json\n`);
    } catch (error) {
      console.error('Failed to generate test reports:', error);
    }
  }
}
