import type { StateCreator } from "zustand";
import type { Drill } from "../../domain/models/Drill";
import type { AppState } from "../types";
import { generateId } from "../../utils/id";

export interface DrillSlice {
  customDrills: Drill[];
  drillTemplates: Drill[];
  addCustomDrill: (drill: Drill) => void;
  updateCustomDrill: (id: string, updates: Partial<Drill>) => void;
  deleteCustomDrill: (id: string) => void;
  saveDrillAsTemplate: (drill: Drill) => void;
  deleteDrillTemplate: (id: string) => void;
}

export const createDrillSlice: StateCreator<AppState, [], [], DrillSlice> = (
  set,
) => ({
  customDrills: [],
  drillTemplates: [],
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
      drillTemplates: s.drillTemplates.filter((d) => d.id !== id),
      sessions: s.sessions.map((ses) => ({
        ...ses,
        drillIds: ses.drillIds.filter((did) => did !== id),
      })),
    })),
  saveDrillAsTemplate: (drill) =>
    set((s) => ({
      drillTemplates: [
        ...s.drillTemplates,
        { ...drill, id: `tmpl-${generateId()}`, isCustom: true },
      ],
    })),
  deleteDrillTemplate: (id) =>
    set((s) => ({
      drillTemplates: s.drillTemplates.filter((d) => d.id !== id),
    })),
});
