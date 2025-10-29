// docs/.copilot/__tests__/orphan-detector.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const DOCS_ROOT = path.resolve(__dirname, '../');
const TOC_PATH = path.join(DOCS_ROOT, 'toc.yml');

interface TOC {
  domains: Record<string, { path: string; files: { name: string }[] }>;
  ai_agent_guide?: { name: string };
}

function scanMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && entry.name !== '__tests__') {
        files.push(...scanMarkdownFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const relativePath = path.relative(DOCS_ROOT, fullPath);
        files.push(relativePath.replace(/\\/g, '/'));
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return files;
}

describe('Orphan File Detector', () => {
  let toc: TOC;
  let allMarkdownFiles: string[];
  let referencedFiles: string[];

  beforeAll(() => {
    // Load TOC
    const tocContent = fs.readFileSync(TOC_PATH, 'utf8');
    toc = yaml.load(tocContent) as TOC;

    // Scan all markdown files
    allMarkdownFiles = scanMarkdownFiles(DOCS_ROOT);

    // Build list of referenced files
    referencedFiles = [];
    
    // Add top-level files (like AI Agent Guide)
    if (toc.ai_agent_guide && toc.ai_agent_guide.name) {
      referencedFiles.push(toc.ai_agent_guide.name);
    }
    
    // Add domain files
    for (const [domainName, domain] of Object.entries(toc.domains)) {
      const domainPath = domain.path.replace('./', '');
      for (const file of domain.files) {
        const filePath = path.join(domainPath, file.name).replace(/\\/g, '/');
        referencedFiles.push(filePath);
      }
    }
  });

  it('should have no orphaned markdown files', () => {
    const excludedFiles = [
      'MIGRATION.md',
      'schemas/toc-schema.json', // Not markdown but in same directory
      '20251029-docs-decomposition-plan.instructions.md', // Planning file
    ];

    const orphanedFiles = allMarkdownFiles.filter(file => {
      // Exclude specific files that shouldn't be in TOC
      if (excludedFiles.some(excluded => file.includes(excluded))) {
        return false;
      }

      // Check if file is referenced in TOC
      return !referencedFiles.includes(file);
    });

    expect(orphanedFiles).toEqual([]);
  });

  it('should have consistent domain file counts', () => {
    const expectedCounts = {
      architecture: 3,
      infrastructure: 5,
      modernization: 3,
      'getting-started': 2,
      planning: 2
    };

    const actualCounts: Record<string, number> = {};

    for (const [domainName, domain] of Object.entries(toc.domains)) {
      actualCounts[domainName] = domain.files.length;
    }

    expect(actualCounts).toEqual(expectedCounts);
  });
});
