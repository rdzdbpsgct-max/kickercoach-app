import { useState, useEffect } from "react";
import type { MatchPlan, StrategyTemplate } from "../../domain/models/MatchPlan";
import { Button, FormField, Input, Textarea, Select } from "../../components/ui";

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

  const update = (field: keyof MatchPlan, value: string | string[]) => {
    onChange({ ...plan, [field]: value });
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
