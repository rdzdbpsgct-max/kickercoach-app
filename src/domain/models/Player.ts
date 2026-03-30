import type { Difficulty, Category } from "./CoachCard";

export type Position = "offense" | "defense" | "both";

export type SkillRatings = Record<Category, number>;

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  preferredPosition: Position;
  level: Difficulty;
  notes: string;
  skillRatings: SkillRatings;
  avatarColor?: string;
  createdAt: string;
}
