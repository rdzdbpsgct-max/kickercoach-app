import { create } from "zustand";
import { persist } from "zustand/middleware";
import { migrateArray } from "./migrate";
import { SessionSchema } from "../domain/schemas/session";
import { MatchPlanSchema } from "../domain/schemas/matchPlan";
import { TacticalSceneSchema } from "../domain/schemas/tacticalBoard";
import type { Difficulty, Category } from "../domain/models/CoachCard";
import type { CoachingNote } from "../domain/models/CoachingNote";
import type { Drill } from "../domain/models/Drill";
import type { Team } from "../domain/models/Team";
import type { TrainingPlan } from "../domain/models/TrainingPlan";
import type { Evaluation } from "../domain/models/Evaluation";
import type { MatchPlan } from "../domain/models/MatchPlan";
import type { TacticalScene } from "../domain/models/TacticalBoard";

// ── Player Types (new) ─────────────────────────────────────────────

export type Position = "offense" | "defense" | "both";

export type SkillRatings = Record<Category, number>;

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  preferredPosition: Position;
  level: Difficulty;
  notes: string;
  skillRatings: SkillRatings;
  avatarColor?: string;
  createdAt: string;
}

// ── Extended Session Type ──────────────────────────────────────────

export interface Session {
  id: string;
  name: string;
  date: string;
  drillIds: string[];
  notes: string;
  totalDuration: number;
  playerIds: string[];
  focusAreas: Category[];
  rating?: number;
  mood?: "great" | "good" | "ok" | "tired" | "frustrated";
}

// ── Goal Type (new) ────────────────────────────────────────────────

export interface Goal {
  id: string;
  playerId: string;
  title: string;
  description?: string;
  category: Category;
  targetDate?: string;
  status: "active" | "achieved" | "paused";
  createdAt: string;
}

// ── Store Interface ────────────────────────────────────────────────

interface AppState {
  // Data
  players: Player[];
  sessions: Session[];
  matchPlans: MatchPlan[];
  boardScenes: TacticalScene[];
  favorites: string[];
  goals: Goal[];
  customDrills: Drill[];
  evaluations: Evaluation[];
  coachingNotes: CoachingNote[];
  trainingPlans: TrainingPlan[];
  teams: Team[];

  // Player actions
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Session actions
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;

  // MatchPlan actions
  addMatchPlan: (plan: MatchPlan) => void;
  updateMatchPlan: (id: string, updates: Partial<MatchPlan>) => void;
  deleteMatchPlan: (id: string) => void;
  setMatchPlans: (plans: MatchPlan[]) => void;

  // BoardScene actions
  setBoardScenes: (scenes: TacticalScene[]) => void;

  // Custom drill actions
  addCustomDrill: (drill: Drill) => void;
  updateCustomDrill: (id: string, updates: Partial<Drill>) => void;
  deleteCustomDrill: (id: string) => void;

  // Favorite actions
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Goal actions
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Evaluation actions
  addEvaluation: (evaluation: Evaluation) => void;
  deleteEvaluation: (id: string) => void;

  // Coaching note actions
  addCoachingNote: (note: CoachingNote) => void;
  deleteCoachingNote: (id: string) => void;

  // Training plan actions
  addTrainingPlan: (plan: TrainingPlan) => void;
  updateTrainingPlan: (id: string, updates: Partial<TrainingPlan>) => void;
  deleteTrainingPlan: (id: string) => void;

  // Team actions
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  // Selectors
  getPlayerSessions: (playerId: string) => Session[];
  getPlayerGoals: (playerId: string) => Goal[];
  getPlayerEvaluations: (playerId: string) => Evaluation[];
  getPlayerNotes: (playerId: string) => CoachingNote[];
}

// ── Store Version & Migration ──────────────────────────────────────

const STORE_VERSION = 1;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      players: [],
      sessions: [],
      matchPlans: [],
      boardScenes: [],
      favorites: [],
      goals: [],
      customDrills: [],
      evaluations: [],
      coachingNotes: [],
      trainingPlans: [],
      teams: [],

      // Player actions
      addPlayer: (player) =>
        set((s) => ({ players: [...s.players, player] })),
      updatePlayer: (id, updates) =>
        set((s) => ({
          players: s.players.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),
      deletePlayer: (id) =>
        set((s) => ({ players: s.players.filter((p) => p.id !== id) })),

      // Session actions
      addSession: (session) =>
        set((s) => ({ sessions: [...s.sessions, session] })),
      updateSession: (id, updates) =>
        set((s) => ({
          sessions: s.sessions.map((ses) =>
            ses.id === id ? { ...ses, ...updates } : ses,
          ),
        })),
      deleteSession: (id) =>
        set((s) => ({ sessions: s.sessions.filter((ses) => ses.id !== id) })),

      // MatchPlan actions
      addMatchPlan: (plan) =>
        set((s) => ({ matchPlans: [...s.matchPlans, plan] })),
      updateMatchPlan: (id, updates) =>
        set((s) => ({
          matchPlans: s.matchPlans.map((mp) =>
            mp.id === id ? { ...mp, ...updates } : mp,
          ),
        })),
      deleteMatchPlan: (id) =>
        set((s) => ({
          matchPlans: s.matchPlans.filter((mp) => mp.id !== id),
        })),
      setMatchPlans: (plans) => set({ matchPlans: plans }),

      // BoardScene actions
      setBoardScenes: (scenes) => set({ boardScenes: scenes }),

      // Custom drill actions
      addCustomDrill: (drill) =>
        set((s) => ({ customDrills: [...s.customDrills, drill] })),
      updateCustomDrill: (id, updates) =>
        set((s) => ({
          customDrills: s.customDrills.map((d) =>
            d.id === id ? { ...d, ...updates } : d,
          ),
        })),
      deleteCustomDrill: (id) =>
        set((s) => ({
          customDrills: s.customDrills.filter((d) => d.id !== id),
        })),

      // Favorite actions
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),

      // Goal actions
      addGoal: (goal) => set((s) => ({ goals: [...s.goals, goal] })),
      updateGoal: (id, updates) =>
        set((s) => ({
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, ...updates } : g,
          ),
        })),
      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      // Evaluation actions
      addEvaluation: (evaluation) =>
        set((s) => ({ evaluations: [...s.evaluations, evaluation] })),
      deleteEvaluation: (id) =>
        set((s) => ({
          evaluations: s.evaluations.filter((e) => e.id !== id),
        })),

      // Team actions
      addTeam: (team) =>
        set((s) => ({ teams: [...s.teams, team] })),
      updateTeam: (id, updates) =>
        set((s) => ({
          teams: s.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTeam: (id) =>
        set((s) => ({ teams: s.teams.filter((t) => t.id !== id) })),

      // Coaching note actions
      addCoachingNote: (note) =>
        set((s) => ({ coachingNotes: [...s.coachingNotes, note] })),
      deleteCoachingNote: (id) =>
        set((s) => ({
          coachingNotes: s.coachingNotes.filter((n) => n.id !== id),
        })),

      // Training plan actions
      addTrainingPlan: (plan) =>
        set((s) => ({ trainingPlans: [...s.trainingPlans, plan] })),
      updateTrainingPlan: (id, updates) =>
        set((s) => ({
          trainingPlans: s.trainingPlans.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),
      deleteTrainingPlan: (id) =>
        set((s) => ({
          trainingPlans: s.trainingPlans.filter((p) => p.id !== id),
        })),

      // Selectors
      getPlayerSessions: (playerId) =>
        get().sessions.filter((s) => s.playerIds.includes(playerId)),
      getPlayerGoals: (playerId) =>
        get().goals.filter((g) => g.playerId === playerId),
      getPlayerEvaluations: (playerId) =>
        get().evaluations.filter((e) => e.playerId === playerId),
      getPlayerNotes: (playerId) =>
        get().coachingNotes.filter((n) => n.playerId === playerId),
    }),
    {
      name: "kickercoach-store",
      version: STORE_VERSION,
      migrate: (persistedState, version) => {
        const state = persistedState as Record<string, unknown>;

        if (version === 0 || version === undefined) {
          return {
            ...state,
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
          };
        }

        return state as unknown as AppState;
      },
    },
  ),
);
