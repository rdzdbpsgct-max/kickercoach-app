import { create } from "zustand";
import { persist } from "zustand/middleware";
import { migrateArray } from "./migrate";
import { SessionSchema } from "../domain/schemas/session";
import { MatchPlanSchema } from "../domain/schemas/matchPlan";
import { TacticalSceneSchema } from "../domain/schemas/tacticalBoard";
import type { AppState } from "./types";
import { createPlayerSlice } from "./slices/playerSlice";
import { createSessionSlice } from "./slices/sessionSlice";
import { createDrillSlice } from "./slices/drillSlice";
import { createMatchSlice } from "./slices/matchSlice";
import { createCoachingSlice } from "./slices/coachingSlice";
import { createTrainingSlice } from "./slices/trainingSlice";
import { createBoardSlice } from "./slices/boardSlice";
import { createTeamSlice } from "./slices/teamSlice";

// ── Store Version & Migration ──────────────────────────────────────

const STORE_VERSION = 4;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createPlayerSlice(...a),
      ...createSessionSlice(...a),
      ...createDrillSlice(...a),
      ...createMatchSlice(...a),
      ...createCoachingSlice(...a),
      ...createTrainingSlice(...a),
      ...createBoardSlice(...a),
      ...createTeamSlice(...a),

      // Cross-slice selectors
      getPlayerSessions: (playerId) =>
        a[1]().sessions.filter((s) => s.playerIds.includes(playerId)),
      getPlayerGoals: (playerId) =>
        a[1]().goals.filter((g) => g.playerId === playerId),
      getPlayerEvaluations: (playerId) =>
        a[1]().evaluations.filter((e) => e.playerId === playerId),
      getPlayerNotes: (playerId) =>
        a[1]().coachingNotes.filter((n) => n.playerId === playerId),
      getPlayerTechniques: (playerId) =>
        a[1]().playerTechniques.filter((pt) => pt.playerId === playerId),
      getPlayerMatches: (playerId) =>
        a[1]().matches.filter((m) => m.playerIds.includes(playerId)),
    }),
    {
      name: "kickercoach-store",
      version: STORE_VERSION,
      migrate: (persistedState, version) => {
        const state = persistedState as Record<string, unknown>;

        if (version === 0 || version === undefined) {
          Object.assign(state, {
            sessions: migrateArray(state.sessions, SessionSchema),
            matchPlans: migrateArray(state.matchPlans, MatchPlanSchema),
            boardScenes: migrateArray(
              state.boardScenes,
              TacticalSceneSchema,
            ),
            players: state.players ?? [],
            favorites: Array.isArray(state.favorites) ? state.favorites : [],
            goals: state.goals ?? [],
            customDrills: Array.isArray(state.customDrills) ? state.customDrills : [],
            evaluations: Array.isArray(state.evaluations) ? state.evaluations : [],
            coachingNotes: Array.isArray(state.coachingNotes) ? state.coachingNotes : [],
            trainingPlans: Array.isArray(state.trainingPlans) ? state.trainingPlans : [],
            drillTemplates: Array.isArray(state.drillTemplates) ? state.drillTemplates : [],
            sessionTemplates: Array.isArray(state.sessionTemplates) ? state.sessionTemplates : [],
          });
        }

        // v1 → v2: Ensure Session fields have defaults, teams array exists
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

        // v2 → v3: Add matches, playerTechniques arrays
        if ((version ?? 0) < 3) {
          state.matches = state.matches ?? [];
          state.playerTechniques = state.playerTechniques ?? [];
        }

        // v3 → v4: Extend Player (preferredPositions, isActive),
        // CoachingNote (priority, actionItems, tags, resolved),
        // Session (planId), TrainingPlan (completedSessionIds)
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
            state.coachingNotes = (state.coachingNotes as Record<string, unknown>[]).map(
              (n) => ({
                ...n,
                actionItems: n.actionItems ?? [],
                tags: n.tags ?? [],
                resolved: n.resolved ?? false,
              }),
            );
          }
          if (Array.isArray(state.trainingPlans)) {
            state.trainingPlans = (state.trainingPlans as Record<string, unknown>[]).map(
              (p) => ({
                ...p,
                completedSessionIds: p.completedSessionIds ?? [],
              }),
            );
          }
        }

        return state as unknown as AppState;
      },
    },
  ),
);
