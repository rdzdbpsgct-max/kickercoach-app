import { z } from "zod";
import { DifficultySchema } from "./coachCard";
import { RodPositionSchema } from "./drill";

export const PositionSchema = z.enum(["offense", "defense", "both"]);

const SkillRatingValue = z.number().int().min(1).max(5);

export const SkillRatingsSchema = z.object({
  Torschuss: SkillRatingValue,
  Passspiel: SkillRatingValue,
  Ballkontrolle: SkillRatingValue,
  Defensive: SkillRatingValue,
  Taktik: SkillRatingValue,
  Offensive: SkillRatingValue,
  Mental: SkillRatingValue,
});

export const DEFAULT_SKILL_RATINGS = {
  Torschuss: 3,
  Passspiel: 3,
  Ballkontrolle: 3,
  Defensive: 3,
  Taktik: 3,
  Offensive: 3,
  Mental: 3,
} as const;

export const PlayerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  nickname: z.string().optional(),
  preferredPosition: PositionSchema,
  preferredPositions: z.array(RodPositionSchema).optional(),
  isActive: z.boolean().optional(),
  level: DifficultySchema,
  notes: z.string(),
  skillRatings: SkillRatingsSchema.default(DEFAULT_SKILL_RATINGS),
  avatarColor: z.string().optional(),
  createdAt: z.string(),
});
