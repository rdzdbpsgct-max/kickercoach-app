import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../../src/store/useAppStore";

describe("Goal auto-progress from evaluation", () => {
  beforeEach(() => {
    useAppStore.setState({
      players: [
        {
          id: "p1",
          name: "Test",
          preferredPosition: "both",
          level: "beginner",
          notes: "",
          skillRatings: {
            Torschuss: 3,
            Passspiel: 3,
            Ballkontrolle: 3,
            Defensive: 3,
            Taktik: 3,
            Offensive: 3,
            Mental: 3,
          },
          createdAt: "2024-01-01",
        },
      ],
      goals: [
        {
          id: "g1",
          playerId: "p1",
          title: "Torschuss verbessern",
          category: "Torschuss",
          status: "active",
          targetValue: 80,
          currentValue: 40,
          createdAt: "2024-01-01",
        },
      ],
      evaluations: [],
    });
  });

  it("updates goal currentValue when evaluation matches category", () => {
    useAppStore.getState().addEvaluation({
      id: "e1",
      playerId: "p1",
      date: "2024-06-01",
      skillRatings: [{ category: "Torschuss", rating: 4 }],
      notes: "",
    });
    const goal = useAppStore.getState().goals.find((g) => g.id === "g1");
    expect(goal?.currentValue).toBe(80); // 4 * 20
  });

  it("does not update goal for different category", () => {
    useAppStore.getState().addEvaluation({
      id: "e2",
      playerId: "p1",
      date: "2024-06-01",
      skillRatings: [{ category: "Passspiel", rating: 5 }],
      notes: "",
    });
    const goal = useAppStore.getState().goals.find((g) => g.id === "g1");
    expect(goal?.currentValue).toBe(40); // unchanged
  });
});
