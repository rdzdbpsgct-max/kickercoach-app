export type NotePriority = "low" | "medium" | "high";

export interface CoachingNote {
  id: string;
  playerId?: string;
  sessionId?: string;
  matchPlanId?: string;
  date: string;
  category: "tactical" | "technical" | "mental" | "communication";
  text: string;
  priority?: NotePriority;
  actionItems?: string[];
  tags?: string[];
  resolved?: boolean;
}
