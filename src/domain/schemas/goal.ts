import { z } from "zod";
import { CategorySchema } from "./coachCard";

export const GoalStatusSchema = z.enum(["active", "achieved", "paused"]);

export const GoalSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: CategorySchema,
  targetDate: z.string().optional(),
  status: GoalStatusSchema.default("active"),
  createdAt: z.string(),
});
