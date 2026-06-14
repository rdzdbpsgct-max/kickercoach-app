import type { Drill } from "../domain/models/Drill";

let _cache: Drill[] | null = null;

export async function loadDrills(): Promise<Drill[]> {
  if (_cache) return _cache;
  // Prefix with the app's base URL ("/kicker-coach/" in dev, "/" on Vercel)
  // so the fetch resolves correctly under any base.
  const resp = await fetch(`${import.meta.env.BASE_URL}data/drills.json`);
  _cache = await resp.json();
  return _cache!;
}

// Keep sync export for backward compat (lazy loaded)
export const DEFAULT_DRILLS: Drill[] = [];
