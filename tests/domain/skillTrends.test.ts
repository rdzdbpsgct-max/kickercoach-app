import { describe, it, expect } from "vitest";
import { buildSkillTrends } from "../../src/domain/logic/skillTrends";
import type { Evaluation } from "../../src/domain/models/Evaluation";

function ev(date: string, ratings: Record<string, number>): Evaluation {
  return {
    id: date,
    playerId: "p1",
    date,
    notes: "",
    skillRatings: Object.entries(ratings).map(([category, rating]) => ({
      category: category as never,
      rating,
    })),
  };
}

describe("buildSkillTrends", () => {
  it("sorts evaluations by date and lists their dates", () => {
    const { dates } = buildSkillTrends([
      ev("2026-03-01", { Torschuss: 3 }),
      ev("2026-01-01", { Torschuss: 2 }),
    ]);
    expect(dates).toEqual(["2026-01-01", "2026-03-01"]);
  });

  it("produces one trend per rated category with a value per date", () => {
    const { trends } = buildSkillTrends([
      ev("2026-01-01", { Torschuss: 2, Passspiel: 4 }),
      ev("2026-02-01", { Torschuss: 3, Passspiel: 4 }),
    ]);
    const torschuss = trends.find((t) => t.category === "Torschuss");
    expect(torschuss?.ratings).toEqual([2, 3]);
    expect(trends.every((t) => t.ratings.length === 2)).toBe(true);
  });

  it("omits categories that were never rated", () => {
    const { trends } = buildSkillTrends([ev("2026-01-01", { Torschuss: 2 })]);
    expect(trends.map((t) => t.category)).toEqual(["Torschuss"]);
  });

  it("forward-fills missing ratings so lines have no gaps", () => {
    const { trends } = buildSkillTrends([
      ev("2026-01-01", { Torschuss: 2 }),
      ev("2026-02-01", { Passspiel: 5 }), // Torschuss missing here
    ]);
    const torschuss = trends.find((t) => t.category === "Torschuss");
    expect(torschuss?.ratings).toEqual([2, 2]); // carried forward
  });

  it("returns empty trends for no evaluations", () => {
    expect(buildSkillTrends([])).toEqual({ dates: [], trends: [] });
  });
});
