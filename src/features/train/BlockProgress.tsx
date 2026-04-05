import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { TrainingBlock } from "../../domain/models/Drill";

interface BlockProgressProps {
  blocks: TrainingBlock[];
  currentIndex: number;
}

export default function BlockProgress({
  blocks,
  currentIndex,
}: BlockProgressProps) {
  const { t } = useTranslation("train");

  return (
    <div className="flex flex-col gap-2" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={blocks.length} aria-label={t("blockProgress.label")}>
      <div className="flex items-center gap-1">
        {blocks.map((block, i) => (
          <motion.div
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
            initial={false}
            animate={{
              scaleY: i === currentIndex ? 1.5 : 1,
              opacity: i <= currentIndex ? 1 : 0.5,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-text-dim">
        <span>
          {t("blockProgress.blockOf", { current: currentIndex + 1, total: blocks.length })}
        </span>
        <span>
          {blocks[currentIndex]?.type === "work" ? t("blockProgress.blockTypeWork") : t("blockProgress.blockTypeRest")}
        </span>
      </div>
    </div>
  );
}
