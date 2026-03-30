import { useState } from "react";
import { useAppStore } from "../../store";
import { Card, Button, EmptyState, ConfirmDialog } from "../../components/ui";
import type { Team } from "../../domain/models/Team";

interface TeamListProps {
  onSelect?: (team: Team) => void;
  onAdd: () => void;
  onEdit: (team: Team) => void;
}

export function TeamList({ onAdd, onEdit }: TeamListProps) {
  const teams = useAppStore((s) => s.teams);
  const players = useAppStore((s) => s.players);
  const deleteTeam = useAppStore((s) => s.deleteTeam);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const getPlayer = (id: string) => players.find((p) => p.id === id);

  if (teams.length === 0) {
    return (
      <EmptyState
        icon="&#129309;"
        title="Noch keine Teams"
        description="Erstelle ein Doppel-Team aus zwei Spielern."
        action={{ label: "Team erstellen", onClick: onAdd }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-auto pb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">
          Teams ({teams.length})
        </h2>
        <Button size="sm" onClick={onAdd}>
          + Team erstellen
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => {
          const p1 = getPlayer(team.playerIds[0]);
          const p2 = getPlayer(team.playerIds[1]);
          return (
            <Card
              key={team.id}
              interactive
              onClick={() => onEdit(team)}
              className="flex flex-col gap-2"
            >
              <p className="font-semibold text-text truncate">{team.name}</p>
              <div className="flex items-center gap-2">
                {[p1, p2].map((p, i) =>
                  p ? (
                    <div key={p.id} className="flex items-center gap-1.5">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
                        style={{ backgroundColor: p.avatarColor ?? "#6366f1" }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-text-muted truncate">
                        {p.name}
                      </span>
                    </div>
                  ) : (
                    <span key={i} className="text-xs text-text-dim">
                      (geloescht)
                    </span>
                  ),
                )}
              </div>
              {team.notes && (
                <p className="text-xs text-text-dim line-clamp-2">
                  {team.notes}
                </p>
              )}
              <div className="mt-1 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(team.id);
                  }}
                  className="text-xs text-text-dim hover:text-red-400 transition-colors"
                >
                  Loeschen
                </button>
              </div>
            </Card>
          );
        })}
      </div>
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteTeam(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        title="Team loeschen"
        message="Moechtest du dieses Team wirklich loeschen?"
      />
    </div>
  );
}
