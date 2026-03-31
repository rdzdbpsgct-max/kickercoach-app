import { z } from "zod";
import { DifficultySchema, CategorySchema } from "./coachCard";

export const BlockTypeSchema = z.enum(["work", "rest", "repetitions"]);

export const TrainingBlockSchema = z.object({
  type: BlockTypeSchema,
  durationSeconds: z.number().min(0),
  repetitions: z.number().min(1).optional(),
  note: z.string(),
});

export const RodPositionSchema = z
  .enum(["keeper", "defense", "midfield", "offense"])
  .optional();

export const DrillPhaseSchema = z.enum(["warmup", "technique", "game", "cooldown"]);

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
  phase: DrillPhaseSchema.optional(),
  techniqueIds: z.array(z.string()).optional(),
});
