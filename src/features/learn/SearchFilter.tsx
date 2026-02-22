import type { Difficulty, Category } from "../../domain/models/CoachCard";

const CATEGORIES: (Category | "Alle")[] = [
  "Alle",
  "Torschuss",
  "Passspiel",
  "Ballkontrolle",
  "Defensive",
  "Taktik",
];

const DIFFICULTIES: (Difficulty | "Alle")[] = [
  "Alle",
  "beginner",
  "intermediate",
  "advanced",
];

const DIFFICULTY_LABELS: Record<string, string> = {
  Alle: "Alle Stufen",
  beginner: "Einsteiger",
  intermediate: "Fortgeschritten",
  advanced: "Profi",
};

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  category: Category | "Alle";
  onCategoryChange: (cat: Category | "Alle") => void;
  difficulty: Difficulty | "Alle";
  onDifficultyChange: (diff: Difficulty | "Alle") => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  resultCount: number;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
  showFavoritesOnly,
  onToggleFavorites,
  resultCount,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Technik suchen..."
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
        />
        <button
          onClick={onToggleFavorites}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
            showFavoritesOnly
              ? "border-kicker-orange bg-kicker-orange/15 text-kicker-orange"
              : "border-border text-text-dim hover:border-accent/50"
          }`}
        >
          {showFavoritesOnly ? "\u2605 Favoriten" : "\u2606 Favoriten"}
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              category === cat
                ? "border-2 border-accent bg-accent-dim text-accent-hover"
                : "border border-border text-text-muted hover:border-accent/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                difficulty === diff
                  ? "border-2 border-accent bg-accent-dim text-accent-hover"
                  : "border border-border text-text-muted hover:border-accent/50"
              }`}
            >
              {DIFFICULTY_LABELS[diff]}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-text-dim">
          {resultCount} Ergebnisse
        </span>
      </div>
    </div>
  );
}
