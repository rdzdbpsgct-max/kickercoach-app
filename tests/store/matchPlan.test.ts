import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../../src/store";

describe("Match plan CRUD", () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState());
  });

  const basePlan = {
    id: "mp1",
    opponent: "Team Alpha",
    date: "2026-04-01",
    analysis: "Strong on defense",
    gameplan: "Press high",
    timeoutStrategies: ["Switch sides"],
    notes: "Watch #7",
  };

  describe("addMatchPlan", () => {
    it("adds a match plan to the store", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      const plans = useAppStore.getState().matchPlans;
      expect(plans).toHaveLength(1);
      expect(plans[0]).toEqual(basePlan);
    });

    it("adds multiple match plans", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      useAppStore
        .getState()
        .addMatchPlan({ ...basePlan, id: "mp2", opponent: "Team Beta" });
      expect(useAppStore.getState().matchPlans).toHaveLength(2);
    });
  });

  describe("updateMatchPlan", () => {
    it("updates a match plan by id", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      useAppStore
        .getState()
        .updateMatchPlan("mp1", { opponent: "Team Bravo" });
      expect(useAppStore.getState().matchPlans[0].opponent).toBe("Team Bravo");
    });

    it("updates analysis and gameplan", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      useAppStore.getState().updateMatchPlan("mp1", {
        analysis: "Weak in midfield",
        gameplan: "Control possession",
      });
      const plan = useAppStore.getState().matchPlans[0];
      expect(plan.analysis).toBe("Weak in midfield");
      expect(plan.gameplan).toBe("Control possession");
    });

    it("does not modify other plans", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      useAppStore
        .getState()
        .addMatchPlan({ ...basePlan, id: "mp2", opponent: "Team Beta" });
      useAppStore
        .getState()
        .updateMatchPlan("mp1", { opponent: "Changed" });
      expect(useAppStore.getState().matchPlans[1].opponent).toBe("Team Beta");
    });

    it("updates optional strategy fields", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      useAppStore.getState().updateMatchPlan("mp1", {
        offensiveStrategy: "Counter-attack",
        defensiveStrategy: "Zone defense",
        result: "win",
      });
      const plan = useAppStore.getState().matchPlans[0];
      expect(plan.offensiveStrategy).toBe("Counter-attack");
      expect(plan.defensiveStrategy).toBe("Zone defense");
      expect(plan.result).toBe("win");
    });
  });

  describe("deleteMatchPlan", () => {
    it("removes a match plan by id", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      useAppStore.getState().deleteMatchPlan("mp1");
      expect(useAppStore.getState().matchPlans).toHaveLength(0);
    });

    it("only removes the targeted plan", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      useAppStore
        .getState()
        .addMatchPlan({ ...basePlan, id: "mp2", opponent: "Keep" });
      useAppStore.getState().deleteMatchPlan("mp1");
      const plans = useAppStore.getState().matchPlans;
      expect(plans).toHaveLength(1);
      expect(plans[0].id).toBe("mp2");
    });

    it("is a no-op for non-existent id", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      useAppStore.getState().deleteMatchPlan("nonexistent");
      expect(useAppStore.getState().matchPlans).toHaveLength(1);
    });
  });

  describe("setMatchPlans", () => {
    it("replaces all match plans", () => {
      useAppStore.getState().addMatchPlan(basePlan);
      useAppStore.getState().setMatchPlans([
        { ...basePlan, id: "mp3", opponent: "New Team" },
      ]);
      const plans = useAppStore.getState().matchPlans;
      expect(plans).toHaveLength(1);
      expect(plans[0].id).toBe("mp3");
    });
  });
});
