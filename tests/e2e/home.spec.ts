import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("renders the sticky header, carousel, sections and footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Folk & Form" }).first()).toBeVisible();
    await expect(page.getByRole("region", { name: "Featured collections" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Shop by hub" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "New in" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What customers say" })).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // Header stays fixed at the top after scrolling.
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(200);
    const box = await page.locator("header").boundingBox();
    expect(box?.y).toBe(0);
  });

  test("carousel arrows, dots and pause work", async ({ page }) => {
    await page.goto("/");
    const carousel = page.getByRole("region", { name: "Featured collections" });
    await carousel.getByRole("button", { name: "Pause slideshow" }).click();
    await expect(carousel.getByRole("button", { name: "Play slideshow" })).toBeVisible();

    await carousel.getByRole("button", { name: "Next slide" }).click();
    await expect(carousel.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute("aria-current", "true");
    await carousel.getByRole("button", { name: "Go to slide 4" }).click();
    await expect(carousel.getByRole("button", { name: "Go to slide 4" })).toHaveAttribute("aria-current", "true");
    await carousel.getByRole("button", { name: "Next slide" }).click();
    await expect(carousel.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute("aria-current", "true");
  });

  test("carousel auto-advances and stops under reduced motion", async ({ browser }) => {
    const normal = await browser.newPage();
    await normal.goto("/");
    await normal.mouse.move(0, 0);
    const dot2 = normal.getByRole("button", { name: "Go to slide 2" });
    await expect(dot2).toHaveAttribute("aria-current", "true", { timeout: 7000 });
    await normal.close();

    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const reduced = await ctx.newPage();
    await reduced.goto("/");
    await reduced.waitForTimeout(5500);
    await expect(reduced.getByRole("button", { name: "Go to slide 1" })).toHaveAttribute("aria-current", "true");
    await ctx.close();
  });

  test("has no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
