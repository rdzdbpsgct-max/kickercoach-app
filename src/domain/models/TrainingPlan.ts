import type { Category } from "./CoachCard";

export interface SessionTemplate {
  name: string;
  drillIds: string[];
  focusAreas: Category[];
  estimatedDuration: number;
}

export interface TrainingWeek {
  weekNumber: number;
  sessionTemplates: SessionTemplate[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  playerIds: string[];
  weeks: TrainingWeek[];
  goal?: string;
  createdAt: string;
}
