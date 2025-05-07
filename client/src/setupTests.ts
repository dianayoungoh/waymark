import "@testing-library/jest-dom";
// Mock ResizeObserver for Recharts / layout-based components
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  // @ts-ignore
  global.ResizeObserver = ResizeObserver;