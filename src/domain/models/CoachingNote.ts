export interface CoachingNote {
  id: string;
  playerId?: string;
  sessionId?: string;
  matchPlanId?: string;
  date: string;
  category: "tactical" | "technical" | "mental" | "communication";
  text: string;
}
