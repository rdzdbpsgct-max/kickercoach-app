export type TechniqueStatus =
  | "not_started"
  | "learning"
  | "developing"
  | "proficient"
  | "mastered";

export interface PlayerTechnique {
  id: string;
  playerId: string;
  techniqueId: string;
  status: TechniqueStatus;
  currentSuccessRate?: number;
  lastPracticedAt?: string;
  notes?: string;
}
