import type {
  TacticalScene,
  FigureMarker,
  BallMarker,
} from "../../../domain/models/TacticalBoard";
import { RODS, FIELD, FIGURE_SPACING } from "../../../data/fieldConfig";

/**
 * Distribute figures on a rod using realistic fixed spacing.
 * Figures are centered vertically on the field, just like on a real table.
 */
function distributeOnRod(
  rodIndex: number,
  team: "red" | "blue",
  figureCount: number,
  rodX: number,
): FigureMarker[] {
  const centerY = FIELD.height / 2;
  const spacing = FIGURE_SPACING[figureCount] ?? 80;
  const totalSpan = spacing * (figureCount - 1);
  const startY = centerY - totalSpan / 2;

  return Array.from({ length: figureCount }, (_, i) => ({
    id: `fig-${rodIndex}-${i}`,
    rodIndex,
    team,
    position: { x: rodX, y: startY + spacing * i },
    figureIndex: i,
  }));
}

/** Create default figures for all rods */
export function createDefaultFigures(): FigureMarker[] {
  return RODS.flatMap((rod) =>
    distributeOnRod(rod.index, rod.team, rod.figureCount, rod.xPosition),
  );
}

/** Create a default ball at field center */
export function createDefaultBall(): BallMarker {
  return {
    id: "ball",
    position: { x: FIELD.width / 2, y: FIELD.height / 2 },
  };
}

/** Create a new empty/default tactical scene */
export function createDefaultScene(
  name: string = "Neue Szene",
): TacticalScene {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    figures: createDefaultFigures(),
    arrows: [],
    zones: [],
    ball: createDefaultBall(),
  };
}
