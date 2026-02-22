import type { CoachCard } from "../../domain/models/CoachCard";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  CATEGORY_COLORS,
  MAX_VISIBLE_TAGS,
} from "../../domain/constants";

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
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(260px,1fr))] content-start gap-3 overflow-auto pb-4">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => onSelect(card)}
          className="cursor-pointer rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-accent hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-accent"
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
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_COLORS[card.category] ?? "bg-surface text-text-dim"}`}
            >
              {card.category}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${DIFFICULTY_COLORS[card.difficulty]}`}
            >
              {DIFFICULTY_LABELS[card.difficulty]}
            </span>
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
        </button>
      ))}
    </div>
  );
}
