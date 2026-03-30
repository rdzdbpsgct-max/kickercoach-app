import { describe, it, expect } from "vitest";
import { PlayerSchema, DEFAULT_SKILL_RATINGS } from "../../src/domain/schemas/player";

describe("PlayerSchema", () => {
  it("validates a complete player", () => {
    const player = {
      id: "p1",
      name: "Max Mustermann",
      nickname: "Maxi",
      preferredPosition: "offense",
      level: "intermediate",
      notes: "Starker Pull-Shot",
      skillRatings: {
        Torschuss: 4,
        Passspiel: 3,
        Ballkontrolle: 3,
        Defensive: 2,
        Taktik: 3,
        Offensive: 4,
        Mental: 3,
      },
      avatarColor: "#3b82f6",
      createdAt: "2026-03-30",
    };
    expect(PlayerSchema.safeParse(player).success).toBe(true);
  });

  it("applies default skill ratings", () => {
    const player = {
      id: "p1",
      name: "Min",
      preferredPosition: "both",
      level: "beginner",
      notes: "",
      createdAt: "2026-03-30",
    };
    const result = PlayerSchema.parse(player);
    expect(result.skillRatings).toEqual(DEFAULT_SKILL_RATINGS);
  });

  it("rejects invalid position", () => {
    const player = {
      id: "p1",
      name: "Test",
      preferredPosition: "goalkeeper",
      level: "beginner",
      notes: "",
      skillRatings: DEFAULT_SKILL_RATINGS,
      createdAt: "2026-03-30",
    };
    expect(PlayerSchema.safeParse(player).success).toBe(false);
  });

  it("rejects skill ratings outside 1-5", () => {
    const player = {
      id: "p1",
      name: "Test",
      preferredPosition: "offense",
      level: "beginner",
      notes: "",
      skillRatings: { ...DEFAULT_SKILL_RATINGS, Torschuss: 6 },
      createdAt: "2026-03-30",
    };
    expect(PlayerSchema.safeParse(player).success).toBe(false);
  });
});
