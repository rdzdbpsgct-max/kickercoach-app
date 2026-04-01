import type { Difficulty, Category } from "./CoachCard";
import type { RodPosition } from "./Drill";

export type Position = "offense" | "defense" | "both";

export type SkillRatings = Record<Category, number>;

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  /** @deprecated Use preferredPositions instead */
  preferredPosition: Position;
  preferredPositions?: RodPosition[];
  isActive?: boolean;
  level: Difficulty;
  notes: string;
  skillRatings: SkillRatings;
  avatarColor?: string;
  createdAt: string;
}
