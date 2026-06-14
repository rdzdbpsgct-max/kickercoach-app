import type { ZodType } from "zod";

/**
 * Validate data against a Zod schema at runtime.
 * On success, returns the parsed data so schema defaults/transforms are applied.
 * On failure, logs a warning and returns the original data (cast to T) for
 * graceful degradation — the app keeps working even if the schema is stricter
 * than expected.
 */
export function validateOrWarn<T>(data: T, schema: ZodType, context: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn(
      `[KickerCoach] Validation warning in ${context}:`,
      result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "),
    );
    return data;
  }
  return result.data as T;
}
