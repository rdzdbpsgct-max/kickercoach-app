export interface TrainingBlock {
  type: "work" | "rest";
  durationSeconds: number;
  note: string;
}

import type { Difficulty } from "./CoachCard";

/** @deprecated Use Difficulty from CoachCard instead */
export type DrillDifficulty = Difficulty;

export interface Drill {
  id: string;
  name: string;
  focusSkill: string;
  blocks: TrainingBlock[];
  difficulty?: Difficulty;
  description?: string;
}
