import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, Button, EmptyState, ConfirmDialog } from "../../components/ui";
import type { Goal } from "../../domain/models/Goal";

const STATUS_LABELS: Record<string, string> = {
  active: "Aktiv",
  achieved: "Erreicht",
  paused: "Pausiert",
  abandoned: "Aufgegeben",
};

const STATUS_COLORS: Record<string, "green" | "blue" | "orange"> = {
  active: "green",
  achieved: "blue",
  paused: "orange",
  abandoned: "orange",
};

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-surface-hover">
        <div
          className="h-1.5 rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-medium text-text-dim">
        {current}/{target} ({pct}%)
      </span>
    </div>
  );
}

interface GoalListProps {
  goals: Goal[];
  onAdd: () => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (goal: Goal) => void;
}

export function GoalList({ goals, onAdd, onEdit, onDelete, onToggleStatus }: GoalListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (goals.length === 0) {
    return (
      <EmptyState
        icon="&#127919;"
        title="Keine Ziele"
        description="Lege ein erstes Trainingsziel f&uuml;r diesen Spieler an."
        action={{ label: "Ziel anlegen", onClick: onAdd }}
      />
    );
  }

  const active = goals.filter((g) => g.status === "active");
  const other = goals.filter((g) => g.status !== "active");
  const sorted = [...active, ...other];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-dim">
          {goals.length} Ziele ({active.length} aktiv)
        </span>
        <Button size="sm" onClick={onAdd}>+ Ziel</Button>
      </div>

      {sorted.map((goal) => (
        <Card key={goal.id}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text">{goal.title}</span>
                <Badge color={STATUS_COLORS[goal.status]}>
                  {STATUS_LABELS[goal.status]}
                </Badge>
                <Badge color="accent">{goal.category}</Badge>
              </div>
              {goal.targetValue != null && goal.targetValue > 0 && (
                <ProgressBar
                  current={goal.currentValue ?? 0}
                  target={goal.targetValue}
                />
              )}
              {goal.description && (
                <p className="mt-1 text-xs text-text-dim">{goal.description}</p>
              )}
              {goal.targetDate && (
                <p className="mt-0.5 text-[10px] text-text-dim">
                  Ziel: {goal.targetDate}
                </p>
              )}
              {goal.status === "active" && (
                <Link
                  to="/train"
                  state={{ initialPlayerId: goal.playerId }}
                  className="mt-1 inline-block text-[11px] text-accent hover:text-accent-hover transition-colors"
                >
                  Passende Drills anzeigen &rarr;
                </Link>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onToggleStatus(goal)}
                className="min-h-[44px] min-w-[44px] rounded-lg border border-border px-3 py-2 text-sm text-text-muted hover:border-accent/50 transition-all"
                title={goal.status === "active" ? "Als erreicht markieren" : "Reaktivieren"}
              >
                {goal.status === "active" ? "\u2713" : "\u21BB"}
              </button>
              <button
                onClick={() => onEdit(goal)}
                className="min-h-[44px] min-w-[44px] rounded-lg border border-border px-3 py-2 text-sm text-text-muted hover:border-accent/50 transition-all"
                title="Bearbeiten"
              >
                &#9998;
              </button>
              <button
                onClick={() => setDeleteId(goal.id)}
                className="min-h-[44px] min-w-[44px] rounded-lg border border-border px-3 py-2 text-sm text-kicker-red hover:border-kicker-red/50 transition-all"
                title="L&ouml;schen"
              >
                &#10005;
              </button>
            </div>
          </div>
        </Card>
      ))}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
        }}
        title="Ziel l&ouml;schen"
        message="M&ouml;chtest du dieses Ziel wirklich l&ouml;schen?"
      />
    </div>
  );
}
