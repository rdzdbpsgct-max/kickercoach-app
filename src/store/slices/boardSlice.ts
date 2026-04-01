import type { StateCreator } from "zustand";
import type { TacticalScene } from "../../domain/models/TacticalBoard";
import type { AppState } from "../types";

export interface BoardSlice {
  boardScenes: TacticalScene[];
  favorites: string[];
  setBoardScenes: (scenes: TacticalScene[]) => void;
  toggleFavorite: (id: string) => void;
}

export const createBoardSlice: StateCreator<AppState, [], [], BoardSlice> = (
  set,
) => ({
  boardScenes: [],
  favorites: [],
  setBoardScenes: (scenes) => set({ boardScenes: scenes }),
  toggleFavorite: (id) =>
    set((s) => ({
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((f) => f !== id)
        : [...s.favorites, id],
    })),
});
