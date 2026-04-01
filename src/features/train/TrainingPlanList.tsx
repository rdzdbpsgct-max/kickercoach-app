import { useState } from "react";
import type { TrainingPlan } from "../../domain/models/TrainingPlan";
import { Card, Button, Badge, EmptyState, ConfirmDialog } from "../../components/ui";
import { printCurrentPage } from "../../utils/print";
import { useAppStore } from "../../store";

interface TrainingPlanListProps {
  onEdit: (plan: TrainingPlan) => void;
  onNew: () => void;
}

export default function TrainingPlanList({ onEdit, onNew }: TrainingPlanListProps) {
  const trainingPlans = useAppStore((s) => s.trainingPlans);
  const players = useAppStore((s) => s.players);
  const deleteTrainingPlan = useAppStore((s) => s.deleteTrainingPlan);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getPlayerName = (id: string) =>
    players.find((p) => p.id === id)?.name ?? "?";

  if (trainingPlans.length === 0) {
    return (
      <EmptyState
        icon="&#128197;"
        title="Keine Trainingspl&auml;ne"
        description="Erstelle einen mehrw&ouml;chigen Trainingsplan mit Session-Vorlagen."
        action={{ label: "Plan erstellen", onClick: onNew }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-auto pb-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-dim">{trainingPlans.length} Pl&auml;ne</span>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={printCurrentPage} className="no-print">Drucken</Button>
          <Button size="sm" onClick={onNew}>+ Neuer Plan</Button>
        </div>
      </div>
      {trainingPlans.map((plan) => (
        <Card key={plan.id} interactive onClick={() => onEdit(plan)}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-sm font-semibold text-text">{plan.name}</span>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-text-dim">
                <Badge color="blue">{plan.weeks.length} Wochen</Badge>
                <Badge color="orange">
                  {plan.weeks.reduce((sum, w) => sum + w.sessionTemplates.length, 0)} Sessions
                </Badge>
                {plan.playerIds.length > 0 && (
                  <span>
                    {plan.playerIds.map((id) => getPlayerName(id)).join(", ")}
                  </span>
                )}
              </div>
              {plan.goal && (
                <p className="mt-1 text-xs text-text-dim line-clamp-1">{plan.goal}</p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(plan.id);
              }}
              className="ml-3 rounded-lg border border-border px-2.5 py-1 text-xs text-text-dim hover:border-kicker-red/50 hover:text-kicker-red transition-all"
            >
              &#10005;
            </button>
          </div>
        </Card>
      ))}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteTrainingPlan(deleteId);
        }}
        title="Trainingsplan l&ouml;schen"
        message="M&ouml;chtest du diesen Trainingsplan wirklich l&ouml;schen?"
      />
    </div>
  );
}
