import type { ZodType } from "zod";

/**
 * Validate data against a Zod schema at runtime.
 * Logs a warning on validation failure but always returns the original
 * data (cast to T) to ensure graceful degradation — the app continues
 * working even if the schema is stricter than expected.
 */
export function validateOrWarn<T>(data: T, schema: ZodType, context: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn(
      `[KickerCoach] Validation warning in ${context}:`,
      result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "),
    );
  }
  return data;
}
