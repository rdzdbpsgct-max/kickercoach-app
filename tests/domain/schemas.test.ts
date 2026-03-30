import { describe, it, expect } from "vitest";
import {
  DrillSchema,
  SessionSchema,
  MatchPlanSchema,
  TacticalSceneSchema,
  CoachCardSchema,
} from "../../src/domain/schemas";

describe("DrillSchema", () => {
  it("validates a valid drill", () => {
    const drill = {
      id: "pull-shot",
      name: "Pull-Shot",
      focusSkill: "Torschuss",
      blocks: [{ type: "work", durationSeconds: 30, note: "Üben" }],
      difficulty: "beginner",
      description: "Ein grundlegender Schuss",
    };
    expect(DrillSchema.safeParse(drill).success).toBe(true);
  });

  it("rejects drill with missing required fields", () => {
    const drill = { id: "test" };
    expect(DrillSchema.safeParse(drill).success).toBe(false);
  });

  it("accepts drill without optional fields", () => {
    const drill = {
      id: "test",
      name: "Test",
      focusSkill: "Schuss",
      blocks: [],
    };
    expect(DrillSchema.safeParse(drill).success).toBe(true);
  });

  it("adds default values for new fields via migration", () => {
    const oldDrill = {
      id: "test",
      name: "Test",
      focusSkill: "Schuss",
      blocks: [],
      difficulty: "beginner",
    };
    const result = DrillSchema.parse(oldDrill);
    expect(result.isCustom).toBe(false);
    expect(result.playerCount).toBe(1);
  });
});

describe("SessionSchema", () => {
  it("validates a valid session", () => {
    const session = {
      id: "s1",
      name: "Morning",
      date: "2026-03-30",
      drillIds: ["pull-shot"],
      notes: "Gut",
      totalDuration: 300,
    };
    expect(SessionSchema.safeParse(session).success).toBe(true);
  });

  it("adds default values for new fields via migration", () => {
    const oldSession = {
      id: "s1",
      name: "Morning",
      date: "2026-03-30",
      drillIds: [],
      notes: "",
      totalDuration: 0,
    };
    const result = SessionSchema.parse(oldSession);
    expect(result.playerIds).toEqual([]);
    expect(result.focusAreas).toEqual([]);
  });
});

describe("MatchPlanSchema", () => {
  it("validates a valid match plan", () => {
    const plan = {
      id: "mp1",
      opponent: "Team X",
      date: "2026-04-01",
      analysis: "Stark auf 3er",
      gameplan: "Serien auf 5er",
      timeoutStrategies: ["Wechsel"],
      notes: "",
    };
    expect(MatchPlanSchema.safeParse(plan).success).toBe(true);
  });
});

describe("TacticalSceneSchema", () => {
  it("validates a scene with all element types", () => {
    const scene = {
      id: "sc1",
      name: "Szene 1",
      createdAt: "2026-03-30T10:00:00Z",
      updatedAt: "2026-03-30T10:00:00Z",
      figures: [
        {
          id: "f1",
          rodIndex: 0,
          team: "red",
          position: { x: 60, y: 340 },
          figureIndex: 0,
        },
      ],
      arrows: [
        {
          id: "a1",
          arrowType: "pass",
          start: { x: 0, y: 0 },
          end: { x: 100, y: 100 },
        },
      ],
      zones: [
        {
          id: "z1",
          shape: "rectangle",
          origin: { x: 50, y: 50 },
          size: { width: 100, height: 100 },
          color: "rgba(59,130,246,0.15)",
        },
      ],
      ball: { id: "ball", position: { x: 600, y: 340 } },
    };
    expect(TacticalSceneSchema.safeParse(scene).success).toBe(true);
  });

  it("accepts scene without ball", () => {
    const scene = {
      id: "sc1",
      name: "Szene 1",
      createdAt: "2026-03-30T10:00:00Z",
      updatedAt: "2026-03-30T10:00:00Z",
      figures: [],
      arrows: [],
      zones: [],
      ball: null,
    };
    expect(TacticalSceneSchema.safeParse(scene).success).toBe(true);
  });
});

describe("CoachCardSchema", () => {
  it("validates a valid coach card", () => {
    const card = {
      id: "c1",
      title: "Pull-Shot",
      summary: "Grundlegend",
      difficulty: "beginner",
      category: "Torschuss",
      tags: ["schuss"],
      steps: ["Schritt 1"],
      commonMistakes: ["Fehler 1"],
      coachCues: ["Tipp 1"],
    };
    expect(CoachCardSchema.safeParse(card).success).toBe(true);
  });
});
