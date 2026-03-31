/**
 * localStorage monitoring and backup utilities
 */

const STORE_KEY = "kickercoach-store";

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

/**
 * Export all store data as a downloadable JSON file.
 */
export function exportStoreData(): void {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      alert("Keine Daten zum Exportieren gefunden.");
      return;
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
  } catch (err) {
    alert("Export fehlgeschlagen: " + (err instanceof Error ? err.message : "Unbekannter Fehler"));
  }
}

/**
 * Import store data from a JSON file.
 * Returns true if successful.
 */
export function importStoreData(file: File): Promise<boolean> {
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
            current.state = parsed;
            localStorage.setItem(STORE_KEY, JSON.stringify(current));
            resolve(true);
            return;
          }
          alert("Ungueltiges Backup-Format.");
          resolve(false);
          return;
        }

        const state = parsed.state ?? parsed;
        const raw = localStorage.getItem(STORE_KEY);
        const current = raw ? JSON.parse(raw) : {};
        current.state = state;
        localStorage.setItem(STORE_KEY, JSON.stringify(current));
        resolve(true);
      } catch (err) {
        alert("Import fehlgeschlagen: " + (err instanceof Error ? err.message : "Unbekannter Fehler"));
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
}
