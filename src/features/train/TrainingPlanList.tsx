import { useState, useMemo } from "react";
import type { TrainingPlan } from "../../domain/models/TrainingPlan";
import { Card, Button, Badge, EmptyState, ConfirmDialog } from "../../components/ui";
import { printCurrentPage } from "../../utils/print";
import { useAppStore } from "../../store";
import { buildNameMap, matchesCompletionKey } from "../../domain/logic/drill";

interface TrainingPlanListProps {
  onEdit: (plan: TrainingPlan) => void;
  onNew: () => void;
  onStartSession?: (planId: string, weekIndex: number, sessionIndex: number) => void;
}

export default function TrainingPlanList({ onEdit, onNew, onStartSession }: TrainingPlanListProps) {
  const trainingPlans = useAppStore((s) => s.trainingPlans);
  const players = useAppStore((s) => s.players);
  const deleteTrainingPlan = useAppStore((s) => s.deleteTrainingPlan);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const playerNameMap = useMemo(() => buildNameMap(players), [players]);
  const getPlayerName = (id: string) => playerNameMap.get(id) ?? "?";

  const isSessionCompleted = (plan: TrainingPlan, weekIdx: number, sessionIdx: number) =>
    (plan.completedSessionIds ?? []).some((id) => matchesCompletionKey(id, weekIdx, sessionIdx));

  /** Pre-computed progress summaries per plan */
  const planProgress = useMemo(() => {
    const result = new Map<string, { completed: number; total: number }>();
    for (const plan of trainingPlans) {
      let total = 0;
      let completed = 0;
      for (let wi = 0; wi < plan.weeks.length; wi++) {
        for (let si = 0; si < plan.weeks[wi].sessionTemplates.length; si++) {
          total++;
          if (isSessionCompleted(plan, wi, si)) completed++;
        }
      }
      result.set(plan.id, { completed, total });
    }
    return result;
  }, [trainingPlans]);

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
      {trainingPlans.map((plan) => {
        const isExpanded = expandedPlanId === plan.id;
        const { completed, total } = planProgress.get(plan.id) ?? { completed: 0, total: 0 };
        const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <Card key={plan.id}>
            {/* Plan header */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text">{plan.name}</span>
                  {completed === total && total > 0 && (
                    <span className="text-kicker-green text-sm" title="Alle Sessions abgeschlossen">&#10003;</span>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-text-dim">
                  <Badge color="blue">{plan.weeks.length} Wochen</Badge>
                  <Badge color="orange">
                    {total} Sessions
                  </Badge>
                  {total > 0 && (
                    <Badge color={completed === total ? "green" : "secondary"}>
                      {completed}/{total} erledigt
                    </Badge>
                  )}
                  {plan.playerIds.length > 0 && (
                    <span>
                      {plan.playerIds.map((id) => getPlayerName(id)).join(", ")}
                    </span>
                  )}
                </div>
                {/* Overall progress bar */}
                {total > 0 && (
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                )}
                {plan.goal && (
                  <p className="mt-1 text-xs text-text-dim line-clamp-1">{plan.goal}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(plan);
                  }}
                  className="rounded-lg border border-border px-2.5 py-1 text-xs text-text-dim hover:border-accent/50 hover:text-accent transition-all"
                  title="Bearbeiten"
                >
                  &#9998;
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(plan.id);
                  }}
                  className="rounded-lg border border-border px-2.5 py-1 text-xs text-text-dim hover:border-kicker-red/50 hover:text-kicker-red transition-all"
                >
                  &#10005;
                </button>
                <span className="text-xs text-text-dim">{isExpanded ? "\u25B2" : "\u25BC"}</span>
              </div>
            </div>

            {/* Expanded: week & session details */}
            {isExpanded && (
              <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
                {plan.weeks.map((week, wi) => {
                  const weekDone = week.sessionTemplates.filter((_t, si) => isSessionCompleted(plan, wi, si)).length;
                  const weekTotal = week.sessionTemplates.length;
                  return (
                    <div key={wi}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-text">
                          Woche {week.weekNumber}
                        </span>
                        <span className="text-[11px] text-text-dim">
                          {weekDone}/{weekTotal} Sessions abgeschlossen
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {week.sessionTemplates.map((tmpl, si) => {
                          const done = isSessionCompleted(plan, wi, si);
                          return (
                            <div
                              key={si}
                              className={`flex items-center justify-between rounded-lg border px-3 py-2 transition-all ${
                                done
                                  ? "border-kicker-green/30 bg-kicker-green/5"
                                  : "border-border"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {done && (
                                  <span className="text-kicker-green text-sm shrink-0">&#10003;</span>
                                )}
                                <div className="min-w-0">
                                  <span className={`text-sm font-medium ${done ? "text-text-muted line-through" : "text-text"}`}>
                                    {tmpl.name || `Session ${si + 1}`}
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-0.5">
                                    {tmpl.focusAreas.map((area) => (
                                      <span
                                        key={area}
                                        className="rounded-full border border-border px-1.5 py-0.5 text-[10px] text-text-dim"
                                      >
                                        {area}
                                      </span>
                                    ))}
                                    {tmpl.drillIds.length > 0 && (
                                      <span className="text-[10px] text-text-dim">
                                        {tmpl.drillIds.length} Drills
                                      </span>
                                    )}
                                    {tmpl.estimatedDuration && (
                                      <span className="text-[10px] text-text-dim">
                                        ~{tmpl.estimatedDuration} Min.
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {!done && onStartSession && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onStartSession(plan.id, wi, si);
                                  }}
                                >
                                  &#9654; Starten
                                </Button>
                              )}
                              {done && (
                                <span className="text-[11px] text-kicker-green font-medium shrink-0">
                                  Erledigt
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}

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
