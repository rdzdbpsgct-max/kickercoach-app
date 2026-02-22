import type { RodConfig, Size } from "../domain/models/TacticalBoard";

/** Field dimensions in abstract coordinate units */
export const FIELD: Size = { width: 1200, height: 680 };

/** Goal dimensions */
export const GOAL: Size = { width: 20, height: 200 };

/** Playable Y margins (figures stay within) */
export const FIELD_MARGIN = 50;

/** Standard Leo model rod configuration */
export const RODS: RodConfig[] = [
  { index: 0, team: "red", xPosition: 60, figureCount: 1, label: "Torwart" },
  { index: 1, team: "red", xPosition: 180, figureCount: 2, label: "2er" },
  { index: 2, team: "blue", xPosition: 340, figureCount: 5, label: "5er" },
  { index: 3, team: "red", xPosition: 460, figureCount: 5, label: "5er" },
  { index: 4, team: "blue", xPosition: 600, figureCount: 3, label: "3er" },
  { index: 5, team: "red", xPosition: 740, figureCount: 3, label: "3er" },
  { index: 6, team: "blue", xPosition: 860, figureCount: 2, label: "2er" },
  {
    index: 7,
    team: "blue",
    xPosition: 1140,
    figureCount: 1,
    label: "Torwart",
  },
];

/** Arrow styling per type */
export const ARROW_STYLES: Record<
  string,
  { color: string; dash: number[]; strokeWidth: number }
> = {
  pass: { color: "#3b82f6", dash: [], strokeWidth: 3 },
  shot: { color: "#ef4444", dash: [], strokeWidth: 4 },
  block: { color: "#f59e0b", dash: [10, 5], strokeWidth: 3 },
};

/** Default zone colors (semi-transparent) */
export const ZONE_COLORS = [
  "rgba(59, 130, 246, 0.15)",
  "rgba(239, 68, 68, 0.15)",
  "rgba(245, 158, 11, 0.15)",
  "rgba(34, 197, 94, 0.15)",
];

/** Team figure colors */
export const TEAM_COLORS: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
};

/** Canvas colors matching theme */
export const BOARD_COLORS = {
  field: "#1a5c2a",
  fieldLine: "rgba(255, 255, 255, 0.2)",
  fieldBorder: "#5c3a1a",
  ball: "#f59e0b",
  text: "#e8eaf0",
};

/** Figure marker radius in field coordinates */
export const FIGURE_RADIUS = 18;

/** Ball marker radius in field coordinates */
export const BALL_RADIUS = 10;

/**
 * Realistic figure spacing per figure count (Leo model).
 * On a real table, figures are rigidly fixed on the rod.
 * Values in field coordinate units.
 */
export const FIGURE_SPACING: Record<number, number> = {
  1: 0, // Goalkeeper – single figure, centered
  2: 190, // 2er-Stange – ~28% of field height
  3: 115, // 3er-Stange – ~17% of field height
  5: 70, // 5er-Stange – ~10% of field height
};
