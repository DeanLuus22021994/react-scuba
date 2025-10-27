import * as aboutExports from '@features/team/index';
import { describe, expect, it } from 'vitest';

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
