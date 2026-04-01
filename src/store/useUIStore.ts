import { create } from "zustand";

interface UIState {
  // Global search/filter
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Sidebar/drawer state
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Active draft (unsaved form data)
  activeDraftId: string | null;
  setActiveDraftId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  globalSearch: "",
  setGlobalSearch: (q) => set({ globalSearch: q }),

  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  activeDraftId: null,
  setActiveDraftId: (id) => set({ activeDraftId: id }),
}));
