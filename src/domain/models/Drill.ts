export type BlockType = "work" | "rest" | "repetitions";

export interface TrainingBlock {
  type: BlockType;
  durationSeconds: number;
  repetitions?: number;
  note: string;
}

import type { Difficulty, Category } from "./CoachCard";

/** @deprecated Use Difficulty from CoachCard instead */
export type DrillDifficulty = Difficulty;

export type RodPosition = "keeper" | "defense" | "midfield" | "offense";
export type DrillPhase = "warmup" | "technique" | "game" | "cooldown";

export interface Drill {
  id: string;
  name: string;
  focusSkill: string;
  blocks: TrainingBlock[];
  difficulty?: Difficulty;
  description?: string;
  category?: Category;
  position?: RodPosition;
  playerCount?: 1 | 2;
  isCustom?: boolean;
  prerequisites?: string[];
  variations?: string[];
  measurableGoal?: string;
  phase?: DrillPhase;
  techniqueIds?: string[];
}
