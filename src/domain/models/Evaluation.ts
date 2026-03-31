import type { Category } from "./CoachCard";

export interface SkillRating {
  category: Category;
  rating: number; // 1-5
  comment?: string;
}

export interface TechniqueRating {
  techniqueId: string;
  rating: number; // 1-5
  successRate?: number;
  comment?: string;
}

export type EvaluationType = "session" | "match" | "general";

export interface Evaluation {
  id: string;
  playerId: string;
  sessionId?: string;
  matchId?: string;
  type?: EvaluationType;
  date: string;
  skillRatings: SkillRating[];
  techniqueRatings?: TechniqueRating[];
  overallRating?: number;
  notes: string;
}
