import { expect, test } from "@playwright/test";

test("authenticate with test login", async ({ page }) => {
  await page.goto("/login?callbackUrl=/");
  await page.getByRole("button", { name: "Continue With Test Login" }).click();
  await expect(page.getByRole("heading", { name: "Mission Control" })).toBeVisible();
  await page.context().storageState({ path: "tests/ui/.auth/user.json" });
});
