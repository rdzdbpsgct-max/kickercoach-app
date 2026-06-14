import { describe, it, expect, afterAll } from "vitest";
import i18n, { SUPPORTED_LANGUAGES } from "../../src/i18n";

describe("English locale", () => {
  afterAll(() => i18n.changeLanguage("de"));

  it("supports de and en", () => {
    expect(SUPPORTED_LANGUAGES).toContain("de");
    expect(SUPPORTED_LANGUAGES).toContain("en");
  });

  it("resolves common strings in English when switched", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("actions.save", { ns: "common" })).toBe("Save");
    expect(i18n.t("export.button", { ns: "common" })).toBe("Export as PDF");
  });

  it("resolves the same key differently in German", async () => {
    await i18n.changeLanguage("de");
    expect(i18n.t("actions.save", { ns: "common" })).toBe("Speichern");
  });
});
