import type { CoachCard } from "../../domain/models/CoachCard";

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Einsteiger",
  intermediate: "Fortgeschritten",
  advanced: "Profi",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-kicker-green",
  intermediate: "text-kicker-orange",
  advanced: "text-kicker-red",
};

interface CardDetailProps {
  card: CoachCard;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
}

export default function CardDetail({
  card,
  isFavorite,
  onToggleFavorite,
  onBack,
}: CardDetailProps) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="mb-2 text-xs text-text-dim hover:text-accent transition-colors"
        >
          &larr; Zurueck zur Bibliothek
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{card.title}</h1>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span
                className={`font-medium ${DIFFICULTY_COLORS[card.difficulty]}`}
              >
                {DIFFICULTY_LABELS[card.difficulty]}
              </span>
              <span className="text-text-dim">&middot;</span>
              <span className="text-text-muted">{card.category}</span>
            </div>
          </div>
          <button
            onClick={onToggleFavorite}
            className={`text-2xl transition-transform hover:scale-110 ${
              isFavorite ? "text-kicker-orange" : "text-text-dim"
            }`}
          >
            {isFavorite ? "\u2605" : "\u2606"}
          </button>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed text-text-muted">{card.summary}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-text-dim"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Steps */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-base font-bold">Schritte</h2>
        <ol className="flex flex-col gap-2.5">
          {card.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-dim text-xs font-bold text-accent">
                {i + 1}
              </span>
              <span className="leading-relaxed text-text-muted">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Common Mistakes */}
      <div className="rounded-xl border border-kicker-red/20 bg-kicker-red/5 p-5">
        <h2 className="mb-3 text-base font-bold text-kicker-red">
          Haeufige Fehler
        </h2>
        <ul className="flex flex-col gap-2">
          {card.commonMistakes.map((mistake, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-text-muted"
            >
              <span className="text-kicker-red">&#10007;</span>
              {mistake}
            </li>
          ))}
        </ul>
      </div>

      {/* Coach Cues */}
      <div className="rounded-xl border border-kicker-green/20 bg-kicker-green/5 p-5">
        <h2 className="mb-3 text-base font-bold text-kicker-green">
          Coach Tipps
        </h2>
        <ul className="flex flex-col gap-2">
          {card.coachCues.map((cue, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-text-muted"
            >
              <span className="text-kicker-green">&#10003;</span>
              {cue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
