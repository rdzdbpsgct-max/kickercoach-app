import { useState, useEffect } from "react";
import type { MatchPlan, StrategyTemplate } from "../../domain/models/MatchPlan";

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
          <button
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm text-text-muted hover:border-accent/50 transition-all"
          >
            Abbrechen
          </button>
          <button
            onClick={onSave}
            className="rounded-xl border-2 border-accent bg-accent-dim px-4 py-2 text-sm font-semibold text-accent-hover hover:bg-accent hover:text-white transition-all"
          >
            Speichern
          </button>
        </div>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-dim">Gegner</label>
          <input
            type="text"
            value={plan.opponent}
            onChange={(e) => update("opponent", e.target.value)}
            placeholder="Gegner-Team"
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-dim">Datum</label>
          <input
            type="date"
            value={plan.date}
            onChange={(e) => update("date", e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Analysis */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-dim">
          Gegneranalyse
        </label>
        <textarea
          value={plan.analysis}
          onChange={(e) => update("analysis", e.target.value)}
          placeholder="Staerken, Schwaechen, typische Spielmuster..."
          rows={4}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none resize-none"
        />
      </div>

      {/* Strategy Templates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-dim">
            Offensive Strategie
          </label>
          <select
            value={plan.offensiveStrategy ?? ""}
            onChange={(e) => update("offensiveStrategy", e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            <option value="">Keine Vorlage</option>
            {offensiveTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
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
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-dim">
            Defensive Strategie
          </label>
          <select
            value={plan.defensiveStrategy ?? ""}
            onChange={(e) => update("defensiveStrategy", e.target.value)}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus:border-accent focus:outline-none"
          >
            <option value="">Keine Vorlage</option>
            {defensiveTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
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
        </div>
      </div>

      {/* Gameplan */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-dim">Gameplan</label>
        <textarea
          value={plan.gameplan}
          onChange={(e) => update("gameplan", e.target.value)}
          placeholder="Taktische Ausrichtung, Schuss-Strategie, defensive Aufstellung..."
          rows={4}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none resize-none"
        />
      </div>

      {/* Timeout Strategies */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-dim">
          Timeout-Strategien
        </label>
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
            <input
              type="text"
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addStrategy()}
              placeholder="Neue Strategie hinzufuegen..."
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
            />
            <button
              onClick={addStrategy}
              className="rounded-xl border border-border px-4 py-2 text-sm text-text-muted hover:border-accent/50 transition-all"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-dim">Notizen</label>
        <textarea
          value={plan.notes}
          onChange={(e) => update("notes", e.target.value)}
          placeholder="Sonstige Notizen..."
          rows={3}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
