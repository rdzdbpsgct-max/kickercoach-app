import type { Difficulty, Category } from "./models/CoachCard";
import type { DrillPhase } from "./models/Drill";
import type { Position } from "./models/Player";
import type { TechniqueStatus } from "./models/PlayerTechnique";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Einsteiger",
  intermediate: "Fortgeschritten",
  advanced: "Profi",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: "bg-kicker-green/15 text-kicker-green",
  intermediate: "bg-kicker-orange/15 text-kicker-orange",
  advanced: "bg-kicker-red/15 text-kicker-red",
};

export const DIFFICULTY_TEXT_COLORS: Record<Difficulty, string> = {
  beginner: "text-kicker-green",
  intermediate: "text-kicker-orange",
  advanced: "text-kicker-red",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Torschuss: "bg-kicker-red/15 text-kicker-red",
  Passspiel: "bg-kicker-blue/15 text-kicker-blue",
  Ballkontrolle: "bg-accent-dim text-accent",
  Defensive: "bg-kicker-green/15 text-kicker-green",
  Taktik: "bg-kicker-orange/15 text-kicker-orange",
  Offensive: "bg-kicker-blue/15 text-kicker-blue",
  Mental: "bg-accent-dim text-accent-hover",
};

export const CATEGORY_BAR_COLORS: Record<Category, string> = {
  Torschuss: "bg-kicker-red/70",
  Passspiel: "bg-kicker-blue/70",
  Ballkontrolle: "bg-kicker-orange/70",
  Defensive: "bg-kicker-green/70",
  Taktik: "bg-accent/70",
  Offensive: "bg-kicker-red/50",
  Mental: "bg-accent-hover/70",
};

export const STORAGE_KEYS = {
  favorites: "kickercoach-favorites",
  sessions: "kickercoach-sessions",
  matchplans: "kickercoach-matchplans",
  autoAdvance: "kickercoach-autoadvance",
  boardScenes: "kickercoach-board-scenes",
} as const;

export const PHASE_LABELS: Record<DrillPhase, string> = {
  warmup: "Aufwaermen",
  technique: "Technik",
  game: "Spielform",
  cooldown: "Cool-Down",
};

export const PHASE_COLORS: Record<DrillPhase, string> = {
  warmup: "bg-kicker-orange/15 text-kicker-orange",
  technique: "bg-kicker-blue/15 text-kicker-blue",
  game: "bg-kicker-green/15 text-kicker-green",
  cooldown: "bg-accent-dim text-accent",
};

export const POSITION_LABELS: Record<Position, string> = {
  offense: "Sturm",
  defense: "Abwehr",
  both: "Beides",
};

export const TECHNIQUE_STATUS_LABELS: Record<TechniqueStatus, string> = {
  not_started: "Nicht begonnen",
  learning: "Lernend",
  developing: "Aufbauend",
  proficient: "Sicher",
  mastered: "Gemeistert",
};

export const TECHNIQUE_STATUS_COLORS: Record<TechniqueStatus, string> = {
  not_started: "bg-border",
  learning: "bg-kicker-orange",
  developing: "bg-kicker-blue",
  proficient: "bg-kicker-green",
  mastered: "bg-accent",
};

export const MAX_VISIBLE_TAGS = 3;
