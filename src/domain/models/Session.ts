import type { Category } from "./CoachCard";

export type Mood = "great" | "good" | "ok" | "tired" | "frustrated";

export interface Session {
  id: string;
  name: string;
  date: string;
  drillIds: string[];
  notes: string;
  totalDuration: number;
  playerIds: string[];
  focusAreas: Category[];
  rating?: number;
  mood?: Mood;
  createdAt?: string;
}
