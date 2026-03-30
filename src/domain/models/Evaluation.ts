import type { Category } from "./CoachCard";

export interface SkillRating {
  category: Category;
  rating: number; // 1-5
  comment?: string;
}

export interface Evaluation {
  id: string;
  playerId: string;
  sessionId?: string;
  date: string;
  skillRatings: SkillRating[];
  notes: string;
}
