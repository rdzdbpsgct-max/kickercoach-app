import type { Player } from "../models/Player";
import type { Category } from "../models/CoachCard";
import type { Drill } from "../models/Drill";

/**
 * Get drill recommendations for a player based on their weakest skill categories.
 * Returns drill IDs sorted by relevance (weakest skills first).
 */
export function getRecommendedDrillIds(
  player: Player,
  drills: Drill[],
  maxResults = 5,
): string[] {
  // Find the 3 weakest skill categories
  const sortedSkills = (Object.entries(player.skillRatings) as [Category, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  if (sortedSkills.length === 0) return [];

  // Score drills by matching categories
  const scored: { id: string; score: number }[] = [];
  for (const drill of drills) {
    let score = 0;
    if (drill.category) {
      const catIndex = sortedSkills.indexOf(drill.category);
      if (catIndex !== -1) {
        // Higher score for weaker categories (index 0 = weakest)
        score += 3 - catIndex;
      }
    }
    // Also consider difficulty match
    if (drill.difficulty === player.level) {
      score += 1;
    }
    if (score > 0) {
      scored.push({ id: drill.id, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.id);
}

/**
 * Get the weakest skill categories for a player.
 */
export function getWeakCategories(player: Player, count = 3): Category[] {
  return (Object.entries(player.skillRatings) as [Category, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([cat]) => cat);
}
