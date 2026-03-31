import type { Category } from "./CoachCard";

export type GoalStatus = "active" | "achieved" | "paused" | "abandoned";

export interface Goal {
  id: string;
  playerId: string;
  title: string;
  description?: string;
  category: Category;
  techniqueId?: string;
  targetValue?: number;
  currentValue?: number;
  targetDate?: string;
  status: GoalStatus;
  createdAt: string;
}
