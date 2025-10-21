import { describe, expect, it, vi } from 'vitest';
import { scrollToElement, scrollToTop } from '@/utils/scrollToAnchor';

describe('scrollToAnchor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export scrollToElement function', () => {
    expect(scrollToElement).toBeDefined();
    expect(typeof scrollToElement).toBe('function');
  });

  it('should handle valid anchor id', () => {
    const mockElement = {
      getBoundingClientRect: () => ({ top: 100 }),
      setAttribute: vi.fn(),
      focus: vi.fn(),
    };
    document.getElementById = vi.fn(() => mockElement);

    scrollToElement('test-anchor');
    expect(document.getElementById).toHaveBeenCalledWith('test-anchor');
  });

  it('should handle missing anchor', () => {
    document.getElementById = vi.fn(() => null);
    expect(() => scrollToElement('missing-anchor')).not.toThrow();
  });

  it('should export scrollToTop', () => {
    expect(scrollToTop).toBeDefined();
    expect(typeof scrollToTop).toBe('function');
  });
});
