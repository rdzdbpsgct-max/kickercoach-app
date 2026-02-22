import { describe, it, expect } from "vitest";
import {
  advanceBlock,
  previousBlock,
  validateDrill,
  drillTotalDuration,
} from "../../src/domain/logic/drill";
import type { Drill } from "../../src/domain/models/Drill";

const testDrill: Drill = {
  id: "test-1",
  name: "Test Drill",
  focusSkill: "Pull-Shot",
  blocks: [
    { type: "work", durationSeconds: 30, note: "Aufwaermen" },
    { type: "rest", durationSeconds: 10, note: "Pause" },
    { type: "work", durationSeconds: 60, note: "Training" },
  ],
};

describe("advanceBlock", () => {
  it("advances from first to second block", () => {
    const result = advanceBlock(testDrill, 0);
    expect(result).not.toBeNull();
    expect(result!.blockIndex).toBe(1);
    expect(result!.block.type).toBe("rest");
    expect(result!.isLast).toBe(false);
  });

  it("advances to last block and marks isLast", () => {
    const result = advanceBlock(testDrill, 1);
    expect(result).not.toBeNull();
    expect(result!.blockIndex).toBe(2);
    expect(result!.isLast).toBe(true);
  });

  it("returns null when at last block", () => {
    expect(advanceBlock(testDrill, 2)).toBeNull();
  });
});

describe("previousBlock", () => {
  it("goes back from second to first block", () => {
    const result = previousBlock(testDrill, 1);
    expect(result).not.toBeNull();
    expect(result!.blockIndex).toBe(0);
  });

  it("returns null when at first block", () => {
    expect(previousBlock(testDrill, 0)).toBeNull();
  });
});

describe("validateDrill", () => {
  it("validates a correct drill", () => {
    expect(validateDrill(testDrill)).toEqual([]);
  });

  it("rejects empty name", () => {
    const drill = { ...testDrill, name: "  " };
    const errors = validateDrill(drill);
    expect(errors).toContain("Name darf nicht leer sein.");
  });

  it("rejects empty focusSkill", () => {
    const drill = { ...testDrill, focusSkill: "" };
    const errors = validateDrill(drill);
    expect(errors).toContain("Fokus-Skill darf nicht leer sein.");
  });

  it("rejects empty blocks", () => {
    const drill = { ...testDrill, blocks: [] };
    const errors = validateDrill(drill);
    expect(errors).toContain("Mindestens ein Block erforderlich.");
  });

  it("rejects block with zero duration", () => {
    const drill = {
      ...testDrill,
      blocks: [{ type: "work" as const, durationSeconds: 0, note: "" }],
    };
    const errors = validateDrill(drill);
    expect(errors).toContain("Block 1: Dauer muss positiv sein.");
  });
});

describe("drillTotalDuration", () => {
  it("sums all block durations", () => {
    expect(drillTotalDuration(testDrill)).toBe(100);
  });
});
