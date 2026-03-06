import '@testing-library/jest-dom/vitest';

// Polyfill ResizeObserver for jsdom (required by Carbon's ComposedModal)
global.ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(): void {
    // noop
  }

  unobserve(): void {
    // noop
  }

  disconnect(): void {
    // noop
  }
};
