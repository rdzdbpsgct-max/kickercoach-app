import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../../src/store";

describe("Training plan operations", () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState());
  });

  const basePlan = {
    id: "tp1",
    name: "Pre-season plan",
    playerIds: ["p1"],
    weeks: [
      {
        weekNumber: 1,
        sessionTemplates: [
          { name: "Warm-up drill", drillIds: ["d1"], focusAreas: [] },
        ],
      },
    ],
    goal: "Build fundamentals",
    createdAt: "2026-01-01",
  };

  describe("addTrainingPlan", () => {
    it("adds a training plan to the store", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      const plans = useAppStore.getState().trainingPlans;
      expect(plans).toHaveLength(1);
      expect(plans[0].id).toBe("tp1");
      expect(plans[0].name).toBe("Pre-season plan");
    });

    it("adds multiple training plans", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      useAppStore
        .getState()
        .addTrainingPlan({ ...basePlan, id: "tp2", name: "In-season plan" });
      expect(useAppStore.getState().trainingPlans).toHaveLength(2);
    });
  });

  describe("updateTrainingPlan", () => {
    it("updates a training plan by id", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      useAppStore
        .getState()
        .updateTrainingPlan("tp1", { name: "Updated plan" });
      expect(useAppStore.getState().trainingPlans[0].name).toBe(
        "Updated plan",
      );
    });

    it("does not modify other plans", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      useAppStore
        .getState()
        .addTrainingPlan({ ...basePlan, id: "tp2", name: "Second plan" });
      useAppStore.getState().updateTrainingPlan("tp1", { name: "Changed" });
      expect(useAppStore.getState().trainingPlans[1].name).toBe("Second plan");
    });

    it("updates weeks structure", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      const newWeeks = [
        {
          weekNumber: 1,
          sessionTemplates: [
            { name: "New drill", drillIds: ["d2", "d3"], focusAreas: [] },
          ],
        },
        {
          weekNumber: 2,
          sessionTemplates: [],
        },
      ];
      useAppStore.getState().updateTrainingPlan("tp1", { weeks: newWeeks });
      expect(useAppStore.getState().trainingPlans[0].weeks).toHaveLength(2);
    });
  });

  describe("deleteTrainingPlan", () => {
    it("removes a training plan by id", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      useAppStore.getState().deleteTrainingPlan("tp1");
      expect(useAppStore.getState().trainingPlans).toHaveLength(0);
    });

    it("only removes the targeted plan", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      useAppStore
        .getState()
        .addTrainingPlan({ ...basePlan, id: "tp2", name: "Keep this" });
      useAppStore.getState().deleteTrainingPlan("tp1");
      const plans = useAppStore.getState().trainingPlans;
      expect(plans).toHaveLength(1);
      expect(plans[0].id).toBe("tp2");
    });
  });

  describe("markPlanSessionCompleted", () => {
    it("adds a session id to completedSessionIds", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      useAppStore.getState().markPlanSessionCompleted("tp1", "s1");
      const plan = useAppStore.getState().trainingPlans[0];
      expect(plan.completedSessionIds).toContain("s1");
    });

    it("accumulates multiple completed sessions", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      useAppStore.getState().markPlanSessionCompleted("tp1", "s1");
      useAppStore.getState().markPlanSessionCompleted("tp1", "s2");
      const plan = useAppStore.getState().trainingPlans[0];
      expect(plan.completedSessionIds).toEqual(["s1", "s2"]);
    });

    it("does not affect other plans", () => {
      useAppStore.getState().addTrainingPlan(basePlan);
      useAppStore
        .getState()
        .addTrainingPlan({ ...basePlan, id: "tp2", name: "Other" });
      useAppStore.getState().markPlanSessionCompleted("tp1", "s1");
      const otherPlan = useAppStore.getState().trainingPlans[1];
      expect(otherPlan.completedSessionIds ?? []).toEqual([]);
    });

    it("works when completedSessionIds is initially undefined", () => {
      const planNoCompleted = { ...basePlan };
      delete (planNoCompleted as Record<string, unknown>).completedSessionIds;
      useAppStore.getState().addTrainingPlan(planNoCompleted);
      useAppStore.getState().markPlanSessionCompleted("tp1", "s1");
      const plan = useAppStore.getState().trainingPlans[0];
      expect(plan.completedSessionIds).toContain("s1");
    });
  });
});
