import { describe, it, expect } from "vitest";
import { migrateArray, migrateValue } from "../../src/store/migrate";
import { SessionSchema } from "../../src/domain/schemas";

describe("migrateArray", () => {
  it("migrates valid items and adds defaults", () => {
    const oldSessions = [
      {
        id: "s1",
        name: "Test",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
      },
    ];
    const result = migrateArray(oldSessions, SessionSchema);
    expect(result).toHaveLength(1);
    expect(result[0].playerIds).toEqual([]);
    expect(result[0].focusAreas).toEqual([]);
  });

  it("filters out invalid items", () => {
    const data = [
      {
        id: "s1",
        name: "Valid",
        date: "2026-03-30",
        drillIds: [],
        notes: "",
        totalDuration: 0,
      },
      { broken: true },
    ];
    const result = migrateArray(data, SessionSchema);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("s1");
  });

  it("returns empty array for non-array input", () => {
    expect(migrateArray("not-an-array", SessionSchema)).toEqual([]);
    expect(migrateArray(null, SessionSchema)).toEqual([]);
    expect(migrateArray(undefined, SessionSchema)).toEqual([]);
  });
});

describe("migrateValue", () => {
  it("returns parsed value for valid input", () => {
    const session = {
      id: "s1",
      name: "Test",
      date: "2026-03-30",
      drillIds: [],
      notes: "",
      totalDuration: 0,
    };
    const result = migrateValue(session, SessionSchema);
    expect(result).not.toBeNull();
    expect(result!.playerIds).toEqual([]);
  });

  it("returns null for invalid input", () => {
    expect(migrateValue({ broken: true }, SessionSchema)).toBeNull();
  });
});
