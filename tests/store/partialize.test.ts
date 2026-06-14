import { describe, it, expect } from "vitest";
import { useAppStore } from "../../src/store/useAppStore";

describe("persist partialize", () => {
  it("persists data arrays but not function members", () => {
    // Touch the store so persist writes at least once.
    useAppStore.getState().toggleFavorite("__probe__");
    const raw = localStorage.getItem("kickercoach-store");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);

    // Functions (selectors/actions) must not be persisted.
    expect(parsed.state.getPlayerSessions).toBeUndefined();
    expect(parsed.state.addPlayer).toBeUndefined();
    expect(parsed.state.toggleFavorite).toBeUndefined();

    // Data arrays must be persisted.
    expect(Array.isArray(parsed.state.players)).toBe(true);
    expect(Array.isArray(parsed.state.favorites)).toBe(true);
    expect(parsed.state.favorites).toContain("__probe__");
  });
});
