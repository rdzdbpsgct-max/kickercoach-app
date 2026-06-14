import "@testing-library/jest-dom/vitest";
// Initialize i18n so components' t() resolves real strings instead of raw keys,
// and pin the language to German so assertions on German UI strings are
// deterministic regardless of the jsdom navigator locale.
import i18n from "../src/i18n";
i18n.changeLanguage("de");

// jsdom's localStorage doesn't work properly with zustand persist middleware.
// Provide a working in-memory implementation.
const store: Record<string, string> = {};
const localStorageMock: Storage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    for (const key of Object.keys(store)) delete store[key];
  },
  get length() {
    return Object.keys(store).length;
  },
  key: (index: number) => Object.keys(store)[index] ?? null,
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});
