import { describe, expect, it } from 'vitest';
import * as diveSitesExports from '../../../src/features/dive-sites/index';

describe('components/dive-sites/index', () => {
  it('should export DiveMap', () => {
    expect(diveSitesExports.DiveMap).toBeDefined();
  });

  it('should export DiveSiteCard', () => {
    expect(diveSitesExports.DiveSiteCard).toBeDefined();
  });

  it('should export DiveSitesPage', () => {
    expect(diveSitesExports.DiveSitesPage).toBeDefined();
  });
});
