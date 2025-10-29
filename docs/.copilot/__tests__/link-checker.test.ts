// docs/.copilot/__tests__/link-checker.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const DOCS_ROOT = path.resolve(__dirname, '../');
const TOC_PATH = path.join(DOCS_ROOT, 'toc.yml');

interface TOCFile {
  name: string;
  title: string;
  ai_hints: string[];
}

interface TOCDomain {
  description: string;
  path: string;
  files: TOCFile[];
}

interface TOC {
  domains: Record<string, TOCDomain>;
  cross_references: Record<string, string[]>;
}

describe('Documentation Link Checker', () => {
  let toc: TOC;

  beforeAll(() => {
    const tocContent = fs.readFileSync(TOC_PATH, 'utf8');
    toc = yaml.load(tocContent) as TOC;
  });

  it('should have all files referenced in TOC', () => {
    const missingFiles: string[] = [];

    for (const [domainName, domain] of Object.entries(toc.domains)) {
      const domainPath = path.join(DOCS_ROOT, domain.path.replace('./', ''));

      for (const file of domain.files) {
        const filePath = path.join(domainPath, file.name);
        if (!fs.existsSync(filePath)) {
          missingFiles.push(`${domain.path}/${file.name}`);
        }
      }
    }

    expect(missingFiles).toEqual([]);
  });

  it('should have all cross-references valid', () => {
    const brokenRefs: string[] = [];

    for (const [domain, refs] of Object.entries(toc.cross_references)) {
      for (const ref of refs) {
        const refPath = path.join(DOCS_ROOT, ref);
        if (!fs.existsSync(refPath)) {
          brokenRefs.push(`${domain} -> ${ref}`);
        }
      }
    }

    expect(brokenRefs).toEqual([]);
  });

  it('should have all related_documents in frontmatter valid', () => {
    const brokenRelated: string[] = [];

    for (const [domainName, domain] of Object.entries(toc.domains)) {
      const domainPath = path.join(DOCS_ROOT, domain.path.replace('./', ''));

      for (const file of domain.files) {
        const filePath = path.join(domainPath, file.name);
        if (!fs.existsSync(filePath)) continue;

        const content = fs.readFileSync(filePath, 'utf8');
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

        if (frontmatterMatch) {
          const frontmatter = yaml.load(frontmatterMatch[1]) as any;

          if (frontmatter.related_documents) {
            for (const related of frontmatter.related_documents) {
              const relatedPath = path.join(DOCS_ROOT, related);
              if (!fs.existsSync(relatedPath)) {
                brokenRelated.push(`${file.name} -> ${related}`);
              }
            }
          }
        }
      }
    }

    expect(brokenRelated).toEqual([]);
  });

  it('should have no duplicate files in TOC', () => {
    const fileNames: string[] = [];
    const duplicates: string[] = [];

    for (const [domainName, domain] of Object.entries(toc.domains)) {
      for (const file of domain.files) {
        if (fileNames.includes(file.name)) {
          duplicates.push(file.name);
        } else {
          fileNames.push(file.name);
        }
      }
    }

    expect(duplicates).toEqual([]);
  });

  it('should have ai_hints arrays non-empty for all files', () => {
    const missingHints: string[] = [];

    for (const [domainName, domain] of Object.entries(toc.domains)) {
      for (const file of domain.files) {
        if (!file.ai_hints || file.ai_hints.length === 0) {
          missingHints.push(`${domainName}/${file.name}`);
        }
      }
    }

    expect(missingHints).toEqual([]);
  });
});
