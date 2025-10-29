// server/scripts/validate-toc.js
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';

const DOCS_ROOT = path.resolve(process.cwd(), '../.copilot');
const TOC_PATH = path.join(DOCS_ROOT, 'toc.yml');

function validateTOC() {
  const tocContent = fs.readFileSync(TOC_PATH, 'utf8');
  const toc = yaml.load(tocContent);

  const errors = [];

  // Validate file existence
  for (const [domainName, domain] of Object.entries(toc.domains)) {
    const domainPath = path.join(DOCS_ROOT, domain.path.replace('./', ''));

    for (const file of domain.files) {
      const filePath = path.join(domainPath, file.name);
      if (!fs.existsSync(filePath)) {
        errors.push(`Missing file: ${domain.path}/${file.name}`);
      }
    }
  }

  // Validate cross-references
  for (const [domain, refs] of Object.entries(toc.cross_references)) {
    for (const ref of refs) {
      const refPath = path.join(DOCS_ROOT, ref);
      if (!fs.existsSync(refPath)) {
        errors.push(`Broken cross-reference in ${domain}: ${ref}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

const result = validateTOC();
console.log(result.valid ? '✅ TOC valid' : `❌ ${result.errors.length} errors`);
result.errors.forEach(err => console.error(err));
process.exit(result.valid ? 0 : 1);
