import { useState, useEffect, useMemo } from "react";
import type {
  CoachCard,
  Difficulty,
  Category,
} from "../../domain/models/CoachCard";
import { useFavorites } from "../../hooks/useFavorites";
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
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // Load cards
  useEffect(() => {
    import("../../data/coachCards").then((mod) => {
      setCards(mod.COACH_CARDS);
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
        isFavorite={isFavorite(selectedCard.id)}
        onToggleFavorite={() => toggleFavorite(selectedCard.id)}
        onBack={() => setSelectedCard(null)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
      <h1 className="text-xl font-bold">Learn Mode</h1>

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

      <CardGrid
        cards={filtered}
        favorites={favorites}
        onSelect={setSelectedCard}
      />
    </div>
  );
}
