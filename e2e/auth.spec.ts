import { test, expect } from "@playwright/test";

// Tests require a running app (npm run dev or PLAYWRIGHT_BASE_URL pointing at a preview deployment).
// For CI, set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to a seeded test account.

const TEST_EMAIL = process.env.E2E_TEST_EMAIL || "e2e@test.biggdate.app";
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || "TestPass123!";

test.describe("Auth flow", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/auth");
    await expect(page).toHaveTitle(/BiggDate/);
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("shows error on wrong credentials", async ({ page }) => {
    await page.goto("/auth");
    await page.getByPlaceholder(/username or email/i).fill("nobody@nowhere.com");
    await page.getByPlaceholder(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test("signup mode shows correct fields", async ({ page }) => {
    await page.goto("/auth");
    await page.getByText(/create account|sign up/i).first().click();
    await expect(page.getByPlaceholder(/full name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/username/i)).toBeVisible();
  });

  test("protected route /dashboard redirects to /auth when unauthenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("protected route /matches redirects to /auth when unauthenticated", async ({ page }) => {
    await page.goto("/matches");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("protected route /messages redirects to /auth when unauthenticated", async ({ page }) => {
    await page.goto("/messages");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("authenticated login redirects to dashboard or onboarding", async ({ page }) => {
    test.skip(!process.env.E2E_TEST_EMAIL, "E2E_TEST_EMAIL not set — skipping credential test");
    await page.goto("/auth");
    await page.getByPlaceholder(/username or email/i).fill(TEST_EMAIL);
    await page.getByPlaceholder(/password/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 10000 });
  });
});
