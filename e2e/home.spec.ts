import { expect, test } from "@playwright/test";

test("home page shows the Riley Musil hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /capturing the moment/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /trashbox/i })).toHaveAttribute(
    "href",
    "https://trashbox.io/",
  );
});

test("primary navigation reaches contact", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: /primary/i }).getByRole("link", { name: /contact/i }).click();
  await expect(page.getByRole("heading", { name: /let's connect/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /rileymusil2006@gmail.com/i })).toBeVisible();
});
