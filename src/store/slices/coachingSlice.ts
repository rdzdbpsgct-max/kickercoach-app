import type { StateCreator } from "zustand";
import type { Goal } from "../../domain/models/Goal";
import type { Evaluation } from "../../domain/models/Evaluation";
import type { CoachingNote } from "../../domain/models/CoachingNote";
import type { Technique } from "../../domain/models/Technique";
import type { PlayerTechnique } from "../../domain/models/PlayerTechnique";
import type { AppState } from "../types";
import { STAR_RATING_SCALE } from "../../domain/constants";
import { EvaluationSchema } from "../../domain/schemas/evaluation";
import { CoachingNoteSchema } from "../../domain/schemas/coachingNote";
import { GoalSchema } from "../../domain/schemas/goal";
import { validateOrWarn } from "../../utils/validate";

export interface CoachingSlice {
  goals: Goal[];
  evaluations: Evaluation[];
  coachingNotes: CoachingNote[];
  techniques: Technique[];
  playerTechniques: PlayerTechnique[];
  setTechniques: (techniques: Technique[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addEvaluation: (evaluation: Evaluation) => void;
  deleteEvaluation: (id: string) => void;
  addCoachingNote: (note: CoachingNote) => void;
  updateCoachingNote: (id: string, updates: Partial<CoachingNote>) => void;
  deleteCoachingNote: (id: string) => void;
  addPlayerTechnique: (pt: PlayerTechnique) => void;
  updatePlayerTechnique: (
    id: string,
    updates: Partial<PlayerTechnique>,
  ) => void;
  deletePlayerTechnique: (id: string) => void;
}

export const createCoachingSlice: StateCreator<
  AppState,
  [],
  [],
  CoachingSlice
> = (set) => ({
  goals: [],
  evaluations: [],
  coachingNotes: [],
  techniques: [],
  playerTechniques: [],
  setTechniques: (techniques) => set({ techniques }),
  addGoal: (goal) => {
    const validated = validateOrWarn(goal, GoalSchema, "addGoal");
    set((s) => ({ goals: [...s.goals, validated] }));
  },
  updateGoal: (id, updates) =>
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),
  deleteGoal: (id) =>
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),
  addEvaluation: (evaluation) => {
    const validated = validateOrWarn(evaluation, EvaluationSchema, "addEvaluation");
    set((s) => {
      const newEvaluations = [...s.evaluations, validated];

      // Auto-update goal progress from skill ratings
      const updatedGoals = s.goals.map((goal) => {
        if (goal.status !== "active" || goal.playerId !== evaluation.playerId)
          return goal;
        const matchingRating = evaluation.skillRatings.find(
          (sr) => sr.category === goal.category,
        );
        if (matchingRating && goal.targetValue != null) {
          return { ...goal, currentValue: matchingRating.rating * STAR_RATING_SCALE };
        }
        return goal;
      });

      return { evaluations: newEvaluations, goals: updatedGoals };
    });
  },
  deleteEvaluation: (id) =>
    set((s) => ({
      evaluations: s.evaluations.filter((e) => e.id !== id),
    })),
  addCoachingNote: (note) => {
    const validated = validateOrWarn(note, CoachingNoteSchema, "addCoachingNote");
    set((s) => ({ coachingNotes: [...s.coachingNotes, validated] }));
  },
  updateCoachingNote: (id, updates) =>
    set((s) => ({
      coachingNotes: s.coachingNotes.map((n) =>
        n.id === id ? { ...n, ...updates } : n,
      ),
    })),
  deleteCoachingNote: (id) =>
    set((s) => ({
      coachingNotes: s.coachingNotes.filter((n) => n.id !== id),
    })),
  addPlayerTechnique: (pt) =>
    set((s) => ({ playerTechniques: [...s.playerTechniques, pt] })),
  updatePlayerTechnique: (id, updates) =>
    set((s) => ({
      playerTechniques: s.playerTechniques.map((pt) =>
        pt.id === id ? { ...pt, ...updates } : pt,
      ),
    })),
  deletePlayerTechnique: (id) =>
    set((s) => ({
      playerTechniques: s.playerTechniques.filter((pt) => pt.id !== id),
    })),
});
