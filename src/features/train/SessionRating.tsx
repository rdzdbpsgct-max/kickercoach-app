import { useState } from "react";
import type { Category } from "../../domain/models/CoachCard";
import type { Evaluation, SkillRating } from "../../domain/models/Evaluation";
import { useAppStore } from "../../store";
import { Button, Card, FormField, Textarea } from "../../components/ui";
import { ALL_CATEGORIES } from "../../domain/constants";

interface SessionRatingProps {
  sessionId: string;
  playerIds: string[];
  onComplete: () => void;
  onSkip: () => void;
}

export default function SessionRating({
  sessionId,
  playerIds,
  onComplete,
  onSkip,
}: SessionRatingProps) {
  const players = useAppStore((s) => s.players);
  const addEvaluation = useAppStore((s) => s.addEvaluation);

  const participatingPlayers = players.filter((p) => playerIds.includes(p.id));

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<Category, number | null>>(
    Object.fromEntries(ALL_CATEGORIES.map((c) => [c, null])) as Record<Category, number | null>,
  );
  const [notes, setNotes] = useState("");

  if (participatingPlayers.length === 0) {
    return null;
  }

  const currentPlayer = participatingPlayers[currentPlayerIndex];

  const handleSave = () => {
    // Only include categories where the user explicitly set a rating
    const skillRatings: SkillRating[] = ALL_CATEGORIES
      .filter((cat) => ratings[cat] !== null)
      .map((cat) => ({
        category: cat,
        rating: ratings[cat] as number,
      }));

    const evaluation: Evaluation = {
      id: crypto.randomUUID(),
      playerId: currentPlayer.id,
      sessionId,
      date: new Date().toISOString().slice(0, 10),
      skillRatings,
      notes: notes.trim(),
    };

    addEvaluation(evaluation);

    if (currentPlayerIndex < participatingPlayers.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setRatings(
        Object.fromEntries(ALL_CATEGORIES.map((c) => [c, null])) as Record<Category, number | null>,
      );
      setNotes("");
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Spieler bewerten</h2>
        <Button variant="ghost" size="sm" onClick={onSkip}>
          &Uuml;berspringen
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{ backgroundColor: currentPlayer.avatarColor ?? "#6366f1" }}
        >
          {currentPlayer.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <span className="text-sm font-semibold text-text">{currentPlayer.name}</span>
          <span className="ml-2 text-xs text-text-dim">
            ({currentPlayerIndex + 1}/{participatingPlayers.length})
          </span>
        </div>
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-text">Skill-Bewertung</h3>
        <div className="flex flex-col gap-2.5">
          {ALL_CATEGORIES.map((cat) => {
            const current = ratings[cat];
            return (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-28 text-xs font-medium text-text-muted truncate">
                  {cat}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setRatings((prev) => ({
                          ...prev,
                          [cat]: prev[cat] === level ? null : level,
                        }))
                      }
                      className={`h-11 w-11 rounded-lg text-sm font-semibold transition-all ${
                        current !== null && level <= current
                          ? "bg-accent text-white"
                          : "bg-border/30 text-text-dim hover:bg-border/50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                {current === null && (
                  <span className="text-[10px] text-text-dim italic">nicht bewertet</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <FormField label="Notizen">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Beobachtungen, Fortschritte..."
          rows={2}
        />
      </FormField>

      <div className="flex justify-end gap-2">
        <Button onClick={handleSave}>
          {currentPlayerIndex < participatingPlayers.length - 1
            ? "Weiter"
            : "Abschliessen"}
        </Button>
      </div>
    </div>
  );
}
