import { useMemo } from "react";
import { useAppStore } from "../../store";
import { Card, Badge } from "../../components/ui";
import type { TechniqueStatus, PlayerTechnique } from "../../domain/models/PlayerTechnique";
import type { Technique } from "../../domain/models/Technique";

const STATUS_LABELS: Record<TechniqueStatus, string> = {
  not_started: "Nicht begonnen",
  learning: "Lernend",
  developing: "Aufbauend",
  proficient: "Sicher",
  mastered: "Gemeistert",
};

const STATUS_ORDER: TechniqueStatus[] = [
  "not_started",
  "learning",
  "developing",
  "proficient",
  "mastered",
];

const STATUS_BADGE_COLORS: Record<TechniqueStatus, "orange" | "blue" | "green" | "accent" | "red"> = {
  not_started: "red",
  learning: "orange",
  developing: "blue",
  proficient: "green",
  mastered: "accent",
};

interface PlayerTechniquesProps {
  playerId: string;
}

export function PlayerTechniques({ playerId }: PlayerTechniquesProps) {
  const techniques = useAppStore((s) => s.techniques);
  const allPlayerTechniques = useAppStore((s) => s.playerTechniques);
  const playerTechniques = useMemo(
    () => allPlayerTechniques.filter((pt: PlayerTechnique) => pt.playerId === playerId),
    [allPlayerTechniques, playerId],
  );
  const addPlayerTechnique = useAppStore((s) => s.addPlayerTechnique);
  const updatePlayerTechnique = useAppStore((s) => s.updatePlayerTechnique);

  // Group techniques by category
  const grouped = useMemo(() => {
    const groups: Record<string, { technique: Technique; status: TechniqueStatus; ptId?: string }[]> = {};
    for (const tech of techniques) {
      const cat = tech.category;
      if (!groups[cat]) groups[cat] = [];
      const pt = playerTechniques.find((p) => p.techniqueId === tech.id);
      groups[cat].push({
        technique: tech,
        status: pt?.status ?? "not_started",
        ptId: pt?.id,
      });
    }
    return groups;
  }, [techniques, playerTechniques]);

  const handleCycleStatus = (techniqueId: string, currentStatus: TechniqueStatus, ptId?: string) => {
    const currentIdx = STATUS_ORDER.indexOf(currentStatus);
    const nextStatus = STATUS_ORDER[(currentIdx + 1) % STATUS_ORDER.length];

    if (ptId) {
      updatePlayerTechnique(ptId, { status: nextStatus });
    } else {
      addPlayerTechnique({
        id: crypto.randomUUID(),
        playerId,
        techniqueId,
        status: nextStatus,
      });
    }
  };

  if (techniques.length === 0) {
    return (
      <Card>
        <p className="text-xs text-text-dim">
          Keine Techniken geladen. Techniken werden beim Start der App geladen.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(grouped).map(([category, items]) => (
        <Card key={category}>
          <h4 className="mb-2 text-xs font-semibold text-text-dim">{category}</h4>
          <div className="flex flex-col gap-1.5">
            {items.map(({ technique, status, ptId }) => (
              <button
                key={technique.id}
                onClick={() => handleCycleStatus(technique.id, status, ptId)}
                className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-card-hover transition-colors -mx-2"
              >
                <div className="flex-1">
                  <span className="text-xs font-medium text-text">{technique.name}</span>
                  {technique.description && (
                    <p className="line-clamp-1 text-[10px] text-text-dim">{technique.description}</p>
                  )}
                </div>
                <Badge color={STATUS_BADGE_COLORS[status]}>
                  {STATUS_LABELS[status]}
                </Badge>
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
