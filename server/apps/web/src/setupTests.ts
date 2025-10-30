// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock localStorage for tests
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

globalThis.localStorage = new LocalStorageMock();
globalThis.sessionStorage = new LocalStorageMock();

// Mock IntersectionObserver for tests
globalThis.IntersectionObserver = class IntersectionObserver {
  root: Element | Document | null = null;
  rootMargin: string = '0px';
  scrollMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];
  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit | undefined;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    if (options) {
      this.root = options.root ?? null;
      this.rootMargin = options.rootMargin ?? '0px';
      this.scrollMargin = (options as any).scrollMargin ?? '0px';
      this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold ?? 0];
    }
  }

  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve(): void {}
} as any;

// Mock ResizeObserver for tests
globalThis.ResizeObserver = class ResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
