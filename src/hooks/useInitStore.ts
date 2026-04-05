import { useEffect } from "react";
import { useAppStore } from "../store";
import { DEFAULT_TECHNIQUES } from "../data/techniques";

/**
 * Initializes store with default data on first load.
 * - Loads DEFAULT_TECHNIQUES if the techniques array is empty.
 */
export function useInitStore() {
  const techniques = useAppStore((s) => s.techniques);
  const setTechniques = useAppStore((s) => s.setTechniques);

  useEffect(() => {
    if (techniques.length === 0) {
      setTechniques(DEFAULT_TECHNIQUES);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
