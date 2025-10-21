import { describe, expect, it } from 'vitest';
import * as aboutExports from '../../src/components/about/index';

describe('components/about/index', () => {
  it('should export AboutPage', () => {
    expect(aboutExports.AboutPage).toBeDefined();
  });

  it('should export CredentialCard', () => {
    expect(aboutExports.CredentialCard).toBeDefined();
  });

  it('should export TeamMember', () => {
    expect(aboutExports.TeamMember).toBeDefined();
  });

  it('should have correct number of exports', () => {
    const exportKeys = Object.keys(aboutExports);
    expect(exportKeys).toHaveLength(3);
  });
});
