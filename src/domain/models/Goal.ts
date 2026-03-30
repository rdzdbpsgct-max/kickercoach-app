import type { Category } from "./CoachCard";

export interface Goal {
  id: string;
  playerId: string;
  title: string;
  description?: string;
  category: Category;
  targetDate?: string;
  status: "active" | "achieved" | "paused";
  createdAt: string;
}
