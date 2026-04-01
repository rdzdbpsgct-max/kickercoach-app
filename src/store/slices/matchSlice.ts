import type { StateCreator } from "zustand";
import type { MatchPlan } from "../../domain/models/MatchPlan";
import type { Match } from "../../domain/models/Match";
import type { AppState } from "../types";

export interface MatchSlice {
  matchPlans: MatchPlan[];
  matches: Match[];
  addMatchPlan: (plan: MatchPlan) => void;
  updateMatchPlan: (id: string, updates: Partial<MatchPlan>) => void;
  deleteMatchPlan: (id: string) => void;
  setMatchPlans: (plans: MatchPlan[]) => void;
  addMatch: (match: Match) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
}

export const createMatchSlice: StateCreator<AppState, [], [], MatchSlice> = (
  set,
) => ({
  matchPlans: [],
  matches: [],
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
  addMatch: (match) => set((s) => ({ matches: [...s.matches, match] })),
  updateMatch: (id, updates) =>
    set((s) => ({
      matches: s.matches.map((m) =>
        m.id === id ? { ...m, ...updates } : m,
      ),
    })),
  deleteMatch: (id) =>
    set((s) => ({
      matches: s.matches.filter((m) => m.id !== id),
      evaluations: s.evaluations.filter((e) => e.matchId !== id),
    })),
});
