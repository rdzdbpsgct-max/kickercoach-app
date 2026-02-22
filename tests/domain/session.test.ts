import { describe, it, expect } from "vitest";
import {
  calculateSessionStats,
  calculateSessionDuration,
} from "../../src/domain/logic/session";
import type { Session } from "../../src/domain/models/Session";
import type { Drill } from "../../src/domain/models/Drill";

const sessions: Session[] = [
  {
    id: "s1",
    name: "Session 1",
    date: "2025-01-15",
    drillIds: ["d1"],
    notes: "",
    totalDuration: 1200,
  },
  {
    id: "s2",
    name: "Session 2",
    date: "2025-01-16",
    drillIds: ["d1", "d2"],
    notes: "",
    totalDuration: 1800,
  },
  {
    id: "s3",
    name: "Session 3",
    date: "2025-01-17",
    drillIds: ["d2"],
    notes: "",
    totalDuration: 600,
  },
];

const drills: Drill[] = [
  {
    id: "d1",
    name: "Drill 1",
    focusSkill: "Pull",
    blocks: [{ type: "work", durationSeconds: 120, note: "" }],
  },
  {
    id: "d2",
    name: "Drill 2",
    focusSkill: "Pin",
    blocks: [
      { type: "work", durationSeconds: 60, note: "" },
      { type: "rest", durationSeconds: 30, note: "" },
    ],
  },
];

describe("calculateSessionStats", () => {
  it("calculates correct stats", () => {
    const stats = calculateSessionStats(sessions);
    expect(stats.totalSessions).toBe(3);
    expect(stats.totalMinutes).toBe(60);
    expect(stats.averageMinutes).toBe(20);
    expect(stats.longestSession).toBe(30);
  });

  it("handles empty sessions", () => {
    const stats = calculateSessionStats([]);
    expect(stats.totalSessions).toBe(0);
    expect(stats.totalMinutes).toBe(0);
    expect(stats.averageMinutes).toBe(0);
    expect(stats.longestSession).toBe(0);
  });
});

describe("calculateSessionDuration", () => {
  it("sums drill durations for given IDs", () => {
    expect(calculateSessionDuration(["d1", "d2"], drills)).toBe(210);
  });

  it("handles unknown drill IDs gracefully", () => {
    expect(calculateSessionDuration(["d1", "unknown"], drills)).toBe(120);
  });

  it("returns 0 for empty list", () => {
    expect(calculateSessionDuration([], drills)).toBe(0);
  });
});
