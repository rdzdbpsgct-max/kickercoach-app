import type { MatchPlan } from "../../domain/models/MatchPlan";

interface MatchPlanListProps {
  plans: MatchPlan[];
  onSelect: (plan: MatchPlan) => void;
  onDelete: (id: string) => void;
  onExport: (plan: MatchPlan) => void;
}

export default function MatchPlanList({
  plans,
  onSelect,
  onDelete,
  onExport,
}: MatchPlanListProps) {
  if (plans.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-text-dim">
        <span className="text-4xl">&#128203;</span>
        <p className="text-sm">Noch keine Matchplaene erstellt.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-auto">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-accent/50 hover:bg-card-hover"
        >
          <button
            onClick={() => onSelect(plan)}
            className="flex-1 text-left"
          >
            <div className="text-sm font-semibold text-text">
              vs. {plan.opponent || "Unbenannt"}
            </div>
            <div className="mt-0.5 text-xs text-text-dim">
              {plan.date || "Kein Datum"}{" "}
              &middot; {plan.timeoutStrategies.length} Strategien
            </div>
          </button>
          <div className="flex gap-1.5">
            <button
              onClick={() => onExport(plan)}
              className="rounded-lg border border-border px-2.5 py-1 text-xs text-text-dim hover:border-accent/50 hover:text-text transition-all"
              title="JSON exportieren"
            >
              Export
            </button>
            <button
              onClick={() => onDelete(plan.id)}
              className="rounded-lg border border-border px-2.5 py-1 text-xs text-text-dim hover:border-kicker-red/50 hover:text-kicker-red transition-all"
              title="Loeschen"
            >
              &#10005;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
