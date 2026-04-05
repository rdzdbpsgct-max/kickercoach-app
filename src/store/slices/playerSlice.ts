import type { StateCreator } from "zustand";
import type { Player } from "../../domain/models/Player";
import type { AppState } from "../types";
import { PlayerSchema } from "../../domain/schemas/player";
import { validateOrWarn } from "../../utils/validate";

export interface PlayerSlice {
  players: Player[];
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
}

export const createPlayerSlice: StateCreator<AppState, [], [], PlayerSlice> = (
  set,
) => ({
  players: [],
  addPlayer: (player) => {
    const validated = validateOrWarn(player, PlayerSchema, "addPlayer");
    set((s) => ({ players: [...s.players, validated] }));
  },
  updatePlayer: (id, updates) =>
    set((s) => ({
      players: s.players.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    })),
  deletePlayer: (id) =>
    set((s) => ({
      players: s.players.filter((p) => p.id !== id),
      goals: s.goals.filter((g) => g.playerId !== id),
      evaluations: s.evaluations.filter((e) => e.playerId !== id),
      coachingNotes: s.coachingNotes.filter((n) => n.playerId !== id),
      playerTechniques: s.playerTechniques.filter(
        (pt) => pt.playerId !== id,
      ),
      // Doubles teams require exactly 2 players — remove the team if a member is deleted
      teams: s.teams.filter((t) => !t.playerIds.includes(id)),
      sessions: s.sessions.map((ses) => ({
        ...ses,
        playerIds: ses.playerIds.filter((pid) => pid !== id),
      })),
      matches: s.matches.map((m) => ({
        ...m,
        playerIds: m.playerIds.filter((pid) => pid !== id),
      })),
    })),
});
