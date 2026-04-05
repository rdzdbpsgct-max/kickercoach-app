import { motion } from "framer-motion";
import type { CoachCard } from "../../domain/models/CoachCard";
import {
  MAX_VISIBLE_TAGS,
} from "../../domain/constants";
import { useTranslation } from "react-i18next";
import { Card, Badge, EmptyState } from "../../components/ui";

const DIFFICULTY_BADGE_COLORS = {
  beginner: "green",
  intermediate: "orange",
  advanced: "red",
} as const;

const CATEGORY_BADGE_COLORS: Record<string, "blue" | "red" | "green" | "orange" | "accent"> = {
  Torschuss: "red",
  Passspiel: "blue",
  Ballkontrolle: "accent",
  Defensive: "green",
  Taktik: "orange",
  Offensive: "blue",
  Mental: "accent",
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

interface CardGridProps {
  cards: CoachCard[];
  favorites: string[];
  onSelect: (card: CoachCard) => void;
}

export default function CardGrid({
  cards,
  favorites,
  onSelect,
}: CardGridProps) {
  const { t } = useTranslation(["learn", "common"]);

  if (cards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <EmptyState
          icon="&#128269;"
          title={t("grid.emptyTitle")}
          description={t("grid.emptyDescription")}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(260px,1fr))] content-start gap-3 overflow-auto pb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={cards.map((c) => c.id).join(",")}
    >
      {cards.map((card) => (
        <motion.div key={card.id} variants={cardVariants}>
          <Card
            interactive
            onClick={() => onSelect(card)}
            className="text-left"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-semibold text-text">
                  {card.title}
                </div>
              </div>
              {favorites.includes(card.id) && (
                <span className="ml-2 text-sm text-kicker-orange">
                  {"\u2605"}
                </span>
              )}
            </div>

            <div className="mb-2 flex flex-wrap gap-1.5">
              <Badge color={CATEGORY_BADGE_COLORS[card.category] ?? "accent"}>
                {card.category}
              </Badge>
              <Badge color={DIFFICULTY_BADGE_COLORS[card.difficulty]}>
                {t(`constants.difficulty.${card.difficulty}`, { ns: "common" })}
              </Badge>
            </div>

            <p className="line-clamp-2 text-xs leading-relaxed text-text-muted">
              {card.summary}
            </p>

            <div className="mt-2 flex flex-wrap gap-1">
              {card.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-text-dim"
                >
                  {tag}
                </span>
              ))}
              {card.tags.length > MAX_VISIBLE_TAGS && (
                <span className="text-[10px] text-text-dim">
                  +{card.tags.length - MAX_VISIBLE_TAGS}
                </span>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
