import { describe, it, expect, vi, afterEach } from "vitest";
import { downloadBlob, slugify } from "../../src/utils/download";

describe("slugify", () => {
  it("lowercases and replaces non-alphanumerics with hyphens", () => {
    expect(slugify("Max Müller")).toBe("max-muller");
    expect(slugify("FC Bayern 2026!")).toBe("fc-bayern-2026");
  });
  it("falls back to 'export' for empty input", () => {
    expect(slugify("   ")).toBe("export");
  });
});

describe("downloadBlob", () => {
  afterEach(() => vi.restoreAllMocks());

  it("creates an object URL, clicks an anchor, and revokes the URL", () => {
    const createSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:test");
    const revokeSpy = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    downloadBlob(new Blob(["x"]), "file.pdf");

    expect(createSpy).toHaveBeenCalledOnce();
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(revokeSpy).toHaveBeenCalledWith("blob:test");
  });
});
