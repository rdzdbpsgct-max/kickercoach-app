import { useState } from "react";
import type { Drill } from "../../domain/models/Drill";
import type { Session } from "../../domain/models/Session";
import { drillTotalDuration, formatTime } from "../../domain/logic";
import { calculateSessionDuration } from "../../domain/logic/session";

interface SessionBuilderProps {
  drills: Drill[];
  onSave: (session: Session) => void;
  onCancel: () => void;
  editSession?: Session | null;
}

export default function SessionBuilder({
  drills,
  onSave,
  onCancel,
  editSession,
}: SessionBuilderProps) {
  const [name, setName] = useState(editSession?.name ?? "");
  const [selectedDrillIds, setSelectedDrillIds] = useState<string[]>(
    editSession?.drillIds ?? [],
  );
  const [notes, setNotes] = useState(editSession?.notes ?? "");

  const totalDuration = calculateSessionDuration(selectedDrillIds, drills);

  const toggleDrill = (id: string) => {
    setSelectedDrillIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    if (!name.trim() || selectedDrillIds.length === 0) return;

    const session: Session = {
      id: editSession?.id ?? crypto.randomUUID(),
      name: name.trim(),
      date: new Date().toISOString().slice(0, 10),
      drillIds: selectedDrillIds,
      notes: notes.trim(),
      totalDuration,
    };
    onSave(session);
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Session erstellen</h2>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm text-text-muted hover:border-accent/50 transition-all"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || selectedDrillIds.length === 0}
            className="rounded-xl border-2 border-accent bg-accent-dim px-4 py-2 text-sm font-semibold text-accent-hover hover:bg-accent hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Speichern
          </button>
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-dim">
          Session-Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z.B. Morgen-Training, Schuss-Drill..."
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
        />
      </div>

      {/* Drill selection */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-dim">
            Drills auswaehlen
          </label>
          <span className="text-xs text-text-dim">
            {selectedDrillIds.length} ausgewaehlt &middot;{" "}
            {formatTime(totalDuration)}
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
          {drills.map((drill) => {
            const isSelected = selectedDrillIds.includes(drill.id);
            return (
              <button
                key={drill.id}
                onClick={() => toggleDrill(drill.id)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                  isSelected
                    ? "border-accent bg-accent-dim text-text"
                    : "border-border text-text-muted hover:border-accent/50"
                }`}
              >
                <div>
                  <span className="font-medium">{drill.name}</span>
                  <span className="ml-2 text-xs text-text-dim">
                    {drill.focusSkill}
                  </span>
                </div>
                <span className="text-xs text-text-dim">
                  {formatTime(drillTotalDuration(drill))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-dim">Notizen</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optionale Notizen zur Session..."
          rows={3}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
