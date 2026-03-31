import { z } from "zod";
import { CategorySchema, DifficultySchema } from "./coachCard";
import { RodPositionSchema } from "./drill";

export const TechniqueSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: CategorySchema,
  difficulty: DifficultySchema,
  description: z.string(),
  rodPositions: z.array(RodPositionSchema),
  measurableGoal: z.string().optional(),
  relatedDrillIds: z.array(z.string()),
  relatedCardIds: z.array(z.string()),
  tags: z.array(z.string()),
});
