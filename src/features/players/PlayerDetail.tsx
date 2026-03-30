import { Button, Badge, Card } from "../../components/ui";
import { SkillRadar } from "./SkillRadar";
import { DIFFICULTY_LABELS } from "../../domain/constants";
import type { Player } from "../../domain/models/Player";

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
}

export function PlayerDetail({ player, onEdit, onBack, onDelete }: PlayerDetailProps) {
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

      {player.notes && (
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-text">Notizen</h2>
          <p className="text-sm text-text-muted whitespace-pre-wrap">{player.notes}</p>
        </Card>
      )}

      <div className="flex gap-3">
        <Button onClick={onEdit}>Bearbeiten</Button>
        <Button variant="danger" onClick={onDelete}>L&ouml;schen</Button>
      </div>
    </div>
  );
}
