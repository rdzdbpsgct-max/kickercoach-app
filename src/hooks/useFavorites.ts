import { useLocalStorage } from "./useLocalStorage";
import { useCallback } from "react";

/**
 * Hook for managing favorite IDs in localStorage.
 */
export function useFavorites(storageKey: string = "kickercoach-favorites") {
  const [favorites, setFavorites] = useLocalStorage<string[]>(storageKey, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
      );
    },
    [setFavorites],
  );

  return { favorites, isFavorite, toggleFavorite };
}
