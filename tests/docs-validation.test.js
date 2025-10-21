/**
 * Documentation Validation Test Suite
 * Comprehensive validation for VitePress documentation
 * - Validates all markdown files exist
 * - Checks all internal links
 * - Validates frontmatter
 * - Checks for broken images
 * - Validates code blocks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const publicDir = path.join(rootDir, 'public');

/**
 * Recursively find all markdown files
 */
function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
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
 * Extract links from markdown content
 */
function extractLinks(content) {
  const links = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
      line: content.substring(0, match.index).split('\n').length,
    });
  }

  return links;
}

/**
 * Extract image sources from markdown
 */
function extractImages(content) {
  const images = [];
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      alt: match[1],
      src: match[2],
      line: content.substring(0, match.index).split('\n').length,
    });
  }

  // Also check frontmatter images
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const frontmatterMatch = content.match(frontmatterRegex);
  if (frontmatterMatch) {
    const srcRegex = /src:\s*([^\n]+)/g;
    let srcMatch;
    while ((srcMatch = srcRegex.exec(frontmatterMatch[1])) !== null) {
      images.push({
        alt: 'frontmatter image',
        src: srcMatch[1].trim(),
        line: content.substring(0, srcMatch.index).split('\n').length,
      });
    }
  }

  return images;
}

/**
 * Validate a file path exists
 */
function validateFilePath(linkPath, fromFile) {
  // Handle external links
  if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) {
    return { valid: true, type: 'external' };
  }

  // Handle anchors
  if (linkPath.startsWith('#')) {
    return { valid: true, type: 'anchor' };
  }

  // Remove query strings and anchors
  const cleanPath = linkPath.split('?')[0].split('#')[0];

  // Handle absolute paths from docs root
  if (cleanPath.startsWith('/')) {
    const absolutePath = path.join(docsDir, cleanPath.substring(1));

    // Check if it's a directory (should have index.md)
    if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
      const indexPath = path.join(absolutePath, 'index.md');
      return {
        valid: fs.existsSync(indexPath),
        type: 'directory',
        resolvedPath: indexPath,
      };
    }

    // Check if it's a file
    if (fs.existsSync(absolutePath)) {
      return { valid: true, type: 'file', resolvedPath: absolutePath };
    }

    // Check with .md extension
    const withMd = absolutePath + '.md';
    if (fs.existsSync(withMd)) {
      return { valid: true, type: 'file', resolvedPath: withMd };
    }

    // Check in public directory for assets
    const publicPath = path.join(publicDir, cleanPath);
    if (fs.existsSync(publicPath)) {
      return { valid: true, type: 'asset', resolvedPath: publicPath };
    }

    return { valid: false, type: 'missing', attemptedPaths: [absolutePath, withMd, publicPath] };
  }

  // Handle relative paths
  const fromDir = path.dirname(fromFile);
  const relativePath = path.resolve(fromDir, cleanPath);

  if (fs.existsSync(relativePath)) {
    return { valid: true, type: 'file', resolvedPath: relativePath };
  }

  const withMd = relativePath + '.md';
  if (fs.existsSync(withMd)) {
    return { valid: true, type: 'file', resolvedPath: withMd };
  }

  return { valid: false, type: 'missing', attemptedPaths: [relativePath, withMd] };
}

describe('Documentation Validation', () => {
  const markdownFiles = findMarkdownFiles(docsDir);

  it('should find markdown files in docs directory', () => {
    expect(markdownFiles.length).toBeGreaterThan(0);
  });

  it('should validate all internal links', () => {
    const errors = [];

    markdownFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const links = extractLinks(content);
      const relativePath = path.relative(rootDir, filePath);

      links.forEach((link) => {
        // Skip external links
        if (link.url.startsWith('http://') || link.url.startsWith('https://')) {
          return;
        }

        // Skip mailto links
        if (link.url.startsWith('mailto:')) {
          return;
        }

        const validation = validateFilePath(link.url, filePath);

        if (!validation.valid) {
          errors.push({
            file: relativePath,
            line: link.line,
            link: link.text,
            url: link.url,
            type: validation.type,
            message: `Broken link: [${link.text}](${link.url})`,
          });
        }
      });
    });

    if (errors.length > 0) {
      const errorMessage = errors
        .map(
          (err) =>
            `\n  ${err.file}:${err.line}\n  Link: [${err.link}](${err.url})\n  Error: ${err.message}`
        )
        .join('\n');

      expect.fail(`Found ${errors.length} broken link(s):${errorMessage}`);
    }
  });

  it('should validate all image references', () => {
    const errors = [];

    markdownFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const images = extractImages(content);
      const relativePath = path.relative(rootDir, filePath);

      images.forEach((image) => {
        // Skip external images
        if (image.src.startsWith('http://') || image.src.startsWith('https://')) {
          return;
        }

        const validation = validateFilePath(image.src, filePath);

        if (!validation.valid) {
          errors.push({
            file: relativePath,
            line: image.line,
            alt: image.alt,
            src: image.src,
            message: `Missing image: ![${image.alt}](${image.src})`,
          });
        }
      });
    });

    if (errors.length > 0) {
      const errorMessage = errors
        .map((err) => `\n  ${err.file}:${err.line}\n  Image: ![${err.alt}](${err.src})`)
        .join('\n');

      expect.fail(`Found ${errors.length} missing image(s):${errorMessage}`);
    }
  });

  it('should validate frontmatter in all markdown files', () => {
    const errors = [];

    markdownFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(rootDir, filePath);

      // Check if file starts with frontmatter
      if (!content.trimStart().startsWith('---')) {
        // Frontmatter is optional, but if present should be valid
        return;
      }

      const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
      const match = content.match(frontmatterRegex);

      if (!match) {
        errors.push({
          file: relativePath,
          message: 'Invalid frontmatter format (missing closing ---)',
        });
      }
    });

    if (errors.length > 0) {
      const errorMessage = errors.map((err) => `\n  ${err.file}: ${err.message}`).join('\n');

      expect.fail(`Found ${errors.length} frontmatter error(s):${errorMessage}`);
    }
  });

  it('should validate code blocks have language specified', () => {
    const errors = [];

    markdownFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(rootDir, filePath);

      // Find code blocks without language
      const codeBlockRegex = /^```\s*\n/gm;
      let match;

      while ((match = codeBlockRegex.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;
        errors.push({
          file: relativePath,
          line,
          message: 'Code block missing language identifier',
        });
      }
    });

    if (errors.length > 0) {
      const errorMessage = errors
        .map((err) => `\n  ${err.file}:${err.line} - ${err.message}`)
        .join('\n');

      expect.fail(`Found ${errors.length} code block(s) without language:${errorMessage}`);
    }
  });

  it('should validate public assets exist', () => {
    const requiredAssets = [
      'logo.svg',
      'favicon.ico',
      'manifest.json',
      'robots.txt',
      'sitemap.xml',
    ];

    const missing = requiredAssets.filter((asset) => {
      const assetPath = path.join(publicDir, asset);
      return !fs.existsSync(assetPath);
    });

    if (missing.length > 0) {
      expect.fail(`Missing required assets: ${missing.join(', ')}`);
    }
  });
});
