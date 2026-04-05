/**
 * localStorage monitoring and backup utilities
 */

import { migrateArray } from "../store/migrate";
import { PlayerSchema } from "../domain/schemas/player";
import { GoalSchema } from "../domain/schemas/goal";
import { EvaluationSchema } from "../domain/schemas/evaluation";
import { CoachingNoteSchema } from "../domain/schemas/coachingNote";
import { SessionSchema } from "../domain/schemas/session";
import { MatchPlanSchema } from "../domain/schemas/matchPlan";
import { MatchSchema } from "../domain/schemas/match";
import { TacticalSceneSchema } from "../domain/schemas/tacticalBoard";
import { PlayerTechniqueSchema } from "../domain/schemas/playerTechnique";
import { TrainingPlanSchema } from "../domain/schemas/trainingPlan";

const STORE_KEY = "kickercoach-store";

/**
 * Schema map for validating imported state arrays.
 * Each key corresponds to a state property that holds an array of domain objects.
 */
const ARRAY_SCHEMAS: Record<string, import("zod").ZodType> = {
  players: PlayerSchema,
  goals: GoalSchema,
  evaluations: EvaluationSchema,
  coachingNotes: CoachingNoteSchema,
  sessions: SessionSchema,
  matchPlans: MatchPlanSchema,
  matches: MatchSchema,
  boardScenes: TacticalSceneSchema,
  playerTechniques: PlayerTechniqueSchema,
  trainingPlans: TrainingPlanSchema,
};

export interface StorageUsage {
  usedBytes: number;
  usedKB: number;
  usedMB: number;
  estimatedLimitMB: number;
  percentUsed: number;
}

/**
 * Get current localStorage usage for the app store.
 */
export function getStorageUsage(): StorageUsage {
  const estimatedLimitMB = 5;
  const estimatedLimitBytes = estimatedLimitMB * 1024 * 1024;

  let totalBytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        totalBytes += (localStorage.getItem(key) ?? "").length * 2; // UTF-16
      }
    }
  } catch {
    totalBytes = 0;
  }

  return {
    usedBytes: totalBytes,
    usedKB: Math.round(totalBytes / 1024),
    usedMB: Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
    estimatedLimitMB,
    percentUsed: Math.round((totalBytes / estimatedLimitBytes) * 100),
  };
}

export interface ExportResult {
  success: boolean;
  error?: string;
}

/**
 * Export all store data as a downloadable JSON file.
 * Returns a result object instead of using alert().
 */
export function exportStoreData(): ExportResult {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      return { success: false, error: "Keine Daten zum Exportieren gefunden." };
    }

    const data = JSON.parse(raw);
    const exportPayload = {
      _meta: {
        app: "KickerCoach",
        exportedAt: new Date().toISOString(),
        version: data.version ?? "unknown",
      },
      state: data.state,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kickercoach-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: "Export fehlgeschlagen: " + (err instanceof Error ? err.message : "Unbekannter Fehler"),
    };
  }
}

/**
 * Validate and sanitize a state object by running every known array
 * through its Zod schema via migrateArray. Invalid items are silently
 * dropped (with a console warning).
 */
function validateState(state: Record<string, unknown>): Record<string, unknown> {
  const validated = { ...state };

  for (const [key, schema] of Object.entries(ARRAY_SCHEMAS)) {
    if (key in validated && Array.isArray(validated[key])) {
      const original = validated[key] as unknown[];
      const cleaned = migrateArray(original, schema);
      const dropped = original.length - cleaned.length;
      if (dropped > 0) {
        console.warn(
          `[KickerCoach Import] Dropped ${dropped} invalid item(s) from "${key}" (${original.length} → ${cleaned.length})`,
        );
      }
      validated[key] = cleaned;
    }
  }

  return validated;
}

export interface ImportResult {
  success: boolean;
  error?: string;
}

/**
 * Import store data from a JSON file.
 * The caller is responsible for confirming with the user before calling this.
 * Returns a result object indicating success or failure.
 */
export function importStoreData(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Validate structure
        if (!parsed.state && !parsed._meta) {
          // Maybe it's a raw state export
          if (typeof parsed === "object" && parsed !== null) {
            const raw = localStorage.getItem(STORE_KEY);
            const current = raw ? JSON.parse(raw) : {};
            current.state = validateState(parsed as Record<string, unknown>);
            localStorage.setItem(STORE_KEY, JSON.stringify(current));
            resolve({ success: true });
            return;
          }
          resolve({ success: false, error: "Ungueltiges Backup-Format." });
          return;
        }

        const state = parsed.state ?? parsed;
        const validatedState = validateState(state as Record<string, unknown>);
        const raw = localStorage.getItem(STORE_KEY);
        const current = raw ? JSON.parse(raw) : {};
        current.state = validatedState;
        localStorage.setItem(STORE_KEY, JSON.stringify(current));
        resolve({ success: true });
      } catch (err) {
        resolve({
          success: false,
          error: "Import fehlgeschlagen: " + (err instanceof Error ? err.message : "Unbekannter Fehler"),
        });
      }
    };
    reader.readAsText(file);
  });
}
