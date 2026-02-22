import type { Drill } from "../../domain/models/Drill";
import { drillTotalDuration, formatTime } from "../../domain/logic";

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
  return (
    <div className="flex flex-col gap-2 overflow-auto">
      {drills.map((drill) => (
        <button
          key={drill.id}
          onClick={() => onSelect(drill)}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
            selectedId === drill.id
              ? "border-accent bg-accent-dim text-text"
              : "border-border bg-card text-text-muted hover:border-accent/50 hover:bg-card-hover"
          }`}
        >
          <div>
            <div className="text-sm font-semibold">{drill.name}</div>
            <div className="mt-0.5 text-xs text-text-dim">
              {drill.focusSkill} &middot; {drill.blocks.length} Blocks
            </div>
          </div>
          <div className="text-xs font-medium text-text-dim">
            {formatTime(drillTotalDuration(drill))}
          </div>
        </button>
      ))}
    </div>
  );
}
