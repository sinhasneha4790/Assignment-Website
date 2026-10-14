import { expect, test } from "@playwright/test";

// Skip the cookie banner so it doesn't cover controls.
test.beforeEach(async ({ page, baseURL }) => {
  await page.context().addCookies([{ name: "ff_consent", value: "all", url: baseURL! }]);
});

test("hub switch swaps content without a reload and updates the URL", async ({ page }) => {
  await page.goto("/women");
  await expect(page.getByRole("heading", { level: 1, name: "Women" })).toBeVisible();
  await expect(page.getByText(/Shirts, tailoring and workwear/)).toBeVisible();
  await page.evaluate(() => ((window as unknown as { marker: boolean }).marker = true));

  await page.getByRole("button", { name: "Casual", exact: true }).click();
  await expect(page).toHaveURL(/\/women\?line=casual$/);
  await expect(page.getByText(/Easy linen, soft knits/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Relaxed dresses" })).toBeVisible();
  // Same document: no reload happened.
  expect(await page.evaluate(() => (window as unknown as { marker?: boolean }).marker)).toBe(true);
});

test("listing filters and sort live in the URL", async ({ page, isMobile }) => {
  await page.goto("/women/professional/shirts-blouses");
  await expect(page.getByRole("heading", { level: 1, name: "Shirts & blouses" })).toBeVisible();
  const count = async () => Number((await page.getByText(/^\d+ styles?/).first().textContent())!.match(/\d+/)![0]);
  const before = await count();

  if (isMobile) await page.getByRole("button", { name: /^Filters/ }).click();
  const scope = isMobile ? page.getByRole("dialog", { name: "Filters" }) : page.getByRole("complementary", { name: "Filters" });
  await scope.getByRole("checkbox", { name: "Linen" }).check();
  await expect(page).toHaveURL(/fabric=Linen/);
  await expect.poll(count).toBeLessThan(before);
  if (isMobile) await scope.getByRole("button", { name: /^Show \d+ result/ }).click();

  await page.getByLabel("Sort by").selectOption("price-desc");
  await expect(page).toHaveURL(/sort=price-desc/);
  await expect(page.getByRole("button", { name: "Remove filter Linen" })).toBeVisible();

  await page.getByRole("button", { name: "Clear all" }).click();
  await expect(page).not.toHaveURL(/fabric=/);
  await expect.poll(count).toBe(before);
});

test("load more shows 12 more and keeps a shareable URL", async ({ page }) => {
  await page.goto("/women/professional");
  await expect(page.getByText(/Showing 12 of \d+/)).toBeVisible();
  await page.getByRole("link", { name: "Load more" }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByText(/Showing (1[3-9]|2\d) of/)).toBeVisible();
});

test("product: colour switches the gallery and the size guide closes on Back", async ({ page }) => {
  await page.goto("/p/linen-workday-shirt");
  await expect(page.getByRole("heading", { level: 1, name: "Linen Workday Shirt" })).toBeVisible();
  const gallery = page.getByRole("list", { name: "Linen Workday Shirt photos" });
  await expect(gallery.getByRole("img").first()).toHaveAttribute("alt", /ecru/);
  await page.getByRole("button", { name: "Sage" }).click();
  await expect(gallery.getByRole("img").first()).toHaveAttribute("alt", /sage/);

  // Largest size of the first colour is seeded as sold out.
  await page.getByRole("button", { name: "Ecru" }).click();
  await expect(page.getByRole("button", { name: /3XL \(sold out\)/ })).toBeDisabled();

  await page.getByRole("button", { name: "Size guide" }).click();
  const panel = page.getByRole("dialog", { name: "Size guide" });
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "inches" }).click();
  await expect(panel.getByRole("columnheader", { name: /Bust \(in\)/ })).toBeVisible();
  await page.goBack();
  await expect(panel).toBeHidden();
  await expect(page).toHaveURL(/\/p\/linen-workday-shirt$/);
});

test("add to bag, change quantity, apply a coupon", async ({ page }) => {
  await page.goto("/p/organic-cotton-tee");
  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByText("Please choose a size.")).toBeVisible();

  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  const mini = page.getByRole("dialog", { name: "Added to bag" });
  await expect(mini).toBeVisible();
  await expect(mini.getByText("Oat · Size M")).toBeVisible();
  await expect(page.getByRole("link", { name: "Bag, 1 item" })).toBeVisible();
  await mini.getByRole("link", { name: /View bag/ }).click();

  // ₹1,190 is below the ₹2,999 free-delivery threshold.
  await expect(page.getByRole("heading", { level: 1, name: /Your bag/ })).toBeVisible();
  await expect(page.getByText(/Add .* more for free delivery/)).toBeVisible();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.getByRole("link", { name: "Bag, 2 items" })).toBeVisible();
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.getByText("You have free delivery.")).toBeVisible();

  // 3 × ₹1,190 = ₹3,570; FOLK200 takes ₹200 off.
  await page.getByLabel("Coupon code").fill("folk200");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("FOLK200 applied")).toBeVisible();
  const summary = page.getByRole("complementary", { name: "Order summary" });
  await expect(summary.getByText("−₹200")).toBeVisible();
  await expect(summary.getByText("₹3,370")).toBeVisible();
});

test("search tolerates typos and suggests a correction", async ({ page }) => {
  await page.goto("/search?q=linnen+shirt");
  await expect(page.getByRole("heading", { level: 1, name: /Results for/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Linen Workday Shirt/ }).first()).toBeVisible();

  await page.goto("/search?q=linnen+shrit");
  await expect(page.getByRole("heading", { name: "No results for “linnen shrit”" })).toBeVisible();
  await page.getByRole("link", { name: "linen shirt" }).first().click();
  await expect(page).toHaveURL(/q=linen(\+|%20)shirt/);
  await expect(page.getByRole("link", { name: /Linen Workday Shirt/ }).first()).toBeVisible();
});

test("instant suggestions appear after two characters", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("combobox", { name: "Search Folk & Form" }).fill("blaz");
  await expect(page.getByRole("listbox", { name: "Suggestions" })).toBeVisible();
  await expect(page.getByRole("option", { name: /Blazer/ }).first()).toBeVisible();
});

test("PIN code check shows a delivery date and COD", async ({ page }) => {
  await page.goto("/p/linen-workday-shirt");
  await page.getByLabel("Check delivery").fill("781001");
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.getByText(/Delivery by .* Cash on delivery available/)).toBeVisible();
});

for (const path of ["/women", "/teens", "/women/professional/shirts-blouses", "/p/linen-workday-shirt", "/search?q=linen", "/size-guide", "/cart", "/sale", "/new-in"]) {
  test(`no horizontal scroll on ${path}`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
