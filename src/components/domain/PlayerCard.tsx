import { motion } from "framer-motion";
import { Card, Badge } from "../ui";
import { DIFFICULTY_LABELS } from "../../domain/constants";
import type { Player } from "../../domain/models/Player";

const POSITION_LABELS: Record<string, string> = {
  offense: "Sturm",
  defense: "Abwehr",
  both: "Beides",
};

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  showSessionCount?: number;
  compact?: boolean;
}

export function PlayerCard({
  player,
  onClick,
  showSessionCount,
  compact = false,
}: PlayerCardProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        className={`flex items-center gap-2 rounded-lg p-1 -mx-1 ${
          onClick
            ? "hover:bg-card-hover transition-colors cursor-pointer"
            : ""
        }`}
      >
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: player.avatarColor ?? "#00e676" }}
        >
          {player.name.charAt(0).toUpperCase()}
        </span>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-text truncate block">
            {player.name}
          </span>
        </div>
        {showSessionCount != null && showSessionCount > 0 && (
          <span className="text-[10px] text-text-dim">
            {showSessionCount} Sessions
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <Card
      interactive={!!onClick}
      onClick={onClick}
      className="flex items-center gap-3"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="contents"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
          style={{ backgroundColor: player.avatarColor ?? "#00e676" }}
        >
          {player.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text truncate">{player.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge color="blue">
              {POSITION_LABELS[player.preferredPosition]}
            </Badge>
            <Badge color="orange">{DIFFICULTY_LABELS[player.level]}</Badge>
          </div>
        </div>
        {showSessionCount != null && showSessionCount > 0 && (
          <span className="text-[10px] text-text-dim shrink-0">
            {showSessionCount} Sessions
          </span>
        )}
      </motion.div>
    </Card>
  );
}
