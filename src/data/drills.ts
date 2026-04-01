import type { Drill } from "../domain/models/Drill";

let _cache: Drill[] | null = null;

export async function loadDrills(): Promise<Drill[]> {
  if (_cache) return _cache;
  const resp = await fetch("/data/drills.json");
  _cache = await resp.json();
  return _cache!;
}

// Keep sync export for backward compat (lazy loaded)
export const DEFAULT_DRILLS: Drill[] = [];
