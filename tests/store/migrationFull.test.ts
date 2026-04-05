import { describe, it, expect } from "vitest";

/**
 * Test the migration logic extracted from useAppStore's persist config.
 * We replicate the migrate function here to test it in isolation
 * without needing to go through zustand persist hydration.
 */

import { migrateArray } from "../../src/store/migrate";
import { SessionSchema } from "../../src/domain/schemas/session";
import { MatchPlanSchema } from "../../src/domain/schemas/matchPlan";
import { TacticalSceneSchema } from "../../src/domain/schemas/tacticalBoard";

// Replicate the migration logic from useAppStore.ts for testability
function migrate(
  persistedState: Record<string, unknown>,
  version: number | undefined,
): Record<string, unknown> {
  const state = { ...persistedState };

  if (version === 0 || version === undefined) {
    Object.assign(state, {
      sessions: migrateArray(state.sessions, SessionSchema),
      matchPlans: migrateArray(state.matchPlans, MatchPlanSchema),
      boardScenes: migrateArray(state.boardScenes, TacticalSceneSchema),
      players: state.players ?? [],
      favorites: Array.isArray(state.favorites) ? state.favorites : [],
      goals: state.goals ?? [],
      customDrills: Array.isArray(state.customDrills)
        ? state.customDrills
        : [],
      evaluations: Array.isArray(state.evaluations) ? state.evaluations : [],
      coachingNotes: Array.isArray(state.coachingNotes)
        ? state.coachingNotes
        : [],
      trainingPlans: Array.isArray(state.trainingPlans)
        ? state.trainingPlans
        : [],
      drillTemplates: Array.isArray(state.drillTemplates)
        ? state.drillTemplates
        : [],
      sessionTemplates: Array.isArray(state.sessionTemplates)
        ? state.sessionTemplates
        : [],
    });
  }

  // v1 -> v2
  if ((version ?? 0) < 2) {
    if (Array.isArray(state.sessions)) {
      state.sessions = (state.sessions as Record<string, unknown>[]).map(
        (s) => ({
          ...s,
          playerIds: s.playerIds ?? [],
          focusAreas: s.focusAreas ?? [],
          createdAt: s.createdAt ?? s.date ?? new Date().toISOString(),
        }),
      );
    }
    state.teams = state.teams ?? [];
    state.techniques = state.techniques ?? [];
  }

  // v2 -> v3
  if ((version ?? 0) < 3) {
    state.matches = state.matches ?? [];
    state.playerTechniques = state.playerTechniques ?? [];
  }

  // v3 -> v4
  if ((version ?? 0) < 4) {
    if (Array.isArray(state.players)) {
      state.players = (state.players as Record<string, unknown>[]).map(
        (p) => ({
          ...p,
          preferredPositions: p.preferredPositions ?? [],
          isActive: p.isActive ?? true,
        }),
      );
    }
    if (Array.isArray(state.coachingNotes)) {
      state.coachingNotes = (
        state.coachingNotes as Record<string, unknown>[]
      ).map((n) => ({
        ...n,
        actionItems: n.actionItems ?? [],
        tags: n.tags ?? [],
        resolved: n.resolved ?? false,
      }));
    }
    if (Array.isArray(state.trainingPlans)) {
      state.trainingPlans = (
        state.trainingPlans as Record<string, unknown>[]
      ).map((p) => ({
        ...p,
        completedSessionIds: p.completedSessionIds ?? [],
      }));
    }
  }

  return state;
}

describe("Full migration path", () => {
  describe("v0 to current (v4)", () => {
    it("migrates a minimal v0 state all the way to v4", () => {
      const v0State: Record<string, unknown> = {
        sessions: [
          {
            id: "s1",
            name: "Old session",
            date: "2025-01-01",
            drillIds: [],
            notes: "",
            totalDuration: 60,
          },
        ],
        matchPlans: [],
        boardScenes: [],
        players: [
          {
            id: "p1",
            name: "Test",
            preferredPosition: "offense",
            level: "beginner",
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
            createdAt: "2025-01-01",
          },
        ],
        favorites: ["card-1"],
        goals: [],
        coachingNotes: [
          {
            id: "n1",
            playerId: "p1",
            date: "2025-01-01",
            category: "tactical",
            text: "Test note",
          },
        ],
        trainingPlans: [
          {
            id: "tp1",
            name: "Plan",
            playerIds: [],
            weeks: [],
            createdAt: "2025-01-01",
          },
        ],
      };

      const result = migrate(v0State, 0);

      // Session should have playerIds, focusAreas, createdAt defaults from v2 migration
      const session = (result.sessions as Record<string, unknown>[])[0];
      expect(session.playerIds).toEqual([]);
      expect(session.focusAreas).toEqual([]);
      expect(session.createdAt).toBeDefined();

      // v2: teams and techniques should exist
      expect(result.teams).toEqual([]);
      expect(result.techniques).toEqual([]);

      // v3: matches and playerTechniques should exist
      expect(result.matches).toEqual([]);
      expect(result.playerTechniques).toEqual([]);

      // v4: Player should have preferredPositions and isActive
      const player = (result.players as Record<string, unknown>[])[0];
      expect(player.preferredPositions).toEqual([]);
      expect(player.isActive).toBe(true);

      // v4: CoachingNote should have actionItems, tags, resolved
      const note = (result.coachingNotes as Record<string, unknown>[])[0];
      expect(note.actionItems).toEqual([]);
      expect(note.tags).toEqual([]);
      expect(note.resolved).toBe(false);

      // v4: TrainingPlan should have completedSessionIds
      const plan = (result.trainingPlans as Record<string, unknown>[])[0];
      expect(plan.completedSessionIds).toEqual([]);
    });

    it("handles completely empty v0 state", () => {
      const result = migrate({}, undefined);
      expect(result.sessions).toEqual([]);
      expect(result.matchPlans).toEqual([]);
      expect(result.players).toEqual([]);
      expect(result.favorites).toEqual([]);
      expect(result.goals).toEqual([]);
      expect(result.evaluations).toEqual([]);
      expect(result.coachingNotes).toEqual([]);
      expect(result.trainingPlans).toEqual([]);
      expect(result.teams).toEqual([]);
      expect(result.techniques).toEqual([]);
      expect(result.matches).toEqual([]);
      expect(result.playerTechniques).toEqual([]);
    });

    it("handles malformed/non-array data in v0 state", () => {
      const result = migrate(
        {
          sessions: "not-an-array",
          matchPlans: 42,
          favorites: "string",
          evaluations: null,
          coachingNotes: undefined,
          trainingPlans: { broken: true },
          customDrills: false,
        },
        0,
      );

      expect(result.sessions).toEqual([]);
      expect(result.matchPlans).toEqual([]);
      expect(result.favorites).toEqual([]);
      expect(result.evaluations).toEqual([]);
      expect(result.coachingNotes).toEqual([]);
      expect(result.trainingPlans).toEqual([]);
      expect(result.customDrills).toEqual([]);
    });
  });

  describe("v2 to current (v4)", () => {
    it("migrates from v2 state (skips v0/v1 migrations)", () => {
      const v2State: Record<string, unknown> = {
        sessions: [
          {
            id: "s1",
            name: "Session",
            date: "2025-06-01",
            drillIds: [],
            notes: "",
            totalDuration: 60,
            playerIds: ["p1"],
            focusAreas: ["Torschuss"],
            createdAt: "2025-06-01",
          },
        ],
        players: [
          {
            id: "p1",
            name: "Player",
            preferredPosition: "both",
            level: "intermediate",
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
            createdAt: "2025-06-01",
          },
        ],
        teams: [{ id: "t1", name: "Team A" }],
        coachingNotes: [
          {
            id: "n1",
            playerId: "p1",
            date: "2025-06-01",
            category: "tactical",
            text: "Note",
          },
        ],
        trainingPlans: [
          {
            id: "tp1",
            name: "Plan",
            playerIds: [],
            weeks: [],
            createdAt: "2025-06-01",
          },
        ],
      };

      const result = migrate(v2State, 2);

      // v3 additions
      expect(result.matches).toEqual([]);
      expect(result.playerTechniques).toEqual([]);

      // v4 additions
      const player = (result.players as Record<string, unknown>[])[0];
      expect(player.preferredPositions).toEqual([]);
      expect(player.isActive).toBe(true);

      const note = (result.coachingNotes as Record<string, unknown>[])[0];
      expect(note.actionItems).toEqual([]);
      expect(note.tags).toEqual([]);
      expect(note.resolved).toBe(false);

      // Session should be unchanged (already has playerIds etc.)
      const session = (result.sessions as Record<string, unknown>[])[0];
      expect(session.playerIds).toEqual(["p1"]);
    });
  });

  describe("v3 to current (v4)", () => {
    it("only applies v4 migration", () => {
      const v3State: Record<string, unknown> = {
        players: [
          {
            id: "p1",
            name: "Player",
            preferredPosition: "defense",
            level: "advanced",
            notes: "",
            skillRatings: {
              Torschuss: 4,
              Passspiel: 4,
              Ballkontrolle: 4,
              Defensive: 4,
              Taktik: 4,
              Offensive: 4,
              Mental: 4,
            },
            createdAt: "2025-09-01",
          },
        ],
        coachingNotes: [],
        trainingPlans: [],
        matches: [{ id: "m1" }],
        playerTechniques: [{ id: "pt1" }],
      };

      const result = migrate(v3State, 3);

      // v4 additions on player
      const player = (result.players as Record<string, unknown>[])[0];
      expect(player.preferredPositions).toEqual([]);
      expect(player.isActive).toBe(true);

      // matches/playerTechniques untouched
      expect(result.matches).toEqual([{ id: "m1" }]);
      expect(result.playerTechniques).toEqual([{ id: "pt1" }]);
    });
  });

  describe("already current (v4)", () => {
    it("passes through data unchanged", () => {
      const v4State: Record<string, unknown> = {
        players: [
          {
            id: "p1",
            name: "Player",
            preferredPosition: "both",
            preferredPositions: ["torwart"],
            isActive: false,
            level: "beginner",
            notes: "test",
            skillRatings: {
              Torschuss: 5,
              Passspiel: 5,
              Ballkontrolle: 5,
              Defensive: 5,
              Taktik: 5,
              Offensive: 5,
              Mental: 5,
            },
            createdAt: "2026-01-01",
          },
        ],
        coachingNotes: [
          {
            id: "n1",
            playerId: "p1",
            date: "2026-01-01",
            category: "mental",
            text: "Note",
            actionItems: ["do this"],
            tags: ["focus"],
            resolved: true,
          },
        ],
        trainingPlans: [
          {
            id: "tp1",
            name: "Plan",
            playerIds: [],
            weeks: [],
            completedSessionIds: ["s1"],
            createdAt: "2026-01-01",
          },
        ],
      };

      const result = migrate(v4State, 4);

      // Everything should be the same
      const player = (result.players as Record<string, unknown>[])[0];
      expect(player.preferredPositions).toEqual(["torwart"]);
      expect(player.isActive).toBe(false);

      const note = (result.coachingNotes as Record<string, unknown>[])[0];
      expect(note.actionItems).toEqual(["do this"]);
      expect(note.tags).toEqual(["focus"]);
      expect(note.resolved).toBe(true);

      const plan = (result.trainingPlans as Record<string, unknown>[])[0];
      expect(plan.completedSessionIds).toEqual(["s1"]);
    });
  });

  describe("edge cases", () => {
    it("preserves existing v4 fields when migrating from v0", () => {
      // A v0 state that somehow already has some v4 fields
      const state: Record<string, unknown> = {
        sessions: [],
        matchPlans: [],
        boardScenes: [],
        players: [
          {
            id: "p1",
            name: "Player",
            preferredPosition: "offense",
            preferredPositions: ["3er-Reihe"],
            isActive: false,
            level: "beginner",
            notes: "",
            skillRatings: {
              Torschuss: 1,
              Passspiel: 1,
              Ballkontrolle: 1,
              Defensive: 1,
              Taktik: 1,
              Offensive: 1,
              Mental: 1,
            },
            createdAt: "2025-01-01",
          },
        ],
      };

      const result = migrate(state, 0);
      const player = (result.players as Record<string, unknown>[])[0];
      // The existing preferredPositions should be preserved (spread first, then default)
      expect(player.preferredPositions).toEqual(["3er-Reihe"]);
      expect(player.isActive).toBe(false);
    });

    it("handles sessions with createdAt already set from v0", () => {
      const state: Record<string, unknown> = {
        sessions: [
          {
            id: "s1",
            name: "Sess",
            date: "2025-01-01",
            drillIds: [],
            notes: "",
            totalDuration: 0,
            createdAt: "2025-01-01T10:00:00Z",
          },
        ],
        matchPlans: [],
        boardScenes: [],
      };

      const result = migrate(state, 0);
      const session = (result.sessions as Record<string, unknown>[])[0];
      expect(session.createdAt).toBe("2025-01-01T10:00:00Z");
    });
  });
});
