import { z } from "zod";
import { DifficultySchema, CategorySchema } from "./coachCard";

export const TrainingBlockSchema = z.object({
  type: z.enum(["work", "rest"]),
  durationSeconds: z.number().min(0),
  note: z.string(),
});

export const RodPositionSchema = z
  .enum(["keeper", "defense", "midfield", "offense"])
  .optional();

export const DrillSchema = z.object({
  id: z.string(),
  name: z.string(),
  focusSkill: z.string(),
  blocks: z.array(TrainingBlockSchema),
  difficulty: DifficultySchema.optional(),
  description: z.string().optional(),
  category: CategorySchema.optional(),
  position: RodPositionSchema,
  playerCount: z.union([z.literal(1), z.literal(2)]).default(1),
  isCustom: z.boolean().default(false),
  prerequisites: z.array(z.string()).optional(),
  variations: z.array(z.string()).optional(),
  measurableGoal: z.string().optional(),
});
