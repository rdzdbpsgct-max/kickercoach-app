import { z } from "zod";

export const DifficultySchema = z.enum(["beginner", "intermediate", "advanced"]);

export const CategorySchema = z.enum([
  "Torschuss",
  "Passspiel",
  "Ballkontrolle",
  "Defensive",
  "Taktik",
  "Offensive",
  "Mental",
]);

export const CoachCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  difficulty: DifficultySchema,
  category: CategorySchema,
  tags: z.array(z.string()),
  steps: z.array(z.string()),
  commonMistakes: z.array(z.string()),
  coachCues: z.array(z.string()),
  prerequisites: z.array(z.string()).optional(),
  nextCards: z.array(z.string()).optional(),
});
