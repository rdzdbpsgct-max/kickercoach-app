import type { z } from "zod";

export function migrateArray<T>(raw: unknown, schema: z.ZodType<T>): T[] {
  if (!Array.isArray(raw)) return [];

  const results: T[] = [];
  for (const item of raw) {
    const parsed = schema.safeParse(item);
    if (parsed.success) {
      results.push(parsed.data);
    }
  }
  return results;
}

export function migrateValue<T>(
  raw: unknown,
  schema: z.ZodType<T>,
): T | null {
  const parsed = schema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}
