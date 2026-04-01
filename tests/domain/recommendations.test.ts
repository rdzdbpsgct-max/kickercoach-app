import { describe, it, expect } from "vitest";
import { getRecommendedDrillIds, getWeakCategories } from "../../src/domain/logic/recommendations";
import type { Player } from "../../src/domain/models/Player";
import type { Drill } from "../../src/domain/models/Drill";

const makePlayer = (skills: Record<string, number>): Player => ({
  id: "p1",
  name: "Test",
  preferredPosition: "both",
  level: "beginner",
  notes: "",
  skillRatings: skills as Player["skillRatings"],
  createdAt: "2024-01-01",
});

const makeDrill = (id: string, category?: string, difficulty?: string): Drill => ({
  id,
  name: `Drill ${id}`,
  focusSkill: category ?? "Allgemein",
  blocks: [{ type: "work", durationSeconds: 30, note: "" }],
  category: category as Drill["category"],
  difficulty: (difficulty ?? "beginner") as Drill["difficulty"],
});

describe("getWeakCategories", () => {
  it("returns categories sorted by lowest rating first", () => {
    const player = makePlayer({
      Torschuss: 5,
      Passspiel: 2,
      Defensive: 1,
      Ballkontrolle: 3,
      Taktik: 4,
    });
    const result = getWeakCategories(player, 3);
    expect(result).toEqual(["Defensive", "Passspiel", "Ballkontrolle"]);
  });

  it("respects count parameter", () => {
    const player = makePlayer({
      Torschuss: 5,
      Passspiel: 2,
      Defensive: 1,
    });
    expect(getWeakCategories(player, 1)).toHaveLength(1);
    expect(getWeakCategories(player, 1)[0]).toBe("Defensive");
  });

  it("handles player with empty skill ratings", () => {
    const player = makePlayer({});
    expect(getWeakCategories(player)).toEqual([]);
  });
});

describe("getRecommendedDrillIds", () => {
  it("recommends drills matching weak categories", () => {
    const player = makePlayer({
      Torschuss: 5,
      Passspiel: 1,
      Defensive: 2,
      Ballkontrolle: 4,
    });
    const drills = [
      makeDrill("d1", "Passspiel", "beginner"),
      makeDrill("d2", "Torschuss", "beginner"),
      makeDrill("d3", "Defensive", "beginner"),
    ];
    const result = getRecommendedDrillIds(player, drills);
    // Passspiel (weakest) drill should rank first
    expect(result[0]).toBe("d1");
    // Defensive (2nd weakest) should rank before Torschuss
    expect(result.indexOf("d3")).toBeLessThan(result.indexOf("d2"));
  });

  it("respects maxResults", () => {
    const player = makePlayer({ Torschuss: 1, Passspiel: 2, Defensive: 3 });
    const drills = [
      makeDrill("d1", "Torschuss"),
      makeDrill("d2", "Passspiel"),
      makeDrill("d3", "Defensive"),
    ];
    expect(getRecommendedDrillIds(player, drills, 2)).toHaveLength(2);
  });

  it("boosts drills matching player difficulty level", () => {
    const player = makePlayer({ Torschuss: 1, Passspiel: 1 });
    const drills = [
      makeDrill("d1", "Torschuss", "advanced"),
      makeDrill("d2", "Torschuss", "beginner"),
    ];
    const result = getRecommendedDrillIds(player, drills);
    // d2 should rank higher due to difficulty match
    expect(result[0]).toBe("d2");
  });

  it("returns empty when no drills exist", () => {
    const player = makePlayer({ Torschuss: 5, Passspiel: 5, Defensive: 5 });
    expect(getRecommendedDrillIds(player, [])).toEqual([]);
  });
});
