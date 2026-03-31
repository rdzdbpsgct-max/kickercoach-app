// ── Content & Enums ──────────────────────────────────────────────
export type { CoachCard, Difficulty, Category } from "./CoachCard";

// ── Core Domain ──────────────────────────────────────────────────
export type { Player, Position, SkillRatings } from "./Player";
export type {
  Session,
  Mood,
  DrillResult,
  SessionRetrospective,
} from "./Session";
export type { Drill, TrainingBlock, DrillDifficulty } from "./Drill";
export type { Goal, GoalStatus } from "./Goal";
export type { Technique } from "./Technique";
export type { Evaluation, SkillRating } from "./Evaluation";
export type { CoachingNote } from "./CoachingNote";
export type {
  SessionTemplate,
  TrainingWeek,
  TrainingPlan,
} from "./TrainingPlan";
export type { Team } from "./Team";
export type { MatchPlan, StrategyTemplate, MatchSet } from "./MatchPlan";

// ── Tactical Board ───────────────────────────────────────────────
export type {
  Point,
  Size,
  Team as TacticalTeam,
  RodConfig,
  FigureMarker,
  ArrowType,
  ArrowElement,
  ZoneShape,
  ZoneElement,
  BallMarker,
  ToolType,
  ToolState,
  TacticalScene,
  DrawingInProgress,
} from "./TacticalBoard";
