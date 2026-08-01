import "@testing-library/jest-dom";
import { vi } from "vitest";

// Silence React Router future flag warnings in tests
const _origWarn = console.warn;
console.warn = (...args: any[]) => {
  try {
    const msg =
      typeof args[0] === "string" ? args[0] : JSON.stringify(args[0] || "");
    if (msg.includes("React Router Future Flag Warning")) return;
  } catch (e) {
    // ignore
  }
  return _origWarn.apply(console, args as any);
};

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
