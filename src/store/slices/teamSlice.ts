import type { StateCreator } from "zustand";
import type { Team } from "../../domain/models/Team";
import type { AppState } from "../types";

export interface TeamSlice {
  teams: Team[];
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
}

export const createTeamSlice: StateCreator<AppState, [], [], TeamSlice> = (
  set,
) => ({
  teams: [],
  addTeam: (team) => set((s) => ({ teams: [...s.teams, team] })),
  updateTeam: (id, updates) =>
    set((s) => ({
      teams: s.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTeam: (id) =>
    set((s) => ({ teams: s.teams.filter((t) => t.id !== id) })),
});
