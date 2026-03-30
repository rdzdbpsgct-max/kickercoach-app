import { useState } from "react";
import { useAppStore } from "../../store";
import { Button, Card, FormField, Input, Textarea } from "../../components/ui";
import type { Team } from "../../domain/models/Team";

interface TeamFormProps {
  team?: Team;
  onSave: (team: Team) => void;
  onCancel: () => void;
}

export function TeamForm({ team, onSave, onCancel }: TeamFormProps) {
  const players = useAppStore((s) => s.players);

  const [name, setName] = useState(team?.name ?? "");
  const [player1, setPlayer1] = useState(team?.playerIds[0] ?? "");
  const [player2, setPlayer2] = useState(team?.playerIds[1] ?? "");
  const [notes, setNotes] = useState(team?.notes ?? "");

  const canSave =
    name.trim().length > 0 &&
    player1.length > 0 &&
    player2.length > 0 &&
    player1 !== player2;

  const handleSubmit = () => {
    if (!canSave) return;
    onSave({
      id: team?.id ?? crypto.randomUUID(),
      name: name.trim(),
      playerIds: [player1, player2],
      notes: notes.trim() || undefined,
      createdAt: team?.createdAt ?? new Date().toISOString(),
    });
  };

  const getPlayer = (id: string) => players.find((p) => p.id === id);

  return (
    <div className="flex flex-col gap-4 overflow-auto pb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">
          {team ? "Team bearbeiten" : "Neues Team"}
        </h2>
        <button
          onClick={onCancel}
          className="text-xs text-text-dim hover:text-accent transition-colors"
        >
          &larr; Abbrechen
        </button>
      </div>

      <Card className="flex flex-col gap-4">
        <FormField label="Teamname">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Dream Team"
          />
        </FormField>

        <FormField label="Spieler 1">
          {players.length < 2 ? (
            <p className="text-xs text-text-dim">
              Mindestens 2 Spieler erforderlich. Lege zuerst Spieler an.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <button
                  key={p.id}
                  disabled={p.id === player2}
                  onClick={() => setPlayer1(p.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    player1 === p.id
                      ? "border-2 border-accent bg-accent-dim text-accent-hover"
                      : p.id === player2
                        ? "border border-border text-text-dim opacity-40 cursor-not-allowed"
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
          )}
        </FormField>

        <FormField label="Spieler 2">
          {players.length < 2 ? (
            <p className="text-xs text-text-dim">
              Mindestens 2 Spieler erforderlich.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <button
                  key={p.id}
                  disabled={p.id === player1}
                  onClick={() => setPlayer2(p.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    player2 === p.id
                      ? "border-2 border-accent bg-accent-dim text-accent-hover"
                      : p.id === player1
                        ? "border border-border text-text-dim opacity-40 cursor-not-allowed"
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
          )}
        </FormField>

        {player1 && player2 && player1 !== player2 && (
          <div className="flex items-center justify-center gap-3 rounded-xl bg-surface-alt p-3">
            {[getPlayer(player1), getPlayer(player2)].map(
              (p) =>
                p && (
                  <div key={p.id} className="flex items-center gap-1.5">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{
                        backgroundColor: p.avatarColor ?? "#6366f1",
                      }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-text">
                      {p.name}
                    </span>
                  </div>
                ),
            )}
          </div>
        )}

        <FormField label="Notizen (optional)">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Spielstil, Staerken des Teams..."
            rows={3}
          />
        </FormField>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!canSave}>
            {team ? "Speichern" : "Team erstellen"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
