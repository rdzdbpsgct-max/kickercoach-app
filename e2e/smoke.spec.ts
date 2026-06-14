import { test, expect, type Page } from "@playwright/test";

// The app defaults to German; force it so assertions are deterministic
// regardless of the browser locale.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("kickercoach-language", "de");
  });
});

/** The main desktop navigation landmark (scopes link lookups away from
 * the home page's quick-action / onboarding links of the same name). */
function mainNav(page: Page) {
  return page.getByRole("navigation", { name: "Hauptnavigation" });
}

test("app loads and shows the main navigation", async ({ page }) => {
  await page.goto("/");
  await expect(mainNav(page)).toBeVisible();
  await expect(mainNav(page).getByRole("link", { name: "Training" })).toBeVisible();
  await expect(mainNav(page).getByRole("link", { name: "Spieler" })).toBeVisible();
});

test("training mode loads drills (data fetch resolves under the base URL)", async ({
  page,
}) => {
  await page.goto("/");
  await mainNav(page).getByRole("link", { name: "Training" }).click();
  // A seeded drill must render — this fails if the /data/*.json fetch 404s.
  await expect(page.getByText("Pull-Shot Basics")).toBeVisible({
    timeout: 10_000,
  });
});

test("language switch changes the UI to English", async ({ page }) => {
  await page.goto("/#/settings");
  await expect(page.getByRole("heading", { name: "Einstellungen" })).toBeVisible();
  await page.getByTestId("language-select").selectOption("en");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  // The nav's own accessible name is now English too, so don't scope by the
  // German landmark name — the Players link is unique on the settings page.
  await expect(page.getByRole("link", { name: "Players" })).toBeVisible();
});
