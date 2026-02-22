import type { Drill, TrainingBlock } from "../models/Drill";

export interface BlockState {
  blockIndex: number;
  block: TrainingBlock;
  isLast: boolean;
}

/**
 * Advance to the next block in a drill.
 * Returns null if already at the last block.
 */
export function advanceBlock(
  drill: Drill,
  currentIndex: number,
): BlockState | null {
  const nextIndex = currentIndex + 1;
  if (nextIndex >= drill.blocks.length) return null;
  return {
    blockIndex: nextIndex,
    block: drill.blocks[nextIndex],
    isLast: nextIndex === drill.blocks.length - 1,
  };
}

/**
 * Go to the previous block in a drill.
 * Returns null if already at the first block.
 */
export function previousBlock(
  drill: Drill,
  currentIndex: number,
): BlockState | null {
  const prevIndex = currentIndex - 1;
  if (prevIndex < 0) return null;
  return {
    blockIndex: prevIndex,
    block: drill.blocks[prevIndex],
    isLast: prevIndex === drill.blocks.length - 1,
  };
}

/**
 * Validate a drill. Returns an array of error messages (empty = valid).
 */
export function validateDrill(drill: Drill): string[] {
  const errors: string[] = [];
  if (!drill.name.trim()) errors.push("Name darf nicht leer sein.");
  if (!drill.focusSkill.trim())
    errors.push("Fokus-Skill darf nicht leer sein.");
  if (drill.blocks.length === 0)
    errors.push("Mindestens ein Block erforderlich.");
  for (let i = 0; i < drill.blocks.length; i++) {
    const block = drill.blocks[i];
    if (block.durationSeconds <= 0)
      errors.push(`Block ${i + 1}: Dauer muss positiv sein.`);
  }
  return errors;
}

/**
 * Calculate total duration of a drill in seconds.
 */
export function drillTotalDuration(drill: Drill): number {
  return drill.blocks.reduce((sum, b) => sum + b.durationSeconds, 0);
}
