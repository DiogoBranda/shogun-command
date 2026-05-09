import { expect, test } from "@playwright/test";

const allowedEmail = "e2e@shogun.local";
const deniedEmail = "intruder@shogun.local";

test.describe("Google Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("anonymous root redirects to login with callback", async ({ request }) => {
    const response = await request.get("/", { maxRedirects: 0 });

    expect(response.status()).toBe(307);
    expect(response.headers().location).toMatch(/\/login\?callbackUrl=%2F$/);
  });

  test("anonymous login page loads", async ({ page }) => {
    const response = await page.goto("/login");

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Google Login" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue With Google" })).toBeVisible();
  });

  test("anonymous API calls receive 401 JSON", async ({ request }) => {
    const response = await request.get("/api/system/health");

    expect(response.status()).toBe(401);
    expect(response.headers()["content-type"]).toMatch(/application\/json/);
    await expect(response.json()).resolves.toEqual({ error: "Authentication required" });
  });

  test("allowlisted test account reaches requested page", async ({ page }) => {
    await page.goto("/login?callbackUrl=/team");
    await page.getByLabel("Test account email").fill(allowedEmail);
    await page.getByRole("button", { name: "Continue With Test Login" }).click();

    await expect(page).toHaveURL(/\/team$/);
    await expect(page.getByRole("heading", { name: "Team" })).toBeVisible();
    await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible();
  });

  test("denied test account returns to login with access denied", async ({ page, request }) => {
    await page.goto("/login?callbackUrl=/");
    await page.getByLabel("Test account email").fill(deniedEmail);
    await page.getByRole("button", { name: "Continue With Test Login" }).click();

    await expect(page).toHaveURL(/\/login\?error=AccessDenied$/);
    await expect(page.getByText("This Google account is not cleared for Shogun Command.")).toBeVisible();

    const response = await request.get("/api/system/health");
    expect(response.status()).toBe(401);
  });

  test("sign out returns to login and clears the session", async ({ page }) => {
    await page.goto("/login?callbackUrl=/");
    await page.getByLabel("Test account email").fill(allowedEmail);
    await page.getByRole("button", { name: "Continue With Test Login" }).click();
    await expect(page.getByRole("heading", { name: "Mission Control" })).toBeVisible();

    await page.getByRole("button", { name: /sign out/i }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Google Login" })).toBeVisible();

    await page.goto("/");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2F$/);
  });
});
