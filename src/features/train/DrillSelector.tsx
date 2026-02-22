import { useState } from "react";
import type { Drill, DrillDifficulty } from "../../domain/models/Drill";
import { drillTotalDuration, formatTime } from "../../domain/logic";

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Einsteiger",
  intermediate: "Fortgeschritten",
  advanced: "Profi",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-kicker-green/15 text-kicker-green",
  intermediate: "bg-kicker-orange/15 text-kicker-orange",
  advanced: "bg-kicker-red/15 text-kicker-red",
};

const FILTER_OPTIONS: (DrillDifficulty | "Alle")[] = [
  "Alle",
  "beginner",
  "intermediate",
  "advanced",
];

interface DrillSelectorProps {
  drills: Drill[];
  selectedId: string | null;
  onSelect: (drill: Drill) => void;
}

export default function DrillSelector({
  drills,
  selectedId,
  onSelect,
}: DrillSelectorProps) {
  const [filter, setFilter] = useState<DrillDifficulty | "Alle">("Alle");

  const filtered =
    filter === "Alle" ? drills : drills.filter((d) => d.difficulty === filter);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      {/* Difficulty filter */}
      <div className="flex gap-1.5">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
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
      </div>

      {/* Drill list */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
        {filtered.map((drill) => (
          <button
            key={drill.id}
            onClick={() => onSelect(drill)}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
              selectedId === drill.id
                ? "border-accent bg-accent-dim text-text"
                : "border-border bg-card text-text-muted hover:border-accent/50 hover:bg-card-hover"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{drill.name}</span>
                {drill.difficulty && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${DIFFICULTY_COLORS[drill.difficulty]}`}
                  >
                    {DIFFICULTY_LABELS[drill.difficulty]}
                  </span>
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
            <div className="ml-3 shrink-0 text-xs font-medium text-text-dim">
              {formatTime(drillTotalDuration(drill))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
