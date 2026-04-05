import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import type {
  CoachCard,
  Difficulty,
  Category,
} from "../../domain/models/CoachCard";
import { useAppStore } from "../../store";
import SearchFilter from "./SearchFilter";
import CardGrid from "./CardGrid";
import CardDetail from "./CardDetail";

export default function LearnMode() {
  const [cards, setCards] = useState<CoachCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<CoachCard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<Category | "Alle">("Alle");
  const [difficulty, setDifficulty] = useState<Difficulty | "Alle">("Alle");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const favorites = useAppStore((s) => s.favorites);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  // Load cards
  useEffect(() => {
    import("../../data/coachCards").then((mod) => {
      mod.loadCoachCards().then(setCards);
    });
  }, []);

  const filtered = useMemo(() => {
    let result = cards;

    if (category !== "Alle") {
      result = result.filter((c) => c.category === category);
    }

    if (difficulty !== "Alle") {
      result = result.filter((c) => c.difficulty === difficulty);
    }

    if (showFavoritesOnly) {
      result = result.filter((c) => favorites.includes(c.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q),
      );
    }

    return result;
  }, [cards, category, difficulty, showFavoritesOnly, favorites, searchQuery]);

  // Detail view
  if (selectedCard) {
    return (
      <CardDetail
        card={selectedCard}
        isFavorite={favorites.includes(selectedCard.id)}
        onToggleFavorite={() => toggleFavorite(selectedCard.id)}
        onBack={() => setSelectedCard(null)}
        allCards={cards}
        onNavigateToCard={setSelectedCard}
      />
    );
  }

  return (
    <motion.div
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.h1
        className="text-xl font-bold"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        Lernen
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          category={category}
          onCategoryChange={setCategory}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly((p) => !p)}
          resultCount={filtered.length}
        />
      </motion.div>

      <motion.div
        className="flex min-h-0 flex-1"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.18 }}
      >
        <CardGrid
          cards={filtered}
          favorites={favorites}
          onSelect={setSelectedCard}
        />
      </motion.div>
    </motion.div>
  );
}
