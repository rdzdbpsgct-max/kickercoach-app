import { z } from "zod";

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  playerIds: z.tuple([z.string(), z.string()]),
  notes: z.string().optional(),
  roles: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string(),
});
