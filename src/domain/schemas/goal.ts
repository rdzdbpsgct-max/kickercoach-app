import { z } from "zod";
import { CategorySchema } from "./coachCard";

export const GoalStatusSchema = z.enum([
  "active",
  "achieved",
  "paused",
  "abandoned",
]);

export const GoalSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: CategorySchema,
  techniqueId: z.string().optional(),
  targetValue: z.number().min(0).optional(),
  currentValue: z.number().min(0).optional(),
  targetDate: z.string().optional(),
  status: GoalStatusSchema.default("active"),
  createdAt: z.string(),
});
