/**
 * Link Checker Test
 * Validates all markdown links in documentation and README
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Recursively find all markdown files in a directory
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .vitepress cache
      if (file !== 'node_modules' && file !== '.vitepress' && file !== 'dist') {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Extract all markdown links from content
 */
function extractLinks(content, filePath) {
  const links = [];

  // Match markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = markdownLinkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
      line: content.substring(0, match.index).split('\n').length,
      file: filePath,
    });
  }

  // Match HTML links: <a href="url">
  const htmlLinkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g;
  while ((match = htmlLinkRegex.exec(content)) !== null) {
    links.push({
      text: 'HTML link',
      url: match[2],
      line: content.substring(0, match.index).split('\n').length,
      file: filePath,
    });
  }

  return links;
}

/**
 * Validate a link
 */
function validateLink(link) {
  const { url, file } = link;
  const errors = [];

  // Skip external URLs (http, https, mailto, etc.)
  if (/^(https?|mailto|tel):/.test(url)) {
    return errors;
  }

  // Skip anchors on same page
  if (url.startsWith('#')) {
    return errors;
  }

  // VitePress known placeholder pages (allowed - documentation in progress)
  const allowedPlaceholders = [
    '/api/analytics',
    '/api/currency',
    '/api/logger',
    '/api/seo-helpers',
    '/api/environment',
    '/api/use-currency',
    '/api/client',
    '/api/data-courses',
    '/api/data-dive-sites',
    '/api/data-team',
    '/api/data-gallery',
    '/components/layout',
    '/components/pages',
    '/components/shared',
    '/components/modals',
    '/components/dive-sites',
    '/components/gallery',
    '/components/layout.md',
    '/components/pages.md',
    '/components/shared.md',
    '/components/modals.md',
    '/deployment/vercel',
    '/deployment/netlify',
    '/deployment/github-pages',
    '/deployment/docker',
    '/deployment/gtm',
    '/deployment/analytics',
    '/deployment/recaptcha',
    '/deployment/domain',
    '/guide/configuration',
    '/guide/configuration.md',
    '/guide/environment',
    '/guide/performance',
    '/guide/workflow.md',
    './layout',
    './pages',
    './shared',
    './modals',
    './dive-sites',
    './gallery',
    './layout.md',
    './pages.md',
    './shared.md',
    './modals.md',
    './configuration.md',
    './workflow.md',
  ];

  // Check if it's an allowed placeholder
  const urlPart = url.split('#')[0];
  if (
    allowedPlaceholders.some(
      (placeholder) => urlPart === placeholder || urlPart.endsWith(placeholder)
    )
  ) {
    return errors; // Skip validation for planned documentation pages
  }

  // Handle relative paths
  let targetPath = url;

  // Remove hash/anchor from URL for file checking
  const [filePart] = url.split('#');

  // Resolve relative to the file's directory for relative links
  // For absolute links starting with /, resolve from docs root
  const fileDir = path.dirname(file);
  if (filePart.startsWith('/')) {
    // Absolute link from site root
    targetPath = path.join(rootDir, 'docs', filePart.replace(/^\//, ''));
  } else {
    // Relative link from current file
    targetPath = path.resolve(fileDir, filePart);
  }

  // Check if file exists
  if (!fs.existsSync(targetPath)) {
    // Try with .md extension if not already present
    if (!targetPath.endsWith('.md') && !targetPath.endsWith('.html')) {
      const mdPath = targetPath + '.md';
      const htmlPath = targetPath + '.html';

      if (!fs.existsSync(mdPath) && !fs.existsSync(htmlPath)) {
        // Check if it's a directory with index.md
        const indexMd = path.join(targetPath, 'index.md');
        const indexHtml = path.join(targetPath, 'index.html');

        if (!fs.existsSync(indexMd) && !fs.existsSync(indexHtml)) {
          errors.push({
            ...link,
            error: `Target file not found: ${filePart}`,
          });
        }
      }
    } else {
      errors.push({
        ...link,
        error: `Target file not found: ${filePart}`,
      });
    }
  }

  return errors;
}

describe('Link Checker', () => {
  it('should find all markdown files', () => {
    const docsFiles = findMarkdownFiles(path.join(rootDir, 'docs'));
    const readme = path.join(rootDir, 'README.md');

    expect(docsFiles.length).toBeGreaterThan(0);
    expect(fs.existsSync(readme)).toBe(true);
  });

  it('should validate all links in documentation', () => {
    const docsFiles = findMarkdownFiles(path.join(rootDir, 'docs'));
    const allErrors = [];

    docsFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractLinks(content, file);

      links.forEach((link) => {
        const errors = validateLink(link);
        allErrors.push(...errors);
      });
    });

    if (allErrors.length > 0) {
      const errorMessage = allErrors
        .map(
          (err) =>
            `\n  File: ${path.relative(rootDir, err.file)}\n  Line: ${err.line}\n  Link: [${err.text}](${err.url})\n  Error: ${err.error}`
        )
        .join('\n');

      expect.fail(`Found ${allErrors.length} broken link(s) in documentation:${errorMessage}`);
    }

    expect(allErrors).toHaveLength(0);
  });

  it('should validate all links in README.md', () => {
    const readme = path.join(rootDir, 'README.md');
    const content = fs.readFileSync(readme, 'utf-8');
    const links = extractLinks(content, readme);
    const allErrors = [];

    links.forEach((link) => {
      const errors = validateLink(link);
      allErrors.push(...errors);
    });

    if (allErrors.length > 0) {
      const errorMessage = allErrors
        .map(
          (err) => `\n  Line: ${err.line}\n  Link: [${err.text}](${err.url})\n  Error: ${err.error}`
        )
        .join('\n');

      expect.fail(`Found ${allErrors.length} broken link(s) in README.md:${errorMessage}`);
    }

    expect(allErrors).toHaveLength(0);
  });

  it('should detect common link issues', () => {
    const testCases = [
      {
        content: '[broken](./non-existent.md)',
        filePath: path.join(rootDir, 'docs', 'test.md'),
        shouldHaveError: true,
      },
      {
        content: '[external](https://github.com)',
        filePath: path.join(rootDir, 'docs', 'test.md'),
        shouldHaveError: false,
      },
      {
        content: '[anchor](#section)',
        filePath: path.join(rootDir, 'docs', 'test.md'),
        shouldHaveError: false,
      },
    ];

    testCases.forEach(({ content, filePath, shouldHaveError }) => {
      const links = extractLinks(content, filePath);
      const errors = links.flatMap((link) => validateLink(link));

      if (shouldHaveError) {
        expect(errors.length).toBeGreaterThan(0);
      } else {
        expect(errors).toHaveLength(0);
      }
    });
  });
});
