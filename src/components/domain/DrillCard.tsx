import { Card, Badge } from "../ui";
import { DIFFICULTY_LABELS, PHASE_LABELS } from "../../domain/constants";
import { drillTotalDuration, formatTime } from "../../domain/logic";
import type { Drill, DrillPhase, RodPosition } from "../../domain/models/Drill";
import type { Difficulty } from "../../domain/models/CoachCard";

const DIFFICULTY_BADGE_COLORS: Record<Difficulty, "green" | "orange" | "red"> = {
  beginner: "green",
  intermediate: "orange",
  advanced: "red",
};

const PHASE_BADGE_COLORS: Record<DrillPhase, "blue" | "orange" | "green" | "accent"> = {
  warmup: "orange",
  technique: "blue",
  game: "green",
  cooldown: "accent",
};

const POSITION_LABELS: Record<RodPosition, string> = {
  keeper: "Torwart",
  defense: "Abwehr",
  midfield: "Mittelfeld",
  offense: "Sturm",
};

interface DrillCardProps {
  drill: Drill;
  selected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function DrillCard({
  drill,
  selected = false,
  onClick,
  onEdit,
  onDelete,
  compact = false,
}: DrillCardProps) {
  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
          selected ? "bg-accent-dim" : ""
        } ${onClick ? "cursor-pointer hover:bg-card-hover transition-colors" : ""}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-text truncate">
              {drill.name}
            </span>
            {drill.difficulty && (
              <Badge color={DIFFICULTY_BADGE_COLORS[drill.difficulty]}>
                {DIFFICULTY_LABELS[drill.difficulty]}
              </Badge>
            )}
          </div>
          <div className="text-[10px] text-text-dim">{drill.focusSkill}</div>
        </div>
        <span className="text-[10px] text-text-dim shrink-0">
          {formatTime(drillTotalDuration(drill))}
        </span>
      </div>
    );
  }

  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      className={selected ? "border-accent bg-accent-dim" : ""}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold">{drill.name}</span>
            {drill.difficulty && (
              <Badge color={DIFFICULTY_BADGE_COLORS[drill.difficulty]}>
                {DIFFICULTY_LABELS[drill.difficulty]}
              </Badge>
            )}
            {drill.phase && (
              <Badge color={PHASE_BADGE_COLORS[drill.phase]}>
                {PHASE_LABELS[drill.phase]}
              </Badge>
            )}
            {drill.isCustom && (
              <Badge color="accent">Eigener Drill</Badge>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-text-dim">
            <span>{drill.focusSkill}</span>
            <span>&middot;</span>
            <span>{drill.blocks.length} Blocks</span>
            {drill.position && (
              <>
                <span>&middot;</span>
                <span>{POSITION_LABELS[drill.position]}</span>
              </>
            )}
            {drill.playerCount && drill.playerCount > 1 && (
              <>
                <span>&middot;</span>
                <span>{drill.playerCount} Spieler</span>
              </>
            )}
          </div>
          {drill.description && (
            <div className="mt-1 line-clamp-1 text-xs text-text-dim">
              {drill.description}
            </div>
          )}
          {drill.measurableGoal && (
            <div className="mt-0.5 text-[11px] text-accent">
              Ziel: {drill.measurableGoal}
            </div>
          )}
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-2">
          <span className="text-xs font-medium text-text-dim">
            {formatTime(drillTotalDuration(drill))}
          </span>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="rounded-lg border border-border px-2 py-1 text-[11px] text-text-muted hover:border-accent/50 transition-all"
              title="Bearbeiten"
            >
              &#9998;
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded-lg border border-border px-2 py-1 text-[11px] text-kicker-red hover:border-kicker-red/50 transition-all"
              title="Loeschen"
            >
              &#10005;
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
