import { useState } from "react";
import { Badge, Card, Button, EmptyState, ConfirmDialog } from "../../components/ui";
import type { Goal } from "../../domain/models/Goal";

const STATUS_LABELS: Record<string, string> = {
  active: "Aktiv",
  achieved: "Erreicht",
  paused: "Pausiert",
};

const STATUS_COLORS: Record<string, "green" | "blue" | "orange"> = {
  active: "green",
  achieved: "blue",
  paused: "orange",
};

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
              {goal.description && (
                <p className="mt-1 text-xs text-text-dim">{goal.description}</p>
              )}
              {goal.targetDate && (
                <p className="mt-0.5 text-[10px] text-text-dim">
                  Ziel: {goal.targetDate}
                </p>
              )}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onToggleStatus(goal)}
                className="rounded-lg border border-border px-2 py-1 text-[11px] text-text-muted hover:border-accent/50 transition-all"
                title={goal.status === "active" ? "Als erreicht markieren" : "Reaktivieren"}
              >
                {goal.status === "active" ? "\u2713" : "\u21BB"}
              </button>
              <button
                onClick={() => onEdit(goal)}
                className="rounded-lg border border-border px-2 py-1 text-[11px] text-text-muted hover:border-accent/50 transition-all"
                title="Bearbeiten"
              >
                &#9998;
              </button>
              <button
                onClick={() => setDeleteId(goal.id)}
                className="rounded-lg border border-border px-2 py-1 text-[11px] text-kicker-red hover:border-kicker-red/50 transition-all"
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
