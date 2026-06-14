import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// The app is served under a base path (import.meta.env.BASE_URL), which is
// "/kicker-coach/" in local dev and "/" on Vercel. Public-asset fetches must
// include that base or they 404 in dev.
describe("data loaders fetch under the configured base URL", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("BASE_URL", "/kicker-coach/");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("loadDrills fetches drills.json under BASE_URL", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ json: async () => [] } as Response);
    vi.stubGlobal("fetch", fetchMock);
    const { loadDrills } = await import("../../src/data/drills");
    await loadDrills();
    expect(fetchMock).toHaveBeenCalledWith("/kicker-coach/data/drills.json");
  });

  it("loadCoachCards fetches coachCards.json under BASE_URL", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ json: async () => [] } as Response);
    vi.stubGlobal("fetch", fetchMock);
    const { loadCoachCards } = await import("../../src/data/coachCards");
    await loadCoachCards();
    expect(fetchMock).toHaveBeenCalledWith(
      "/kicker-coach/data/coachCards.json",
    );
  });
});
