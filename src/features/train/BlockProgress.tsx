import type { TrainingBlock } from "../../domain/models/Drill";

interface BlockProgressProps {
  blocks: TrainingBlock[];
  currentIndex: number;
}

export default function BlockProgress({
  blocks,
  currentIndex,
}: BlockProgressProps) {
  return (
    <div className="flex flex-col gap-2" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={blocks.length} aria-label="Trainingsfortschritt">
      <div className="flex items-center gap-1">
        {blocks.map((block, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < currentIndex
                ? "bg-kicker-green"
                : i === currentIndex
                  ? block.type === "work"
                    ? "bg-accent"
                    : "bg-kicker-orange"
                  : "bg-border"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-text-dim">
        <span>
          Block {currentIndex + 1} / {blocks.length}
        </span>
        <span>
          {blocks[currentIndex]?.type === "work" ? "Training" : "Pause"}
        </span>
      </div>
    </div>
  );
}
