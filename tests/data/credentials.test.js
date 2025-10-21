import { describe, expect, it } from 'vitest';
import { CREDENTIALS } from '../../src/data/credentials';

describe('credentials', () => {
  it('should export CREDENTIALS array', () => {
    expect(CREDENTIALS).toBeDefined();
    expect(Array.isArray(CREDENTIALS)).toBe(true);
    expect(CREDENTIALS.length).toBeGreaterThan(0);
  });

  it('should have valid credential structure', () => {
    CREDENTIALS.forEach((credential) => {
      expect(credential).toHaveProperty('icon');
      expect(credential).toHaveProperty('title');
      expect(credential).toHaveProperty('description');
    });
  });

  it('should have PADI 5 Star credential', () => {
    const padi = CREDENTIALS.find((c) => c.title.includes('PADI 5 Star'));
    expect(padi).toBeDefined();
  });
});
