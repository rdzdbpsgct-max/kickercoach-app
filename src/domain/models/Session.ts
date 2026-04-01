import type { Category } from "./CoachCard";

export type Mood = "great" | "good" | "ok" | "tired" | "frustrated";

export interface DrillResult {
  drillId: string;
  completed: boolean;
  blocksCompleted: number;
  successRate?: number; // 0-100
  notes?: string;
}

export interface SessionRetrospective {
  whatWentWell: string;
  whatToImprove: string;
  focusNextTime: string;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  drillIds: string[];
  drillResults?: DrillResult[];
  notes: string;
  totalDuration: number;
  playerIds: string[];
  teamId?: string;
  planId?: string;
  focusAreas: Category[];
  rating?: number;
  mood?: Mood;
  retrospective?: SessionRetrospective;
  createdAt?: string;
}
