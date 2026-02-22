import { useState } from "react";
import type { CoachCard } from "../../domain/models/CoachCard";

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

const CATEGORY_COLORS: Record<string, string> = {
  Torschuss: "bg-kicker-red/15 text-kicker-red",
  Passspiel: "bg-kicker-blue/15 text-kicker-blue",
  Ballkontrolle: "bg-accent-dim text-accent",
  Defensive: "bg-kicker-green/15 text-kicker-green",
  Taktik: "bg-kicker-orange/15 text-kicker-orange",
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
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(280px,1fr))] content-start gap-3 overflow-auto pb-4">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          isFavorite={favorites.includes(card.id)}
          onClick={() => onSelect(card)}
        />
      ))}
    </div>
  );
}

function CardItem({
  card,
  isFavorite,
  onClick,
}: {
  card: CoachCard;
  isFavorite: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`cursor-pointer rounded-xl border p-4 transition-all ${
        hovered
          ? "border-accent bg-card-hover"
          : "border-border bg-card"
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-semibold text-text">{card.title}</div>
        </div>
        {isFavorite && (
          <span className="ml-2 text-sm text-kicker-orange">{"\u2605"}</span>
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
        {card.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-text-dim"
          >
            {tag}
          </span>
        ))}
        {card.tags.length > 3 && (
          <span className="text-[10px] text-text-dim">
            +{card.tags.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}
