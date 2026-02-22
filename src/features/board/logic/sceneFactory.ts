import type {
  TacticalScene,
  FigureMarker,
  BallMarker,
} from "../../../domain/models/TacticalBoard";
import { RODS, FIELD, FIELD_MARGIN } from "../../../data/fieldConfig";

/** Distribute N figures evenly along a rod's playable Y range */
function distributeOnRod(
  rodIndex: number,
  team: "red" | "blue",
  figureCount: number,
  rodX: number,
): FigureMarker[] {
  const minY = FIELD_MARGIN;
  const maxY = FIELD.height - FIELD_MARGIN;
  const spacing = (maxY - minY) / (figureCount + 1);

  return Array.from({ length: figureCount }, (_, i) => ({
    id: `fig-${rodIndex}-${i}`,
    rodIndex,
    team,
    position: { x: rodX, y: minY + spacing * (i + 1) },
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
export function createDefaultScene(name: string = "Neue Szene"): TacticalScene {
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
