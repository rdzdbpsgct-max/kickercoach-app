import { useState, useEffect } from "react";
import type { MatchPlan, MatchSet, StrategyTemplate } from "../../domain/models/MatchPlan";
import { useAppStore } from "../../store";
import { Button, Badge, Card, FormField, Input, Textarea, Select } from "../../components/ui";
import { printCurrentPage } from "../../utils/print";

interface MatchPlanEditorProps {
  plan: MatchPlan;
  onChange: (plan: MatchPlan) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function MatchPlanEditor({
  plan,
  onChange,
  onSave,
  onCancel,
}: MatchPlanEditorProps) {
  const [newStrategy, setNewStrategy] = useState("");
  const [templates, setTemplates] = useState<StrategyTemplate[]>([]);
  const players = useAppStore((s) => s.players);

  useEffect(() => {
    import("../../data/strategyTemplates").then((mod) => {
      setTemplates(mod.STRATEGY_TEMPLATES);
    });
  }, []);

  const offensiveTemplates = templates.filter((t) => t.category === "offensive");
  const defensiveTemplates = templates.filter((t) => t.category === "defensive");

  const selectedOffensive = templates.find(
    (t) => t.id === plan.offensiveStrategy,
  );
  const selectedDefensive = templates.find(
    (t) => t.id === plan.defensiveStrategy,
  );

  const update = (field: keyof MatchPlan, value: unknown) => {
    onChange({ ...plan, [field]: value });
  };

  const computeResult = (sets: MatchSet[]): "win" | "loss" | "draw" | undefined => {
    if (sets.length === 0) return undefined;
    let home = 0;
    let away = 0;
    for (const s of sets) {
      if (s.scoreHome > s.scoreAway) home++;
      else if (s.scoreAway > s.scoreHome) away++;
    }
    if (home > away) return "win";
    if (away > home) return "loss";
    return "draw";
  };

  const addSet = () => {
    const sets = plan.sets ?? [];
    const newSet: MatchSet = { setNumber: sets.length + 1, scoreHome: 0, scoreAway: 0 };
    const updated = [...sets, newSet];
    onChange({ ...plan, sets: updated, result: computeResult(updated) });
  };

  const updateSet = (index: number, field: "scoreHome" | "scoreAway", value: number) => {
    const sets = [...(plan.sets ?? [])];
    sets[index] = { ...sets[index], [field]: value };
    onChange({ ...plan, sets, result: computeResult(sets) });
  };

  const removeSet = (index: number) => {
    const sets = (plan.sets ?? []).filter((_, i) => i !== index).map((s, i) => ({ ...s, setNumber: i + 1 }));
    onChange({ ...plan, sets, result: computeResult(sets) });
  };

  const togglePlayer = (id: string) => {
    const current = plan.playerIds ?? [];
    const updated = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    update("playerIds", updated);
  };

  const addStrategy = () => {
    if (!newStrategy.trim()) return;
    update("timeoutStrategies", [...plan.timeoutStrategies, newStrategy.trim()]);
    setNewStrategy("");
  };

  const removeStrategy = (index: number) => {
    update(
      "timeoutStrategies",
      plan.timeoutStrategies.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Matchplan bearbeiten</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button variant="secondary" onClick={printCurrentPage}>
            Drucken
          </Button>
          <Button onClick={onSave}>Speichern</Button>
        </div>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Gegner">
          <Input
            value={plan.opponent}
            onChange={(e) => update("opponent", e.target.value)}
            placeholder="Gegner-Team"
          />
        </FormField>
        <FormField label="Datum">
          <Input
            type="date"
            value={plan.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </FormField>
      </div>

      {/* Analysis */}
      <FormField label="Gegneranalyse">
        <Textarea
          value={plan.analysis}
          onChange={(e) => update("analysis", e.target.value)}
          placeholder="Staerken, Schwaechen, typische Spielmuster..."
          rows={4}
        />
      </FormField>

      {/* Strategy Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Offensive Strategie">
          <Select
            value={plan.offensiveStrategy ?? ""}
            onChange={(e) => update("offensiveStrategy", e.target.value)}
          >
            <option value="">Keine Vorlage</option>
            {offensiveTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
          {selectedOffensive && (
            <div className="rounded-lg border border-kicker-blue/20 bg-kicker-blue/5 p-3">
              <p className="mb-2 text-xs leading-relaxed text-text-muted">
                {selectedOffensive.description}
              </p>
              <ul className="flex flex-col gap-1">
                {selectedOffensive.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex gap-1.5 text-[11px] leading-relaxed text-text-dim"
                  >
                    <span className="text-kicker-blue">&#8226;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </FormField>

        <FormField label="Defensive Strategie">
          <Select
            value={plan.defensiveStrategy ?? ""}
            onChange={(e) => update("defensiveStrategy", e.target.value)}
          >
            <option value="">Keine Vorlage</option>
            {defensiveTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
          {selectedDefensive && (
            <div className="rounded-lg border border-kicker-green/20 bg-kicker-green/5 p-3">
              <p className="mb-2 text-xs leading-relaxed text-text-muted">
                {selectedDefensive.description}
              </p>
              <ul className="flex flex-col gap-1">
                {selectedDefensive.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex gap-1.5 text-[11px] leading-relaxed text-text-dim"
                  >
                    <span className="text-kicker-green">&#8226;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </FormField>
      </div>

      {/* Gameplan */}
      <FormField label="Gameplan">
        <Textarea
          value={plan.gameplan}
          onChange={(e) => update("gameplan", e.target.value)}
          placeholder="Taktische Ausrichtung, Schuss-Strategie, defensive Aufstellung..."
          rows={4}
        />
      </FormField>

      {/* Timeout Strategies */}
      <FormField label="Timeout-Strategien">
        <div className="flex flex-col gap-2">
          {plan.timeoutStrategies.map((strategy, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2"
            >
              <span className="flex-1 text-sm text-text-muted">{strategy}</span>
              <button
                onClick={() => removeStrategy(i)}
                className="text-text-dim hover:text-kicker-red transition-colors"
              >
                &#10005;
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStrategy()}
              placeholder="Neue Strategie hinzufuegen..."
            />
            <Button variant="secondary" onClick={addStrategy}>
              +
            </Button>
          </div>
        </div>
      </FormField>

      {/* Player Selection */}
      {players.length > 0 && (
        <FormField label="Spieler">
          <div className="flex flex-wrap gap-2">
            {players.map((p) => (
              <button
                key={p.id}
                onClick={() => togglePlayer(p.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  (plan.playerIds ?? []).includes(p.id)
                    ? "border-2 border-accent bg-accent-dim text-accent-hover"
                    : "border border-border text-text-muted hover:border-accent/50"
                }`}
              >
                <div
                  className="h-5 w-5 rounded-md text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: p.avatarColor ?? "#6366f1" }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </div>
                {p.name}
              </button>
            ))}
          </div>
        </FormField>
      )}

      {/* Set Recording */}
      <FormField label="Ergebnis erfassen">
        <div className="flex flex-col gap-2">
          {(plan.sets ?? []).map((set, i) => (
            <Card key={i} className="flex items-center gap-3">
              <span className="text-xs font-medium text-text-dim w-12">
                Satz {set.setNumber}
              </span>
              <Input
                type="number"
                min={0}
                value={set.scoreHome}
                onChange={(e) => updateSet(i, "scoreHome", Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center"
              />
              <span className="text-text-dim">:</span>
              <Input
                type="number"
                min={0}
                value={set.scoreAway}
                onChange={(e) => updateSet(i, "scoreAway", Math.max(0, parseInt(e.target.value) || 0))}
                className="w-16 text-center"
              />
              <button
                onClick={() => removeSet(i)}
                className="ml-auto text-text-dim hover:text-kicker-red transition-colors text-xs"
              >
                &#10005;
              </button>
            </Card>
          ))}
          <Button variant="secondary" size="sm" onClick={addSet}>
            + Satz hinzufuegen
          </Button>
          {plan.result && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-dim">Ergebnis:</span>
              <Badge
                color={plan.result === "win" ? "green" : plan.result === "loss" ? "red" : "orange"}
              >
                {plan.result === "win" ? "Sieg" : plan.result === "loss" ? "Niederlage" : "Unentschieden"}
              </Badge>
            </div>
          )}
        </div>
      </FormField>

      {/* Notes */}
      <FormField label="Notizen">
        <Textarea
          value={plan.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Sonstige Notizen..."
          rows={3}
        />
      </FormField>
    </div>
  );
}
