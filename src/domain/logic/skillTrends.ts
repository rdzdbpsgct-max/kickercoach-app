import type { Evaluation } from "../models/Evaluation";
import type { Category } from "../models/CoachCard";

export const SKILL_CATEGORIES: Category[] = [
  "Torschuss",
  "Passspiel",
  "Ballkontrolle",
  "Defensive",
  "Taktik",
  "Offensive",
  "Mental",
];

export interface SkillTrend {
  category: Category;
  /** One rating per evaluation date (forward/back-filled so there are no gaps). */
  ratings: number[];
}

export interface SkillTrendsResult {
  dates: string[];
  trends: SkillTrend[];
}

/** Forward-fill nulls, then back-fill any leading nulls with the first known value. */
function fillNulls(raw: (number | null)[]): number[] {
  const out: number[] = [];
  let last: number | null = null;
  for (const v of raw) {
    if (v !== null) last = v;
    out.push(last ?? 0);
  }
  // Back-fill leading zeros that were never set, using the first known value.
  const firstKnown = raw.find((v) => v !== null);
  if (firstKnown != null) {
    for (let i = 0; i < out.length; i++) {
      if (raw[i] === null && out[i] === 0 && i < raw.findIndex((v) => v !== null)) {
        out[i] = firstKnown;
      }
    }
  }
  return out;
}

/**
 * Build per-category skill trends over time from a player's evaluation history.
 * Evaluations are sorted by date ascending; categories never rated are omitted.
 */
export function buildSkillTrends(evaluations: Evaluation[]): SkillTrendsResult {
  const sorted = [...evaluations].sort((a, b) => a.date.localeCompare(b.date));
  const dates = sorted.map((e) => e.date);

  const trends: SkillTrend[] = [];
  for (const cat of SKILL_CATEGORIES) {
    const raw = sorted.map(
      (e) => e.skillRatings.find((r) => r.category === cat)?.rating ?? null,
    );
    if (raw.every((v) => v === null)) continue;
    trends.push({ category: cat, ratings: fillNulls(raw) });
  }

  return { dates, trends };
}
