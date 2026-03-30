import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../../src/store";

describe("useAppStore", () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState());
  });

  describe("sessions", () => {
    it("starts with empty sessions", () => {
      expect(useAppStore.getState().sessions).toEqual([]);
    });

    it("adds a session", () => {
      const session = {
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
        playerIds: [],
        focusAreas: [],
      };
      useAppStore.getState().addSession(session);
      expect(useAppStore.getState().sessions).toHaveLength(1);
      expect(useAppStore.getState().sessions[0].id).toBe("s1");
    });

    it("updates a session", () => {
      const session = {
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
        playerIds: [],
        focusAreas: [],
      };
      useAppStore.getState().addSession(session);
      useAppStore.getState().updateSession("s1", { name: "Updated" });
      expect(useAppStore.getState().sessions[0].name).toBe("Updated");
    });

    it("deletes a session", () => {
      const session = {
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
        playerIds: [],
        focusAreas: [],
      };
      useAppStore.getState().addSession(session);
      useAppStore.getState().deleteSession("s1");
      expect(useAppStore.getState().sessions).toEqual([]);
    });
  });

  describe("matchPlans", () => {
    it("starts with empty matchPlans", () => {
      expect(useAppStore.getState().matchPlans).toEqual([]);
    });

    it("adds a match plan", () => {
      const plan = {
        id: "mp1",
        opponent: "Team X",
        date: "2026-04-01",
        analysis: "",
        gameplan: "",
        timeoutStrategies: [],
        notes: "",
      };
      useAppStore.getState().addMatchPlan(plan);
      expect(useAppStore.getState().matchPlans).toHaveLength(1);
    });
  });

  describe("favorites", () => {
    it("toggles favorites", () => {
      useAppStore.getState().toggleFavorite("card-1");
      expect(useAppStore.getState().favorites).toContain("card-1");

      useAppStore.getState().toggleFavorite("card-1");
      expect(useAppStore.getState().favorites).not.toContain("card-1");
    });

    it("checks isFavorite", () => {
      useAppStore.getState().toggleFavorite("card-1");
      expect(useAppStore.getState().isFavorite("card-1")).toBe(true);
      expect(useAppStore.getState().isFavorite("card-2")).toBe(false);
    });
  });

  describe("players", () => {
    it("starts with empty players", () => {
      expect(useAppStore.getState().players).toEqual([]);
    });

    it("adds a player", () => {
      const player = {
        id: "p1",
        name: "Max",
        preferredPosition: "offense" as const,
        level: "beginner" as const,
        notes: "",
        skillRatings: {
          Torschuss: 3,
          Passspiel: 2,
          Ballkontrolle: 2,
          Defensive: 1,
          Taktik: 2,
          Offensive: 3,
          Mental: 2,
        },
        createdAt: "2026-03-30",
      };
      useAppStore.getState().addPlayer(player);
      expect(useAppStore.getState().players).toHaveLength(1);
    });
  });

  describe("selectors", () => {
    it("getPlayerSessions returns sessions for a player", () => {
      useAppStore.getState().addSession({
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 300,
        playerIds: ["p1"],
        focusAreas: [],
      });
      useAppStore.getState().addSession({
        id: "s2",
        name: "Other",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 300,
        playerIds: ["p2"],
        focusAreas: [],
      });

      const result = useAppStore.getState().getPlayerSessions("p1");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("s1");
    });
  });
});
