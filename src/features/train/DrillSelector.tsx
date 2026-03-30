import { useState } from "react";
import type { Drill } from "../../domain/models/Drill";
import type { Difficulty } from "../../domain/models/CoachCard";
import { drillTotalDuration, formatTime } from "../../domain/logic";
import { DIFFICULTY_LABELS } from "../../domain/constants";
import { Badge, Card, Button } from "../../components/ui";

const DIFFICULTY_BADGE_COLORS = {
  beginner: "green",
  intermediate: "orange",
  advanced: "red",
} as const;

const FILTER_OPTIONS: (Difficulty | "Alle")[] = [
  "Alle",
  "beginner",
  "intermediate",
  "advanced",
];

interface DrillSelectorProps {
  drills: Drill[];
  selectedId: string | null;
  onSelect: (drill: Drill) => void;
  onNewDrill?: () => void;
  onEditDrill?: (drill: Drill) => void;
  onDeleteDrill?: (id: string) => void;
}

export default function DrillSelector({
  drills,
  selectedId,
  onSelect,
  onNewDrill,
  onEditDrill,
  onDeleteDrill,
}: DrillSelectorProps) {
  const [filter, setFilter] = useState<Difficulty | "Alle">("Alle");

  const filtered =
    filter === "Alle" ? drills : drills.filter((d) => d.difficulty === filter);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      {/* Difficulty filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            aria-pressed={filter === opt}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              filter === opt
                ? "border-2 border-accent bg-accent-dim text-accent-hover"
                : "border border-border text-text-muted hover:border-accent/50"
            }`}
          >
            {opt === "Alle" ? "Alle Stufen" : DIFFICULTY_LABELS[opt]}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-text-dim">
          {filtered.length} Drills
        </span>
        {onNewDrill && (
          <Button size="sm" onClick={onNewDrill}>
            + Neuer Drill
          </Button>
        )}
      </div>

      {/* Drill list */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
        {filtered.map((drill) => (
          <Card
            key={drill.id}
            interactive
            onClick={() => onSelect(drill)}
            className={
              selectedId === drill.id
                ? "border-accent bg-accent-dim"
                : ""
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{drill.name}</span>
                  {drill.difficulty && (
                    <Badge color={DIFFICULTY_BADGE_COLORS[drill.difficulty]}>
                      {DIFFICULTY_LABELS[drill.difficulty]}
                    </Badge>
                  )}
                  {drill.isCustom && (
                    <Badge color="accent">Eigener Drill</Badge>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-text-dim">
                  {drill.focusSkill} &middot; {drill.blocks.length} Blocks
                </div>
                {drill.description && (
                  <div className="mt-1 line-clamp-1 text-xs text-text-dim">
                    {drill.description}
                  </div>
                )}
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-2">
                <span className="text-xs font-medium text-text-dim">
                  {formatTime(drillTotalDuration(drill))}
                </span>
                {drill.isCustom && onEditDrill && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditDrill(drill);
                    }}
                    className="rounded-lg border border-border px-2 py-1 text-[11px] text-text-muted hover:border-accent/50 transition-all"
                    title="Bearbeiten"
                  >
                    &#9998;
                  </button>
                )}
                {drill.isCustom && onDeleteDrill && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDrill(drill.id);
                    }}
                    className="rounded-lg border border-border px-2 py-1 text-[11px] text-kicker-red hover:border-kicker-red/50 transition-all"
                    title="L&ouml;schen"
                  >
                    &#10005;
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
