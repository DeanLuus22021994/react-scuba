/**
 * Interactive HTML report generator with charts and tabs
 */

export class HtmlGenerator {
  constructor(statistics, runTime) {
    this.statistics = statistics;
    this.runTime = runTime;
  }

  /**
   * Generate interactive HTML report
   */
  generate(performanceAnalyzer, categoryAnalyzer) {
    const data = {
      summary: this.statistics,
      performance: {
        metrics: performanceAnalyzer.getMetrics(),
        slowestTests: performanceAnalyzer.getSlowestTests(),
        slowestFiles: performanceAnalyzer.getSlowestFiles(),
        distribution: performanceAnalyzer.getDistribution(),
      },
      categories: categoryAnalyzer.getCategoryStats(),
      runTime: this.runTime,
    };

    return this.buildHtml(data);
  }

  /**
   * Build complete HTML document
   */
  buildHtml(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Results - ${new Date(data.runTime).toLocaleDateString()}</title>
    <link rel="stylesheet" href="../.vitepress/theme/custom.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🧪 Test Results Dashboard</h1>
            <p class="timestamp">Generated: ${new Date(data.runTime).toLocaleString()}</p>
        </header>

        ${this.buildSummaryCards(data.summary)}
        ${this.buildTabs(data)}
    </div>

    <script>${this.getScript(data)}</script>
</body>
</html>`;
  }

  /**
   * Build summary cards
   */
  buildSummaryCards(summary) {
    const passRate =
      summary.totalTests > 0 ? ((summary.passedTests / summary.totalTests) * 100).toFixed(1) : '0';
    const filePassRate =
      summary.totalFiles > 0 ? ((summary.passedFiles / summary.totalFiles) * 100).toFixed(1) : '0';

    return `
        <div class="summary-cards">
            <div class="card ${summary.failedTests === 0 ? 'success' : 'warning'}">
                <div class="card-icon">${summary.failedTests === 0 ? '✅' : '⚠️'}</div>
                <div class="card-content">
                    <div class="card-value">${passRate}%</div>
                    <div class="card-label">Pass Rate</div>
                    <div class="card-detail">${summary.passedTests}/${summary.totalTests} tests</div>
                </div>
            </div>

            <div class="card">
                <div class="card-icon">📁</div>
                <div class="card-content">
                    <div class="card-value">${summary.totalFiles}</div>
                    <div class="card-label">Test Files</div>
                    <div class="card-detail">${filePassRate}% passing</div>
                </div>
            </div>

            <div class="card ${summary.failedTests === 0 ? 'success' : 'error'}">
                <div class="card-icon">${summary.failedTests === 0 ? '🎉' : '❌'}</div>
                <div class="card-content">
                    <div class="card-value">${summary.failedTests}</div>
                    <div class="card-label">Failures</div>
                    <div class="card-detail">${summary.failedFiles} files affected</div>
                </div>
            </div>
        </div>`;
  }

  /**
   * Build tabbed interface
   */
  buildTabs(data) {
    return `
        <div class="tabs">
            <div class="tab-buttons">
                <button class="tab-button active" data-tab="overview">📊 Overview</button>
                <button class="tab-button" data-tab="performance">⚡ Performance</button>
                <button class="tab-button" data-tab="categories">📁 Categories</button>
                <button class="tab-button" data-tab="files">📄 Files</button>
            </div>

            <div class="tab-content">
                <div class="tab-panel active" id="overview">
                    ${this.buildOverviewTab(data)}
                </div>
                <div class="tab-panel" id="performance">
                    ${this.buildPerformanceTab(data.performance)}
                </div>
                <div class="tab-panel" id="categories">
                    ${this.buildCategoriesTab(data.categories)}
                </div>
                <div class="tab-panel" id="files">
                    ${this.buildFilesTab(data.summary.files)}
                </div>
            </div>
        </div>`;
  }

  /**
   * Build overview tab
   */
  buildOverviewTab(_data) {
    return `
        <div class="charts">
            <div class="chart-container">
                <h3>Test Results Distribution</h3>
                <canvas id="resultsChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Performance Distribution</h3>
                <canvas id="performanceChart"></canvas>
            </div>
        </div>`;
  }

  /**
   * Build performance tab
   */
  buildPerformanceTab(performance) {
    const { metrics, slowestTests, slowestFiles } = performance;

    return `
        <div class="performance-section">
            <div class="metric-cards">
                <div class="metric-card">
                    <div class="metric-value">${(metrics.totalDuration / 1000).toFixed(2)}s</div>
                    <div class="metric-label">Total Duration</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.avgDuration.toFixed(2)}ms</div>
                    <div class="metric-label">Avg Test Duration</div>
                </div>
            </div>

            <div class="two-columns">
                <div>
                    <h3>🐌 Slowest Tests</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Test Name</th>
                                <th>File</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${slowestTests
                              .map(
                                (test) => `
                                <tr>
                                    <td class="truncate">${test.name}</td>
                                    <td class="truncate">${test.fileName.split('/').pop()}</td>
                                    <td>${test.duration.toFixed(0)}ms</td>
                                </tr>
                            `
                              )
                              .join('')}
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>📁 Slowest Files</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>File</th>
                                <th>Tests</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${slowestFiles
                              .map(
                                (file) => `
                                <tr>
                                    <td class="truncate">${file.fileName.split('/').pop()}</td>
                                    <td>${file.testCount}</td>
                                    <td>${file.duration.toFixed(0)}ms</td>
                                </tr>
                            `
                              )
                              .join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
  }

  /**
   * Build categories tab
   */
  buildCategoriesTab(categories) {
    return `
        <div class="categories-section">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Files</th>
                        <th>Tests</th>
                        <th>Pass Rate</th>
                        <th>Duration</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories
                      .map(
                        (cat) => `
                        <tr>
                            <td><strong>${cat.category}</strong></td>
                            <td>${cat.fileCount}</td>
                            <td>${cat.totalTests}</td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" data-width="${cat.passRate}%"></div>
                                    <span class="progress-text">${cat.passRate.toFixed(1)}%</span>
                                </div>
                            </td>
                            <td>${cat.totalDuration.toFixed(0)}ms</td>
                            <td>${cat.failedTests === 0 ? '✅' : `❌ ${cat.failedTests} failed`}</td>
                        </tr>
                    `
                      )
                      .join('')}
                </tbody>
            </table>
        </div>`;
  }

  /**
   * Build files tab
   */
  buildFilesTab(files) {
    const fileArray = Array.from(files.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    return `
        <div class="files-section">
            <div class="search-box">
                <input type="text" id="fileSearch" placeholder="🔍 Search files..." />
            </div>
            <table class="data-table" id="filesTable">
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Tests</th>
                        <th>Passed</th>
                        <th>Failed</th>
                        <th>Duration</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${fileArray
                      .map(([fileName, data]) => {
                        const total = data.passed.length + data.failed.length;
                        const status = data.failed.length === 0 ? '✅ Pass' : '❌ Fail';
                        return `
                        <tr class="${data.failed.length > 0 ? 'failed' : ''}">
                            <td class="truncate" title="${fileName}">${fileName}</td>
                            <td>${total}</td>
                            <td class="success-text">${data.passed.length}</td>
                            <td class="error-text">${data.failed.length}</td>
                            <td>${data.totalDuration.toFixed(0)}ms</td>
                            <td>${status}</td>
                        </tr>
                    `;
                      })
                      .join('')}
                </tbody>
            </table>
        </div>`;
  }

  /**
   * Get JavaScript code
   */
  getScript(data) {
    return `
        const testData = ${JSON.stringify(data)};

        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;

                document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

                button.classList.add('active');
                document.getElementById(tab).classList.add('active');
            });
        });

        // File search
        const searchInput = document.getElementById('fileSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const rows = document.querySelectorAll('#filesTable tbody tr');

                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        }

        // Charts using Chart.js (CDN loaded)
        function loadCharts() {
            if (typeof Chart === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
                script.onload = initCharts;
                document.head.appendChild(script);
            } else {
                initCharts();
            }
        }

        function initCharts() {
            // Results distribution chart
            const resultsCtx = document.getElementById('resultsChart');
            if (resultsCtx) {
                new Chart(resultsCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Passed', 'Failed'],
                        datasets: [{
                            data: [testData.summary.passedTests, testData.summary.failedTests],
                            backgroundColor: ['#10b981', '#ef4444'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'bottom' }
                        }
                    }
                });
            }

            // Performance distribution chart
            const perfCtx = document.getElementById('performanceChart');
            if (perfCtx && testData.performance.distribution) {
                new Chart(perfCtx, {
                    type: 'bar',
                    data: {
                        labels: testData.performance.distribution.map(d => d.label),
                        datasets: [{
                            label: 'Test Count',
                            data: testData.performance.distribution.map(d => d.count),
                            backgroundColor: '#667eea',
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            }
        }

        // Initialize
        loadCharts();
    `;
  }
}
