import { Badge, Card, Button, EmptyState } from "../../components/ui";
import { DIFFICULTY_LABELS } from "../../domain/constants";
import type { Player } from "../../domain/models/Player";

const POSITION_LABELS: Record<string, string> = {
  offense: "Sturm",
  defense: "Abwehr",
  both: "Beides",
};

interface PlayerListProps {
  players: Player[];
  onSelect: (player: Player) => void;
  onAdd: () => void;
}

export function PlayerList({ players, onSelect, onAdd }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <EmptyState
        icon="&#128100;"
        title="Noch keine Spieler"
        description="Lege deinen ersten Spieler an, um mit dem Coaching zu starten."
        action={{ label: "Spieler anlegen", onClick: onAdd }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-auto pb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">
          Spieler ({players.length})
        </h2>
        <Button size="sm" onClick={onAdd}>
          + Spieler anlegen
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <Card
            key={player.id}
            interactive
            onClick={() => onSelect(player)}
            className="flex items-center gap-3"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
              style={{ backgroundColor: player.avatarColor ?? "#6366f1" }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-text truncate">{player.name}</p>
              <div className="mt-1 flex gap-1.5">
                <Badge color="blue">{POSITION_LABELS[player.preferredPosition]}</Badge>
                <Badge color="orange">{DIFFICULTY_LABELS[player.level]}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
