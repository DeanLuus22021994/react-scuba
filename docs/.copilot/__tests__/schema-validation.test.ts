// docs/.copilot/__tests__/schema-validation.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const DOCS_ROOT = path.resolve(__dirname, '../');
const TOC_PATH = path.join(DOCS_ROOT, 'toc.yml');

describe('Schema Validation', () => {
  let tocData: any;
  
  beforeAll(() => {
    // Load TOC data
    const tocContent = fs.readFileSync(TOC_PATH, 'utf8');
    tocData = yaml.load(tocContent);
  });

  it('should have required properties in TOC', () => {
    expect(tocData).toHaveProperty('domains');
    expect(tocData).toHaveProperty('schema');
    expect(tocData).toHaveProperty('version');
    expect(typeof tocData.domains).toBe('object');
    expect(typeof tocData.schema).toBe('string');
    expect(typeof tocData.version).toBe('string');
  });

  it('should have proper domain structure', () => {
    const domainKeys = Object.keys(tocData.domains);
    expect(domainKeys.length).toBeGreaterThan(0);
    
    for (const domainKey of domainKeys) {
      const domain = tocData.domains[domainKey];
      expect(domain).toHaveProperty('description');
      expect(domain).toHaveProperty('path');
      expect(domain).toHaveProperty('files');
      expect(Array.isArray(domain.files)).toBe(true);
      
      for (const file of domain.files) {
        expect(file).toHaveProperty('name');
        expect(file).toHaveProperty('title');
        expect(typeof file.name).toBe('string');
        expect(typeof file.title).toBe('string');
        
        if (file.ai_hints) {
          expect(Array.isArray(file.ai_hints)).toBe(true);
        }
      }
    }
  });

  it('should have valid schema reference', () => {
    expect(tocData.schema).toMatch(/\.json$/);
    expect(tocData.schema).toContain('toc-schema');
  });
});