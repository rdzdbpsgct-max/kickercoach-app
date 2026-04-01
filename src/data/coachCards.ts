import type { CoachCard } from "../domain/models/CoachCard";

let _cache: CoachCard[] | null = null;

export async function loadCoachCards(): Promise<CoachCard[]> {
  if (_cache) return _cache;
  const resp = await fetch("/data/coachCards.json");
  _cache = await resp.json();
  return _cache!;
}

// Keep sync export for backward compat (lazy loaded)
export const COACH_CARDS: CoachCard[] = [];
