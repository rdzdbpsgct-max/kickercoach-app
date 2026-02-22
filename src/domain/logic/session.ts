import type { Session } from "../models/Session";
import type { Drill } from "../models/Drill";
import { drillTotalDuration } from "./drill";

export interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  averageMinutes: number;
  longestSession: number;
}

/**
 * Calculate aggregate stats for a list of sessions.
 */
export function calculateSessionStats(sessions: Session[]): SessionStats {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalMinutes: 0,
      averageMinutes: 0,
      longestSession: 0,
    };
  }

  const totalMinutes = sessions.reduce(
    (sum, s) => sum + Math.round(s.totalDuration / 60),
    0,
  );
  const longestSession = Math.max(
    ...sessions.map((s) => Math.round(s.totalDuration / 60)),
  );

  return {
    totalSessions: sessions.length,
    totalMinutes,
    averageMinutes: Math.round(totalMinutes / sessions.length),
    longestSession,
  };
}

/**
 * Calculate total duration for a session based on its drills.
 */
export function calculateSessionDuration(
  drillIds: string[],
  allDrills: Drill[],
): number {
  return drillIds.reduce((sum, id) => {
    const drill = allDrills.find((d) => d.id === id);
    return sum + (drill ? drillTotalDuration(drill) : 0);
  }, 0);
}
