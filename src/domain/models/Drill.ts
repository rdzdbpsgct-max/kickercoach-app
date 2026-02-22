export interface TrainingBlock {
  type: "work" | "rest";
  durationSeconds: number;
  note: string;
}

export type DrillDifficulty = "beginner" | "intermediate" | "advanced";

export interface Drill {
  id: string;
  name: string;
  focusSkill: string;
  blocks: TrainingBlock[];
  difficulty?: DrillDifficulty;
  description?: string;
}
