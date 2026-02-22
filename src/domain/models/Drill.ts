export interface TrainingBlock {
  type: "work" | "rest";
  durationSeconds: number;
  note: string;
}

export interface Drill {
  id: string;
  name: string;
  focusSkill: string;
  blocks: TrainingBlock[];
}
