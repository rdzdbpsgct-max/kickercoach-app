import { useState, useEffect } from "react";
import type { TrainingPlan, TrainingWeek, SessionTemplate } from "../../domain/models/TrainingPlan";
import type { Category } from "../../domain/models/CoachCard";
import type { Drill } from "../../domain/models/Drill";
import { Button, FormField, Input, Textarea, Card } from "../../components/ui";
import { useAppStore } from "../../store";
import { generateId } from "../../utils/id";

const EMPTY_SESSION: SessionTemplate = {
  name: "",
  drillIds: [],
  focusAreas: [],
  estimatedDuration: 30,
};

const CATEGORIES: Category[] = [
  "Torschuss", "Passspiel", "Ballkontrolle", "Defensive", "Taktik", "Offensive", "Mental",
];

interface TrainingPlanEditorProps {
  plan?: TrainingPlan;
  onSave: (plan: TrainingPlan) => void;
  onCancel: () => void;
}

export default function TrainingPlanEditor({ plan, onSave, onCancel }: TrainingPlanEditorProps) {
  const players = useAppStore((s) => s.players);
  const customDrills = useAppStore((s) => s.customDrills);

  const [availableDrills, setAvailableDrills] = useState<Drill[]>([]);
  const [name, setName] = useState(plan?.name ?? "");
  const [goal, setGoal] = useState(plan?.goal ?? "");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(plan?.playerIds ?? []);
  const [weeks, setWeeks] = useState<TrainingWeek[]>(
    plan?.weeks ?? [{ weekNumber: 1, sessionTemplates: [{ ...EMPTY_SESSION }] }],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    import("../../data/drills").then((mod) => mod.loadDrills().then((d) => setAvailableDrills([...d, ...customDrills])));
  }, [customDrills]);

  const addWeek = () => {
    setWeeks([...weeks, { weekNumber: weeks.length + 1, sessionTemplates: [{ ...EMPTY_SESSION }] }]);
  };

  const removeWeek = (weekIdx: number) => {
    if (weeks.length <= 1) return;
    setWeeks(
      weeks
        .filter((_, i) => i !== weekIdx)
        .map((w, i) => ({ ...w, weekNumber: i + 1 })),
    );
  };

  const addSession = (weekIdx: number) => {
    setWeeks(
      weeks.map((w, i) =>
        i === weekIdx
          ? { ...w, sessionTemplates: [...w.sessionTemplates, { ...EMPTY_SESSION }] }
          : w,
      ),
    );
  };

  const removeSession = (weekIdx: number, sessionIdx: number) => {
    setWeeks(
      weeks.map((w, i) =>
        i === weekIdx
          ? { ...w, sessionTemplates: w.sessionTemplates.filter((_, si) => si !== sessionIdx) }
          : w,
      ),
    );
  };

  const updateSession = (weekIdx: number, sessionIdx: number, updates: Partial<SessionTemplate>) => {
    setWeeks(
      weeks.map((w, wi) =>
        wi === weekIdx
          ? {
              ...w,
              sessionTemplates: w.sessionTemplates.map((s, si) =>
                si === sessionIdx ? { ...s, ...updates } : s,
              ),
            }
          : w,
      ),
    );
  };

  const toggleFocusArea = (weekIdx: number, sessionIdx: number, cat: Category) => {
    const session = weeks[weekIdx].sessionTemplates[sessionIdx];
    const newAreas = session.focusAreas.includes(cat)
      ? session.focusAreas.filter((c) => c !== cat)
      : [...session.focusAreas, cat];
    updateSession(weekIdx, sessionIdx, { focusAreas: newAreas });
  };

  const togglePlayer = (id: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name ist erforderlich";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: plan?.id ?? generateId(),
      name: name.trim(),
      playerIds: selectedPlayerIds,
      weeks,
      goal: goal.trim() || undefined,
      createdAt: plan?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {plan ? "Plan bearbeiten" : "Neuer Trainingsplan"}
        </h2>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>Abbrechen</Button>
          <Button type="submit">Speichern</Button>
        </div>
      </div>

      <FormField label="Planname" required error={errors.name}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. 4-Wochen Schuss-Fokus" error={errors.name} />
      </FormField>

      <FormField label="Ziel">
        <Textarea value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Was soll der Plan erreichen?" rows={2} />
      </FormField>

      {/* Player selection */}
      {players.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-dim">Spieler</label>
          <div className="flex flex-wrap gap-2">
            {players.map((player) => {
              const isSelected = selectedPlayerIds.includes(player.id);
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => togglePlayer(player.id)}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "border-accent bg-accent-dim text-accent-hover"
                      : "border-border text-text-muted hover:border-accent/50"
                  }`}
                >
                  <span
                    className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
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

      {/* Weeks */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-dim">Wochen ({weeks.length})</label>
          <Button type="button" variant="secondary" size="sm" onClick={addWeek}>+ Woche</Button>
        </div>

        {weeks.map((week, wi) => (
          <Card key={wi}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text">Woche {week.weekNumber}</h3>
              <div className="flex gap-1.5">
                <Button type="button" variant="ghost" size="sm" onClick={() => addSession(wi)}>
                  + Session
                </Button>
                {weeks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWeek(wi)}
                    className="text-xs text-text-dim hover:text-kicker-red transition-colors"
                  >
                    &#10005;
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {week.sessionTemplates.map((session, si) => (
                <div key={si} className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      value={session.name}
                      onChange={(e) => updateSession(wi, si, { name: e.target.value })}
                      placeholder={`Session ${si + 1}`}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={5}
                      value={session.estimatedDuration}
                      onChange={(e) =>
                        updateSession(wi, si, { estimatedDuration: Math.max(5, Number(e.target.value)) })
                      }
                      className="!w-20 text-center"
                    />
                    <span className="text-[10px] text-text-dim">Min.</span>
                    {week.sessionTemplates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSession(wi, si)}
                        className="text-xs text-text-dim hover:text-kicker-red transition-colors"
                      >
                        &#10005;
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleFocusArea(wi, si, cat)}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-all ${
                          session.focusAreas.includes(cat)
                            ? "border-2 border-accent bg-accent-dim text-accent-hover"
                            : "border border-border text-text-dim hover:border-accent/50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-text-dim">Drills</label>
                    <div className="flex flex-wrap gap-1">
                      {availableDrills.map((drill) => (
                        <button
                          key={drill.id}
                          type="button"
                          onClick={() => {
                            const current = session.drillIds;
                            const newIds = current.includes(drill.id)
                              ? current.filter((id) => id !== drill.id)
                              : [...current, drill.id];
                            updateSession(wi, si, { drillIds: newIds });
                          }}
                          className={`rounded-full px-2 py-1 text-[11px] min-h-[36px] transition-all ${
                            session.drillIds.includes(drill.id)
                              ? "border-2 border-accent bg-accent-dim text-accent-hover"
                              : "border border-border text-text-muted"
                          }`}
                        >
                          {drill.name}
                        </button>
                      ))}
                    </div>
                    {session.drillIds.length > 0 && (
                      <span className="text-[10px] text-text-dim">{session.drillIds.length} Drills gewaehlt</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </form>
  );
}
