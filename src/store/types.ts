import type { PlayerSlice } from "./slices/playerSlice";
import type { SessionSlice } from "./slices/sessionSlice";
import type { DrillSlice } from "./slices/drillSlice";
import type { MatchSlice } from "./slices/matchSlice";
import type { CoachingSlice } from "./slices/coachingSlice";
import type { TrainingSlice } from "./slices/trainingSlice";
import type { BoardSlice } from "./slices/boardSlice";
import type { TeamSlice } from "./slices/teamSlice";
import type { Session } from "../domain/models/Session";
import type { Goal } from "../domain/models/Goal";
import type { Evaluation } from "../domain/models/Evaluation";
import type { CoachingNote } from "../domain/models/CoachingNote";
import type { PlayerTechnique } from "../domain/models/PlayerTechnique";
import type { Match } from "../domain/models/Match";

export interface CrossSliceSelectors {
  getPlayerSessions: (playerId: string) => Session[];
  getPlayerGoals: (playerId: string) => Goal[];
  getPlayerEvaluations: (playerId: string) => Evaluation[];
  getPlayerNotes: (playerId: string) => CoachingNote[];
  getPlayerTechniques: (playerId: string) => PlayerTechnique[];
  getPlayerMatches: (playerId: string) => Match[];
}

export type AppState = PlayerSlice &
  SessionSlice &
  DrillSlice &
  MatchSlice &
  CoachingSlice &
  TrainingSlice &
  BoardSlice &
  TeamSlice &
  CrossSliceSelectors;
