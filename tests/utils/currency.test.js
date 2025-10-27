import { describe, expect, it } from 'vitest';
import { convertCurrency, CURRENCIES, formatCurrency } from '../../src/utils/currency.js';

describe('currency', () => {
  it('should export CURRENCIES', () => {
    expect(CURRENCIES).toBeDefined();
    expect(typeof CURRENCIES).toBe('object');
  });

  it('should have USD currency', () => {
    expect(CURRENCIES.USD).toBeDefined();
    expect(CURRENCIES.USD).toHaveProperty('symbol');
    expect(CURRENCIES.USD).toHaveProperty('name');
  });

  it('should export formatCurrency', () => {
    expect(formatCurrency).toBeDefined();
    expect(typeof formatCurrency).toBe('function');
  });

  it('should export convertCurrency', () => {
    expect(convertCurrency).toBeDefined();
    expect(typeof convertCurrency).toBe('function');
  });

  it('should format currency correctly', () => {
    const formatted = formatCurrency(1000, 'USD');
    expect(formatted).toContain('$');
    expect(formatted).toContain('1');
  });

  it('should convert currency with rates', () => {
    const rates = { USD: 1, EUR: 0.85 };
    const converted = convertCurrency(100, 'USD', 'EUR', rates);
    expect(converted).toBe(85);
  });

  it('should return same amount for same currency', () => {
    const rates = { USD: 1 };
    const converted = convertCurrency(100, 'USD', 'USD', rates);
    expect(converted).toBe(100);
  });
});
