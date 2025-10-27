import { describe, expect, it } from 'vitest';
import {
  DIFFICULTY_COLORS,
  DIVE_SITES,
  getDiveSiteById,
  MAURITIUS_CENTER,
} from '../../src/config/constants/index.ts';

describe('diveSites', () => {
  it('should export DIVE_SITES array', () => {
    expect(DIVE_SITES).toBeDefined();
    expect(Array.isArray(DIVE_SITES)).toBe(true);
    expect(DIVE_SITES.length).toBeGreaterThan(0);
  });

  it('should export MAURITIUS_CENTER', () => {
    expect(MAURITIUS_CENTER).toBeDefined();
    expect(Array.isArray(MAURITIUS_CENTER)).toBe(true);
    expect(MAURITIUS_CENTER).toHaveLength(2);
  });

  it('should export DIFFICULTY_COLORS', () => {
    expect(DIFFICULTY_COLORS).toBeDefined();
    expect(DIFFICULTY_COLORS).toHaveProperty('Beginner');
    expect(DIFFICULTY_COLORS).toHaveProperty('Intermediate');
    expect(DIFFICULTY_COLORS).toHaveProperty('Advanced');
  });

  it('should have valid dive site structure', () => {
    DIVE_SITES.forEach((site) => {
      expect(site).toHaveProperty('id');
      expect(site).toHaveProperty('name');
      expect(site).toHaveProperty('coordinates');
      expect(site).toHaveProperty('depth');
      expect(site).toHaveProperty('visibility');
      expect(site).toHaveProperty('difficulty');
      expect(site).toHaveProperty('marineLife');
      expect(site).toHaveProperty('description');
    });
  });

  it('should export getDiveSiteById function', () => {
    expect(getDiveSiteById).toBeDefined();
    expect(typeof getDiveSiteById).toBe('function');
  });
});
