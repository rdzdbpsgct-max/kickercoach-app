import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validateOrWarn } from "../../src/utils/validate";

describe("validateOrWarn", () => {
  it("applies schema defaults on success", () => {
    const schema = z.object({
      name: z.string(),
      tags: z.array(z.string()).default([]),
    });
    const out = validateOrWarn({ name: "x" }, schema, "test");
    expect(out).toEqual({ name: "x", tags: [] });
  });

  it("returns original data and warns on failure", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const schema = z.object({ name: z.string() });
    const bad = { name: 123 } as unknown;
    const out = validateOrWarn(bad, schema, "ctx");
    expect(out).toBe(bad);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
