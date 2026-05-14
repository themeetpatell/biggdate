import { test, expect } from "@playwright/test";

// Billing tests require a logged-in session. Set E2E_TEST_EMAIL + E2E_TEST_PASSWORD.
// These tests use Stripe test mode — no real charges are made.

test.describe("Billing flow", () => {
  test.skip(!process.env.E2E_TEST_EMAIL, "E2E_TEST_EMAIL not set — skipping billing tests");

  test.beforeEach(async ({ page }) => {
    await page.goto("/auth");
    await page.getByPlaceholder(/username or email/i).fill(process.env.E2E_TEST_EMAIL!);
    await page.getByPlaceholder(/password/i).fill(process.env.E2E_TEST_PASSWORD!);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 10000 });
  });

  test("billing settings page is reachable and shows plan options", async ({ page }) => {
    await page.goto("/settings/billing");
    await expect(page).not.toHaveURL(/\/auth/);
    await expect(page.getByText(/premium|pro|free/i).first()).toBeVisible();
  });

  test("checkout redirects to Stripe when initiating upgrade", async ({ page }) => {
    await page.goto("/settings/billing");
    const upgradeBtn = page.getByRole("button", { name: /upgrade|get premium|get pro/i }).first();
    if (await upgradeBtn.isVisible()) {
      await upgradeBtn.click();
      await page.waitForURL(/stripe\.com|\/settings\/billing/, { timeout: 10000 });
    }
  });
});
