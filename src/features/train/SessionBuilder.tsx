import { useState } from "react";
import type { Drill } from "../../domain/models/Drill";
import type { Category } from "../../domain/models/CoachCard";
import { drillTotalDuration, formatTime } from "../../domain/logic";
import { calculateSessionDuration } from "../../domain/logic/session";
import { Button, FormField, Input, Select, Textarea } from "../../components/ui";
import { useAppStore } from "../../store";
import type { Session } from "../../store";

const CATEGORIES: Category[] = [
  "Torschuss",
  "Passspiel",
  "Ballkontrolle",
  "Defensive",
  "Taktik",
  "Offensive",
  "Mental",
];

const STAR_LABELS = ["", "Schlecht", "Mässig", "OK", "Gut", "Super"];

interface SessionBuilderProps {
  drills: Drill[];
  onSave: (session: Session) => void;
  onCancel: () => void;
  editSession?: Session | null;
  initialPlayerIds?: string[];
}

export default function SessionBuilder({
  drills,
  onSave,
  onCancel,
  editSession,
  initialPlayerIds,
}: SessionBuilderProps) {
  const players = useAppStore((s) => s.players);
  const sessionTemplates = useAppStore((s) => s.sessionTemplates);
  const saveSessionAsTemplate = useAppStore((s) => s.saveSessionAsTemplate);
  const [templateSaved, setTemplateSaved] = useState(false);

  const [name, setName] = useState(editSession?.name ?? "");
  const [selectedDrillIds, setSelectedDrillIds] = useState<string[]>(
    editSession?.drillIds ?? [],
  );
  const [notes, setNotes] = useState(editSession?.notes ?? "");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(
    editSession?.playerIds ?? initialPlayerIds ?? [],
  );
  const [focusAreas, setFocusAreas] = useState<Category[]>(
    editSession?.focusAreas ?? [],
  );
  const [rating, setRating] = useState<number | undefined>(editSession?.rating);

  const totalDuration = calculateSessionDuration(selectedDrillIds, drills);

  const toggleDrill = (id: string) => {
    setSelectedDrillIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const togglePlayer = (id: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const toggleFocusArea = (cat: Category) => {
    setFocusAreas((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
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
      playerIds: selectedPlayerIds,
      focusAreas,
      rating,
    };
    onSave(session);
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Session erstellen</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Abbrechen
          </Button>
          {name.trim() && selectedDrillIds.length > 0 && (
            <Button
              variant="secondary"
              disabled={templateSaved}
              onClick={() => {
                saveSessionAsTemplate({
                  id: crypto.randomUUID(),
                  name: name.trim(),
                  drillIds: selectedDrillIds,
                  focusAreas,
                });
                setTemplateSaved(true);
              }}
            >
              {templateSaved ? "Vorlage gespeichert" : "Als Vorlage"}
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!name.trim() || selectedDrillIds.length === 0}
          >
            Speichern
          </Button>
        </div>
      </div>

      {/* Load from template */}
      {sessionTemplates.length > 0 && !editSession && (
        <FormField label="Aus Vorlage laden">
          <Select
            value=""
            onChange={(e) => {
              const tmpl = sessionTemplates.find((t) => t.id === e.target.value);
              if (tmpl) {
                setName(tmpl.name);
                setSelectedDrillIds(tmpl.drillIds);
                setFocusAreas(tmpl.focusAreas);
              }
            }}
          >
            <option value="">Vorlage waehlen...</option>
            {sessionTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.drillIds.length} Drills)
              </option>
            ))}
          </Select>
        </FormField>
      )}

      {/* Name */}
      <FormField label="Session-Name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z.B. Morgen-Training, Schuss-Drill..."
        />
      </FormField>

      {/* Player selection */}
      {players.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-dim">
            Spieler ({selectedPlayerIds.length} ausgew&auml;hlt)
          </label>
          <div className="flex flex-wrap gap-2">
            {players.map((player) => {
              const isSelected = selectedPlayerIds.includes(player.id);
              return (
                <button
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "border-accent bg-accent-dim text-accent-hover"
                      : "border-border text-text-muted hover:border-accent/50"
                  }`}
                >
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: player.avatarColor ?? "#6366f1" }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </span>
                  {player.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

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

      {/* Focus areas */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-dim">
          Schwerpunkte
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = focusAreas.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleFocusArea(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "border-2 border-accent bg-accent-dim text-accent-hover"
                    : "border border-border text-text-muted hover:border-accent/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-dim">
          Bewertung {rating ? `\u2014 ${STAR_LABELS[rating]}` : ""}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(rating === star ? undefined : star)}
              className={`text-2xl transition-transform hover:scale-110 ${
                rating && star <= rating
                  ? "text-kicker-orange"
                  : "text-text-dim"
              }`}
              aria-label={`${star} Sterne`}
            >
              {rating && star <= rating ? "\u2605" : "\u2606"}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <FormField label="Notizen">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optionale Notizen zur Session..."
          rows={3}
        />
      </FormField>
    </div>
  );
}
