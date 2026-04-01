import type { StateCreator } from "zustand";
import type {
  TrainingPlan,
  SessionTemplate,
} from "../../domain/models/TrainingPlan";
import type { AppState } from "../types";

export interface TrainingSlice {
  trainingPlans: TrainingPlan[];
  sessionTemplates: SessionTemplate[];
  addTrainingPlan: (plan: TrainingPlan) => void;
  updateTrainingPlan: (id: string, updates: Partial<TrainingPlan>) => void;
  deleteTrainingPlan: (id: string) => void;
  saveSessionAsTemplate: (template: SessionTemplate) => void;
  deleteSessionTemplate: (id: string) => void;
}

export const createTrainingSlice: StateCreator<
  AppState,
  [],
  [],
  TrainingSlice
> = (set) => ({
  trainingPlans: [],
  sessionTemplates: [],
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
  saveSessionAsTemplate: (template) =>
    set((s) => ({
      sessionTemplates: [...s.sessionTemplates, template],
    })),
  deleteSessionTemplate: (id) =>
    set((s) => ({
      sessionTemplates: s.sessionTemplates.filter((t) => t.id !== id),
    })),
});
