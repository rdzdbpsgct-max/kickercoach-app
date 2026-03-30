import { z } from "zod";

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const SizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const TeamSchema = z.enum(["red", "blue"]);
export const ArrowTypeSchema = z.enum(["pass", "shot", "block"]);
export const ZoneShapeSchema = z.enum(["rectangle", "circle"]);

export const FigureMarkerSchema = z.object({
  id: z.string(),
  rodIndex: z.number(),
  team: TeamSchema,
  position: PointSchema,
  figureIndex: z.number(),
});

export const ArrowElementSchema = z.object({
  id: z.string(),
  arrowType: ArrowTypeSchema,
  start: PointSchema,
  end: PointSchema,
});

export const ZoneElementSchema = z.object({
  id: z.string(),
  shape: ZoneShapeSchema,
  origin: PointSchema,
  size: SizeSchema,
  color: z.string(),
});

export const BallMarkerSchema = z.object({
  id: z.string(),
  position: PointSchema,
});

export const TacticalSceneSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  figures: z.array(FigureMarkerSchema),
  arrows: z.array(ArrowElementSchema),
  zones: z.array(ZoneElementSchema),
  ball: BallMarkerSchema.nullable(),
});
