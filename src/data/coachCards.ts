import type { CoachCard } from "../domain/models/CoachCard";

let _cache: CoachCard[] | null = null;

export async function loadCoachCards(): Promise<CoachCard[]> {
  if (_cache) return _cache;
  // Prefix with the app's base URL ("/kicker-coach/" in dev, "/" on Vercel)
  // so the fetch resolves correctly under any base.
  const resp = await fetch(`${import.meta.env.BASE_URL}data/coachCards.json`);
  _cache = await resp.json();
  return _cache!;
}

// Keep sync export for backward compat (lazy loaded)
export const COACH_CARDS: CoachCard[] = [];
