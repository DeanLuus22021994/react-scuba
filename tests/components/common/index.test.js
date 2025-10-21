import { describe, expect, it } from 'vitest';
import * as commonExports from '@/components/common/index';

describe('components/common/index', () => {
  it('should export CurrencySelector', () => {
    expect(commonExports.CurrencySelector).toBeDefined();
  });

  it('should export ErrorBoundary', () => {
    expect(commonExports.ErrorBoundary).toBeDefined();
  });

  it('should export Loading', () => {
    expect(commonExports.Loading).toBeDefined();
  });

  it('should export PhoneLink', () => {
    expect(commonExports.PhoneLink).toBeDefined();
  });

  it('should export SEO', () => {
    expect(commonExports.SEO).toBeDefined();
  });

  it('should export WhatsAppButton', () => {
    expect(commonExports.WhatsAppButton).toBeDefined();
  });
});
