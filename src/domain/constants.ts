import type { Difficulty, Category } from "./models/CoachCard";

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

export const STORAGE_KEYS = {
  favorites: "kickercoach-favorites",
  sessions: "kickercoach-sessions",
  matchplans: "kickercoach-matchplans",
  autoAdvance: "kickercoach-autoadvance",
} as const;

export const MAX_VISIBLE_TAGS = 3;
