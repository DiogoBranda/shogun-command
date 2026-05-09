import { expect, test } from "@playwright/test";

async function disableMotion(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }
      button[aria-label="Open Next.js Dev Tools"] {
        display: none !important;
      }
    `
  });
}

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflowingElements = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    return [...document.querySelectorAll("body *")]
      .filter((element) => {
        const style = window.getComputedStyle(element);
        if (style.position === "fixed" || style.position === "absolute") return false;

        const rect = element.getBoundingClientRect();
        return rect.left < -1 || rect.right > width + 1;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          className: element.getAttribute("class"),
          text: element.textContent?.trim().slice(0, 80),
          left: rect.left,
          right: rect.right,
          width
        };
      });
  });

  expect(overflowingElements).toEqual([]);
}

async function expectMetricGridIsBounded(page: import("@playwright/test").Page) {
  const grid = page.getByTestId("mission-metric-grid");
  await expect(grid).toBeVisible();

  const widths = await grid.locator(":scope > div").evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().width));

  expect(widths).toHaveLength(4);
  for (const width of widths) {
    expect(width).toBeGreaterThan(250);
    expect(width).toBeLessThan(400);
  }
}

test.describe("Mission Control", () => {
  test("matches the desktop dashboard baseline", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Desktop-only screenshot");

    await page.goto("/");
    await disableMotion(page);

    await expect(page.getByRole("heading", { name: "Mission Control" })).toBeVisible();
    await expect(page.locator("aside")).toBeVisible();
    await expect(page.getByText("Operational Deck")).toBeVisible();
    await expect(page.getByTestId("daily-weather")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Daily Weather|May 9 forecast/ })).toBeVisible();
    await expect(page.getByText("Published by Cloudmancer")).toBeVisible();
    await expect(page.getByText("Pacos de Ferreira")).toBeVisible();
    await expect(page.getByText("Porto", { exact: true })).toBeVisible();
    await expectMetricGridIsBounded(page);
    await expectNoHorizontalOverflow(page);

    await expect(page).toHaveScreenshot("mission-control-desktop.png", {
      fullPage: true,
      animations: "disabled"
    });
  });

  test("matches the mobile dashboard baseline", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Mobile-only screenshot");

    await page.goto("/");
    await disableMotion(page);

    await expect(page.getByRole("heading", { name: "Mission Control" })).toBeVisible();
    await expect(page.locator("aside")).toBeHidden();
    await expect(page.getByText("Shogun Command", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /tasks/i })).toBeVisible();
    await expect(page.getByTestId("daily-weather")).toBeVisible();
    await expect(page.getByText("Published by Cloudmancer")).toBeVisible();
    await expect(page.getByText("Pacos de Ferreira")).toBeVisible();
    await expect(page.getByText("Porto", { exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await expect(page).toHaveScreenshot("mission-control-mobile.png", {
      fullPage: true,
      animations: "disabled"
    });
  });
});

test.describe("Team", () => {
  test("matches the desktop roster baseline", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Desktop-only screenshot");

    await page.goto("/team");
    await disableMotion(page);

    await expect(page.getByRole("heading", { name: "Team" })).toBeVisible();
    await expect(page.locator("aside")).toBeVisible();
    await expect(page.getByText("Specialist Roster")).toBeVisible();
    await expect(page.getByText("Diogo", { exact: true })).toBeVisible();
    await expect(page.getByText("Cloudmancer", { exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await expect(page).toHaveScreenshot("team-desktop.png", {
      fullPage: true,
      animations: "disabled"
    });
  });

  test("matches the mobile roster baseline", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "Mobile-only screenshot");

    await page.goto("/team");
    await disableMotion(page);

    await expect(page.getByRole("heading", { name: "Team" })).toBeVisible();
    await expect(page.locator("aside")).toBeHidden();
    await expect(page.getByText("Shogun Command", { exact: true })).toBeVisible();
    await expect(page.getByText("Specialist Roster")).toBeVisible();
    await expect(page.getByText("Cloudmancer", { exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await expect(page).toHaveScreenshot("team-mobile.png", {
      fullPage: true,
      animations: "disabled"
    });
  });
});
