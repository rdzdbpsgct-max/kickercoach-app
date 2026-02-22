import { describe, it, expect } from "vitest";
import { formatTime, computeRemaining } from "../../src/domain/logic/time";

describe("formatTime", () => {
  it("formats 0 seconds", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats seconds under a minute", () => {
    expect(formatTime(45)).toBe("00:45");
  });

  it("formats exact minutes", () => {
    expect(formatTime(120)).toBe("02:00");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(185)).toBe("03:05");
  });

  it("handles negative values", () => {
    expect(formatTime(-5)).toBe("00:00");
  });

  it("formats large values", () => {
    expect(formatTime(3661)).toBe("61:01");
  });
});

describe("computeRemaining", () => {
  it("returns full duration when no time elapsed", () => {
    expect(computeRemaining(60, 0)).toBe(60);
  });

  it("computes remaining time correctly", () => {
    expect(computeRemaining(60, 30000)).toBe(30);
  });

  it("returns 0 when elapsed exceeds duration", () => {
    expect(computeRemaining(60, 61000)).toBe(0);
  });

  it("returns 0 when exactly elapsed", () => {
    expect(computeRemaining(60, 60000)).toBe(0);
  });

  it("rounds up to next second", () => {
    expect(computeRemaining(60, 59100)).toBe(1);
  });
});
