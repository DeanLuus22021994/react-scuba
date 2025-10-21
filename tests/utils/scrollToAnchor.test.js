import { describe, expect, it, vi } from 'vitest';
import { scrollToAnchor } from '../../../src/utils/scrollToAnchor';

describe('scrollToAnchor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export scrollToAnchor function', () => {
    expect(scrollToAnchor).toBeDefined();
    expect(typeof scrollToAnchor).toBe('function');
  });

  it('should handle valid anchor id', () => {
    const mockElement = {
      scrollIntoView: vi.fn(),
    };
    document.getElementById = vi.fn(() => mockElement);

    scrollToAnchor('test-anchor');
    expect(document.getElementById).toHaveBeenCalledWith('test-anchor');
  });

  it('should handle missing anchor', () => {
    document.getElementById = vi.fn(() => null);
    expect(() => scrollToAnchor('missing-anchor')).not.toThrow();
  });

  it('should handle empty string', () => {
    expect(() => scrollToAnchor('')).not.toThrow();
  });
});
