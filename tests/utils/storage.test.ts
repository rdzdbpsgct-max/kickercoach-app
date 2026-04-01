import { describe, it, expect, beforeEach } from "vitest";
import { getStorageUsage } from "../../src/utils/storage";

describe("getStorageUsage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns zero usage when localStorage is empty", () => {
    const usage = getStorageUsage();
    expect(usage.usedBytes).toBe(0);
    expect(usage.usedKB).toBe(0);
    expect(usage.percentUsed).toBe(0);
  });

  it("calculates usage after adding data", () => {
    localStorage.setItem("test", "hello");
    const usage = getStorageUsage();
    // "test" (4 chars) + "hello" (5 chars) = 9 chars * 2 bytes = 18 bytes
    expect(usage.usedBytes).toBeGreaterThan(0);
    expect(usage.estimatedLimitMB).toBe(5);
  });

  it("increases usage with more data", () => {
    localStorage.setItem("a", "x");
    const usage1 = getStorageUsage();
    localStorage.setItem("b", "y".repeat(1000));
    const usage2 = getStorageUsage();
    expect(usage2.usedBytes).toBeGreaterThan(usage1.usedBytes);
  });
});
