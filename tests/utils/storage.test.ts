import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getStorageUsage,
  importStoreData,
  exportStoreData,
} from "../../src/utils/storage";

function fileFrom(obj: unknown): File {
  return new File([JSON.stringify(obj)], "backup.json", {
    type: "application/json",
  });
}

function validPlayer(id: string, name: string) {
  return {
    id,
    name,
    preferredPosition: "offense",
    level: "beginner",
    notes: "",
    createdAt: new Date(0).toISOString(),
  };
}

describe("getStorageUsage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns zero usage when localStorage is empty", () => {
    const usage = getStorageUsage();
    expect(usage.usedBytes).toBe(0);
    expect(usage.usedKB).toBe(0);
    expect(usage.percentUsed).toBe(0);
  });

  it("calculates usage after adding data", () => {
    localStorage.setItem("test", "hello");
    const usage = getStorageUsage();
    // "test" (4 chars) + "hello" (5 chars) = 9 chars * 2 bytes = 18 bytes
    expect(usage.usedBytes).toBeGreaterThan(0);
    expect(usage.estimatedLimitMB).toBe(5);
  });

  it("increases usage with more data", () => {
    localStorage.setItem("a", "x");
    const usage1 = getStorageUsage();
    localStorage.setItem("b", "y".repeat(1000));
    const usage2 = getStorageUsage();
    expect(usage2.usedBytes).toBeGreaterThan(usage1.usedBytes);
  });
});

describe("importStoreData", () => {
  beforeEach(() => localStorage.clear());

  it("imports a valid meta+state backup and drops invalid items", async () => {
    const backup = {
      _meta: { app: "KickerCoach" },
      state: {
        players: [validPlayer("p1", "Anna"), { id: "bad" }],
        teams: [{ not: "a team" }],
      },
    };
    const res = await importStoreData(fileFrom(backup));
    expect(res.success).toBe(true);
    const stored = JSON.parse(
      localStorage.getItem("kickercoach-store") as string,
    );
    expect(stored.state.players).toHaveLength(1);
    // teams now validated → invalid item dropped
    expect(stored.state.teams).toHaveLength(0);
  });

  it("imports a raw state export (no _meta wrapper)", async () => {
    const res = await importStoreData(fileFrom({ players: [] }));
    expect(res.success).toBe(true);
  });

  it("validates favorites as strings", async () => {
    const backup = {
      _meta: { app: "KickerCoach" },
      state: { favorites: ["a", 42, "b"] },
    };
    const res = await importStoreData(fileFrom(backup));
    expect(res.success).toBe(true);
    const stored = JSON.parse(
      localStorage.getItem("kickercoach-store") as string,
    );
    expect(stored.state.favorites).toEqual(["a", "b"]);
  });

  it("fails gracefully on malformed JSON", async () => {
    const file = new File(["{ not json"], "b.json", {
      type: "application/json",
    });
    const res = await importStoreData(file);
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it("fails on a non-object payload", async () => {
    const res = await importStoreData(fileFrom(42));
    expect(res.success).toBe(false);
  });
});

describe("exportStoreData", () => {
  beforeEach(() => localStorage.clear());

  it("fails when there is nothing to export", () => {
    const res = exportStoreData();
    expect(res.success).toBe(false);
  });

  it("succeeds when store data exists", () => {
    localStorage.setItem(
      "kickercoach-store",
      JSON.stringify({ version: 4, state: { players: [] } }),
    );
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:x");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      () => {},
    );
    const res = exportStoreData();
    expect(res.success).toBe(true);
    vi.restoreAllMocks();
  });
});
