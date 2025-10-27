import { describe, expect, it } from 'vitest';
import { getApiUrl, getCalendarApiKey, getCalendarEmail, isDevelopment, isProduction } from '../../src/utils/env';

describe('env', () => {
  it('should export isDevelopment', () => {
    expect(typeof isDevelopment).toBe('function');
  });

  it('should export isProduction', () => {
    expect(typeof isProduction).toBe('function');
  });

  it('should export getApiUrl', () => {
    expect(getApiUrl).toBeDefined();
    expect(typeof getApiUrl).toBe('function');
  });

  it('should export getCalendarEmail', () => {
    expect(getCalendarEmail).toBeDefined();
    expect(typeof getCalendarEmail).toBe('function');
  });

  it('should export getCalendarApiKey', () => {
    expect(getCalendarApiKey).toBeDefined();
    expect(typeof getCalendarApiKey).toBe('function');
  });

  it('should return string for getApiUrl', () => {
    const url = getApiUrl();
    expect(typeof url).toBe('string');
  });

  it('should return string for getCalendarEmail', () => {
    const email = getCalendarEmail();
    expect(typeof email).toBe('string');
  });
});
