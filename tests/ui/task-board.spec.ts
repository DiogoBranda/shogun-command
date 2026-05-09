import { expect, test } from "@playwright/test";

test.describe("Task Board", () => {
  test("renders the validated fixture manifest by lane", async ({ page }) => {
    await page.goto("/tasks");

    await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
    await expect(page.getByText("Private roadmap for Shogun Command")).toBeVisible();
    await expect(page.getByText("Task source: e2e fixture")).toBeVisible();

    await expect(page.getByText("4", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Total", { exact: true })).toBeVisible();
    await expect(page.getByText("Now", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Blocked", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Done", { exact: true }).first()).toBeVisible();

    await expect(page.getByRole("heading", { name: "Validate task board schema" })).toBeVisible();
    await expect(page.locator("span").filter({ hasText: /^in progress$/i })).toBeVisible();
    await expect(page.locator("span").filter({ hasText: /^critical$/i })).toBeVisible();
    await expect(page.getByText("Run the task config check before deploying.")).toBeVisible();

    await expect(page.getByRole("heading", { name: "Review public task example" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Resolve deployment credentials" })).toBeVisible();
    await expect(page.locator("span").filter({ hasText: /^blocked$/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Document task upkeep" })).toBeVisible();
    await expect(page.locator("span").filter({ hasText: /^done$/i })).toBeVisible();

    await expect(page.getByRole("link", { name: /task docs/i })).toHaveAttribute("href", "/docs/features/command/task-board/");
  });
});
