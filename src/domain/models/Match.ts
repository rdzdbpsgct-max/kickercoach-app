export interface MatchSet {
  setNumber: number;
  scoreHome: number;
  scoreAway: number;
}

export type MatchResult = "win" | "loss" | "draw";

export interface Match {
  id: string;
  opponent: string;
  date: string;
  sets: MatchSet[];
  result?: MatchResult;
  playerIds: string[];
  teamId?: string;
  planId?: string;
  observations?: string;
  notes?: string;
  createdAt: string;
}
