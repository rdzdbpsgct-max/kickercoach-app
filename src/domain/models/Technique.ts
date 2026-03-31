import type { Category, Difficulty } from "./CoachCard";
import type { RodPosition } from "./Drill";

export interface Technique {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  description: string;
  rodPositions: RodPosition[];
  measurableGoal?: string;
  relatedDrillIds: string[];
  relatedCardIds: string[];
  tags: string[];
}
