import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Difficulty, Category } from "../../domain/models/CoachCard";
import { SearchBar, Button } from "../../components/ui";

const CATEGORIES: (Category | "Alle")[] = [
  "Alle",
  "Torschuss",
  "Passspiel",
  "Ballkontrolle",
  "Defensive",
  "Taktik",
  "Offensive",
  "Mental",
];

const DIFFICULTIES: (Difficulty | "Alle")[] = [
  "Alle",
  "beginner",
  "intermediate",
  "advanced",
];

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
  const { t } = useTranslation(["learn", "common"]);

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={t("search.placeholder")}
          />
        </div>
        <Button
          variant={showFavoritesOnly ? "primary" : "secondary"}
          onClick={onToggleFavorites}
          aria-pressed={showFavoritesOnly}
          className={showFavoritesOnly ? "border-kicker-orange bg-kicker-orange/15 text-kicker-orange" : ""}
        >
          {showFavoritesOnly ? `\u2605 ${t("search.favorites")}` : `\u2606 ${t("search.favorites")}`}
        </Button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t("search.categoryFilter")}>
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            aria-pressed={category === cat}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              category === cat
                ? "border-2 border-accent bg-accent-dim text-accent"
                : "border border-border text-text-muted hover:border-accent/50"
            }`}
            whileTap={{ scale: 0.93 }}
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5" role="radiogroup" aria-label={t("search.difficultyFilter")}>
          {DIFFICULTIES.map((diff) => (
            <motion.button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              aria-pressed={difficulty === diff}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                difficulty === diff
                  ? "border-2 border-accent bg-accent-dim text-accent"
                  : "border border-border text-text-muted hover:border-accent/50"
              }`}
              whileTap={{ scale: 0.93 }}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {diff === "Alle" ? t("search.allLevels") : t(`constants.difficulty.${diff}`, { ns: "common" })}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={resultCount}
            className="ml-auto text-xs text-text-dim"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            {t("search.results", { count: resultCount })}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
