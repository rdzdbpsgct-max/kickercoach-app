import { useState, useMemo } from "react";
import { Button, Badge, Card } from "../../components/ui";
import { SkillRadar } from "./SkillRadar";
import { GoalList } from "./GoalList";
import { GoalForm } from "./GoalForm";
import { QuickNote } from "./QuickNote";
import { NotesFeed } from "./NotesFeed";
import { ProgressView } from "./ProgressView";
import { PlayerTechniques } from "./PlayerTechniques";
import { printCurrentPage } from "../../utils/print";
import { DIFFICULTY_LABELS } from "../../domain/constants";
import { useAppStore } from "../../store";
import type { Player } from "../../domain/models/Player";
import type { Goal } from "../../domain/models/Goal";


const POSITION_LABELS: Record<string, string> = {
  offense: "Sturm",
  defense: "Abwehr",
  both: "Beides",
};

interface PlayerDetailProps {
  player: Player;
  onEdit: () => void;
  onBack: () => void;
  onDelete: () => void;
  onStartTraining?: (playerId: string) => void;
}

export function PlayerDetail({ player, onEdit, onBack, onDelete, onStartTraining }: PlayerDetailProps) {
  const goals = useAppStore((s) => s.getPlayerGoals(player.id));
  const addGoal = useAppStore((s) => s.addGoal);
  const updateGoal = useAppStore((s) => s.updateGoal);
  const deleteGoal = useAppStore((s) => s.deleteGoal);

  const evaluations = useAppStore((s) => s.getPlayerEvaluations(player.id));
  const playerNotes = useAppStore((s) => s.getPlayerNotes(player.id));

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();

  // Compute skill trends from evaluations
  const skillTrends = useMemo(() => {
    if (evaluations.length < 2) return null;
    const sorted = [...evaluations].sort((a, b) => b.date.localeCompare(a.date));
    const latest = sorted[0];
    const previous = sorted[1];
    const trends: Record<string, string> = {};
    for (const sr of latest.skillRatings) {
      const prev = previous.skillRatings.find((p) => p.category === sr.category);
      if (prev) {
        if (sr.rating > prev.rating) trends[sr.category] = "\u2191";
        else if (sr.rating < prev.rating) trends[sr.category] = "\u2193";
        else trends[sr.category] = "\u2192";
      }
    }
    return trends;
  }, [evaluations]);

  const handleSaveGoal = (goal: Goal) => {
    if (editingGoal) {
      updateGoal(goal.id, goal);
    } else {
      addGoal(goal);
    }
    setShowGoalForm(false);
    setEditingGoal(undefined);
  };

  const handleToggleStatus = (goal: Goal) => {
    updateGoal(goal.id, {
      status: goal.status === "active" ? "achieved" : "active",
    });
  };

  return (
    <div className="flex flex-col gap-5 overflow-auto pb-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          &#8592; Zur&uuml;ck
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white"
          style={{ backgroundColor: player.avatarColor ?? "#6366f1" }}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-text">
            {player.name}
            {player.nickname && (
              <span className="ml-2 text-base font-normal text-text-muted">
                &ldquo;{player.nickname}&rdquo;
              </span>
            )}
          </h1>
          <div className="mt-1 flex gap-2">
            <Badge color="blue">{POSITION_LABELS[player.preferredPosition]}</Badge>
            <Badge color="orange">{DIFFICULTY_LABELS[player.level]}</Badge>
          </div>
        </div>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-text">Skill-Profil</h2>
        <SkillRadar ratings={player.skillRatings} />
      </Card>

      {/* Quick Actions */}
      {onStartTraining && (
        <div className="flex gap-2 no-print">
          <Button onClick={() => onStartTraining(player.id)}>
            Training starten
          </Button>
        </div>
      )}

      {/* Goals section */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text">Trainingsziele</h2>
        {showGoalForm ? (
          <Card>
            <GoalForm
              playerId={player.id}
              goal={editingGoal}
              onSave={handleSaveGoal}
              onCancel={() => {
                setShowGoalForm(false);
                setEditingGoal(undefined);
              }}
            />
          </Card>
        ) : (
          <GoalList
            goals={goals}
            onAdd={() => {
              setEditingGoal(undefined);
              setShowGoalForm(true);
            }}
            onEdit={(goal) => {
              setEditingGoal(goal);
              setShowGoalForm(true);
            }}
            onDelete={deleteGoal}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* Techniques */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text">Techniken</h2>
        <PlayerTechniques playerId={player.id} />
      </div>

      {/* Progress & Evaluation history */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text">
          Fortschritt {evaluations.length > 0 && `(${evaluations.length} Bewertungen)`}
        </h2>
        {skillTrends && (
          <Card className="mb-3">
            <h3 className="mb-2 text-xs font-semibold text-text-dim">Skill-Trend</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(skillTrends).map(([cat, trend]) => (
                <span key={cat} className="flex items-center gap-1 text-xs">
                  <Badge color="accent">{cat}</Badge>
                  <span className={
                    trend === "\u2191" ? "text-kicker-green font-bold" :
                    trend === "\u2193" ? "text-kicker-red font-bold" :
                    "text-text-dim"
                  }>
                    {trend}
                  </span>
                </span>
              ))}
            </div>
          </Card>
        )}
        <ProgressView evaluations={evaluations} />
      </div>

      {/* Coaching Notes */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text">Coaching-Notizen</h2>
        <div className="mb-3">
          <QuickNote playerId={player.id} />
        </div>
        <NotesFeed notes={playerNotes} />
      </div>

      {player.notes && (
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-text">Profil-Notizen</h2>
          <p className="text-sm text-text-muted whitespace-pre-wrap">{player.notes}</p>
        </Card>
      )}

      <div className="flex gap-3 no-print">
        <Button onClick={onEdit}>Bearbeiten</Button>
        <Button variant="secondary" onClick={printCurrentPage}>Profil drucken</Button>
        <Button variant="danger" onClick={onDelete}>L&ouml;schen</Button>
      </div>
    </div>
  );
}
