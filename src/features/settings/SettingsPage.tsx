import { useState, useRef, useEffect } from "react";
import { Button, Card } from "../../components/ui";
import { getStorageUsage, exportStoreData, importStoreData } from "../../utils/storage";
import type { StorageUsage } from "../../utils/storage";

export default function SettingsPage() {
  const [usage, setUsage] = useState<StorageUsage | null>(null);
  const [importStatus, setImportStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsage(getStorageUsage());
  }, []);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      "Achtung: Der Import ersetzt deine aktuellen Daten. Moechtest du fortfahren?",
    );
    if (!confirmed) return;

    setImportStatus("Importiere...");
    const success = await importStoreData(file);
    if (success) {
      setImportStatus("Import erfolgreich! Seite wird neu geladen...");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setImportStatus("Import fehlgeschlagen.");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      <h1 className="text-xl font-bold text-text">Einstellungen</h1>

      {/* Storage usage */}
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-text">Speicher</h2>
        {usage && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-xs text-text-dim">
                  <span>{usage.usedKB} KB belegt</span>
                  <span>~{usage.estimatedLimitMB} MB Limit</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usage.percentUsed > 80
                        ? "bg-kicker-red"
                        : usage.percentUsed > 50
                          ? "bg-kicker-orange"
                          : "bg-kicker-green"
                    }`}
                    style={{ width: `${Math.min(100, usage.percentUsed)}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-text">
                {usage.percentUsed}%
              </span>
            </div>
            {usage.percentUsed > 80 && (
              <div className="rounded-lg bg-kicker-red/10 p-2 text-xs text-kicker-red">
                Speicher fast voll! Exportiere deine Daten als Backup und loesche alte Sessions.
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Export / Import */}
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-text">Daten-Backup</h2>
        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-2 text-xs text-text-muted">
              Exportiere alle deine Daten als JSON-Datei. So kannst du ein Backup erstellen oder die Daten auf ein anderes Geraet uebertragen.
            </p>
            <Button size="sm" onClick={exportStoreData}>
              Daten exportieren
            </Button>
          </div>
          <div className="border-t border-border pt-3">
            <p className="mb-2 text-xs text-text-muted">
              Importiere ein zuvor exportiertes Backup. Achtung: Deine aktuellen Daten werden ersetzt!
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Backup importieren
            </Button>
            {importStatus && (
              <p className="mt-2 text-xs text-accent">{importStatus}</p>
            )}
          </div>
        </div>
      </Card>

      {/* App info */}
      <Card>
        <h2 className="mb-2 text-sm font-semibold text-text">KickerCoach</h2>
        <p className="text-xs text-text-dim">by SpielerGeist</p>
        <p className="mt-1 text-xs text-text-dim">
          Deine digitale Coaching-App fuer Tischfussball.
        </p>
      </Card>
    </div>
  );
}
