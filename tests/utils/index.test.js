import { describe, expect, it } from 'vitest';
import * as utilsExports from '@/utils/index';

describe('utils/index', () => {
  it('should export logger', () => {
    expect(utilsExports.logger).toBeDefined();
  });

  it('should export currency utilities', () => {
    expect(utilsExports.formatCurrency).toBeDefined();
    expect(utilsExports.convertCurrency).toBeDefined();
    expect(utilsExports.CURRENCIES).toBeDefined();
  });

  it('should export analytics functions', () => {
    expect(utilsExports.trackFormStart).toBeDefined();
    expect(utilsExports.trackFormComplete).toBeDefined();
  });

  it('should export SEO utilities', () => {
    expect(utilsExports.generatePageMetaTags).toBeDefined();
    expect(utilsExports.defaultMetaTags).toBeDefined();
  });
});
