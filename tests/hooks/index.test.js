import { describe, expect, it } from 'vitest';
import * as hooksExports from '../../src/hooks/index';

describe('hooks/index', () => {
  it('should export useCurrency', () => {
    expect(hooksExports.useCurrency).toBeDefined();
  });

  it('should export CurrencyProvider', () => {
    expect(hooksExports.CurrencyProvider).toBeDefined();
  });
});
