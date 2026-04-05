import { motion } from "framer-motion";
import { Card, Badge } from "../ui";
import type { Goal } from "../../domain/models/Goal";
import { useTranslation } from "react-i18next";

const STATUS_COLORS: Record<string, "green" | "blue" | "orange"> = {
  active: "green",
  achieved: "blue",
  paused: "orange",
  abandoned: "orange",
};

function ProgressBar({ current, target }: { current: number; target: number }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-surface-hover">
        <motion.div
          className="h-1.5 rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-[10px] font-medium text-text-dim">
        {current}/{target} ({pct}%)
      </span>
    </div>
  );
}

interface GoalCardProps {
  goal: Goal;
  playerName?: string;
  onClick?: () => void;
}

export function GoalCard({ goal, playerName, onClick }: GoalCardProps) {
  const { t } = useTranslation("common");

  return (
    <Card interactive={!!onClick} onClick={onClick}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="flex items-start justify-between gap-2"
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-text">
              {goal.title}
            </span>
            <Badge color={STATUS_COLORS[goal.status]}>
              {t(`constants.goalStatus.${goal.status}`)}
            </Badge>
            <Badge color="accent">{goal.category}</Badge>
            {playerName && (
              <Badge color="blue">{playerName}</Badge>
            )}
          </div>
          {goal.targetValue != null && goal.targetValue > 0 && (
            <ProgressBar
              current={goal.currentValue ?? 0}
              target={goal.targetValue}
            />
          )}
          {goal.description && (
            <p className="mt-1 text-xs text-text-dim">{goal.description}</p>
          )}
          {goal.targetDate && (
            <p className="mt-0.5 text-[10px] text-text-dim">
              {t("ui.goalTarget", { date: goal.targetDate })}
            </p>
          )}
        </div>
      </motion.div>
    </Card>
  );
}
