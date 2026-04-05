import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { formatTime } from "../../domain/logic/time";
import type { BlockType } from "../../domain/models/Drill";

interface TimerProps {
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
  blockType: BlockType;
  repetitions?: number;
  completedReps?: number;
}

export default function Timer({
  remainingSeconds,
  isRunning,
  isFinished,
  blockType,
  repetitions,
  completedReps,
}: TimerProps) {
  const { t } = useTranslation("train");
  const isRepetition = blockType === "repetitions";

  const colorClass =
    isFinished
      ? "text-kicker-green"
      : blockType === "work" || blockType === "repetitions"
        ? "text-text"
        : "text-kicker-orange";

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {isRepetition ? (
        /* Repetition counter display */
        <div className="flex flex-col items-center gap-1">
          <div
            className={`font-mono text-6xl md:text-8xl font-bold tabular-nums tracking-tight ${colorClass} transition-colors ${isRunning ? "animate-pulse-glow" : ""}`}
          >
            {completedReps ?? 0} / {repetitions ?? 0}
          </div>
          <div className="text-sm text-text-dim">{t("timer.repetitions")}</div>
        </div>
      ) : (
        /* Timer countdown display */
        <div
          role="timer"
          aria-live="polite"
          aria-label={formatTime(remainingSeconds)}
          className={`font-mono text-6xl md:text-8xl font-bold tabular-nums tracking-tight ${colorClass} transition-colors ${isRunning ? "animate-pulse-glow" : ""}`}
        >
          {formatTime(remainingSeconds)}
        </div>
      )}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        {isFinished ? (
          <span className="text-kicker-green font-medium">{t("timer.finished")}</span>
        ) : isRunning ? (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-kicker-green" />
            {isRepetition ? t("timer.counting") : t("timer.running")}
          </span>
        ) : (
          <span>{t("timer.paused")}</span>
        )}
      </div>
    </motion.div>
  );
}
