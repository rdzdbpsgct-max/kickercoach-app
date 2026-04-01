import { describe, it, expect } from "vitest";
import { MatchSchema } from "../../src/domain/schemas/match";
import { PlayerTechniqueSchema } from "../../src/domain/schemas/playerTechnique";
import { EvaluationSchema } from "../../src/domain/schemas/evaluation";
import { CoachingNoteSchema } from "../../src/domain/schemas/coachingNote";

describe("MatchSchema", () => {
  it("validates a complete match", () => {
    const match = {
      id: "m1",
      opponent: "Team B",
      date: "2024-06-01",
      sets: [{ setNumber: 1, scoreHome: 5, scoreAway: 3 }],
      playerIds: ["p1"],
      createdAt: "2024-06-01T10:00:00Z",
    };
    const result = MatchSchema.safeParse(match);
    expect(result.success).toBe(true);
  });

  it("rejects match without opponent", () => {
    const match = {
      id: "m1",
      date: "2024-06-01",
      sets: [],
      playerIds: [],
      createdAt: "2024-06-01",
    };
    const result = MatchSchema.safeParse(match);
    expect(result.success).toBe(false);
  });
});

describe("PlayerTechniqueSchema", () => {
  it("validates a technique entry", () => {
    const pt = {
      id: "pt1",
      playerId: "p1",
      techniqueId: "t1",
      status: "learning",
    };
    expect(PlayerTechniqueSchema.safeParse(pt).success).toBe(true);
  });

  it("rejects invalid status", () => {
    const pt = {
      id: "pt1",
      playerId: "p1",
      techniqueId: "t1",
      status: "unknown",
    };
    expect(PlayerTechniqueSchema.safeParse(pt).success).toBe(false);
  });
});

describe("EvaluationSchema extended fields", () => {
  it("accepts evaluation with type and overallRating", () => {
    const ev = {
      id: "e1",
      playerId: "p1",
      date: "2024-06-01",
      skillRatings: [{ category: "Torschuss", rating: 4 }],
      notes: "Good",
      type: "session",
      overallRating: 4,
    };
    expect(EvaluationSchema.safeParse(ev).success).toBe(true);
  });

  it("accepts evaluation with techniqueRatings", () => {
    const ev = {
      id: "e1",
      playerId: "p1",
      date: "2024-06-01",
      skillRatings: [],
      notes: "",
      techniqueRatings: [{ techniqueId: "t1", rating: 3, successRate: 75 }],
    };
    expect(EvaluationSchema.safeParse(ev).success).toBe(true);
  });
});

describe("CoachingNoteSchema extended fields", () => {
  it("accepts note with priority and tags", () => {
    const note = {
      id: "n1",
      date: "2024-06-01",
      category: "tactical",
      text: "Work on passing",
      priority: "high",
      tags: ["passing", "urgent"],
      resolved: false,
    };
    expect(CoachingNoteSchema.safeParse(note).success).toBe(true);
  });

  it("rejects invalid priority", () => {
    const note = {
      id: "n1",
      date: "2024-06-01",
      category: "tactical",
      text: "Test",
      priority: "critical",
    };
    expect(CoachingNoteSchema.safeParse(note).success).toBe(false);
  });
});
