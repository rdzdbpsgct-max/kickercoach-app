import { useAppStore } from "./useAppStore";
import { migrateArray } from "./migrate";
import { SessionSchema } from "../domain/schemas/session";
import { MatchPlanSchema } from "../domain/schemas/matchPlan";
import { TacticalSceneSchema } from "../domain/schemas/tacticalBoard";
import { STORAGE_KEYS } from "../domain/constants";

const LEGACY_MIGRATED_KEY = "kickercoach-legacy-migrated";

export function migrateLegacyStorage(): void {
  if (localStorage.getItem(LEGACY_MIGRATED_KEY)) return;

  const store = useAppStore.getState();
  let migrated = false;

  // Migrate sessions
  const rawSessions = localStorage.getItem(STORAGE_KEYS.sessions);
  if (rawSessions && store.sessions.length === 0) {
    try {
      const parsed = JSON.parse(rawSessions);
      const sessions = migrateArray(parsed, SessionSchema);
      if (sessions.length > 0) {
        useAppStore.setState({ sessions });
        migrated = true;
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Migrate match plans
  const rawPlans = localStorage.getItem(STORAGE_KEYS.matchplans);
  if (rawPlans && store.matchPlans.length === 0) {
    try {
      const parsed = JSON.parse(rawPlans);
      const plans = migrateArray(parsed, MatchPlanSchema);
      if (plans.length > 0) {
        useAppStore.setState({ matchPlans: plans });
        migrated = true;
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Migrate board scenes
  const rawScenes = localStorage.getItem(STORAGE_KEYS.boardScenes);
  if (rawScenes && store.boardScenes.length === 0) {
    try {
      const parsed = JSON.parse(rawScenes);
      const scenes = migrateArray(parsed, TacticalSceneSchema);
      if (scenes.length > 0) {
        useAppStore.setState({ boardScenes: scenes });
        migrated = true;
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Migrate favorites
  const rawFavorites = localStorage.getItem(STORAGE_KEYS.favorites);
  if (rawFavorites && store.favorites.length === 0) {
    try {
      const parsed = JSON.parse(rawFavorites);
      if (Array.isArray(parsed) && parsed.length > 0) {
        useAppStore.setState({ favorites: parsed });
        migrated = true;
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  if (migrated) {
    // Clean up old keys
    localStorage.removeItem(STORAGE_KEYS.sessions);
    localStorage.removeItem(STORAGE_KEYS.matchplans);
    localStorage.removeItem(STORAGE_KEYS.boardScenes);
    localStorage.removeItem(STORAGE_KEYS.favorites);
  }

  localStorage.setItem(LEGACY_MIGRATED_KEY, "true");
}
