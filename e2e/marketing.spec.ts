import { test, expect } from "@playwright/test";

// Smoke checks on marketing pages — they're linked from external launch
// material, so a 200 + correct title is the floor we don't want to regress.

const MARKETING_PATHS = [
  "/",
  "/about",
  "/contact",
  "/faq",
  "/how-it-works",
  "/simulation",
  "/privacy",
  "/terms",
] as const;

test.describe("Marketing pages", () => {
  for (const path of MARKETING_PATHS) {
    test(`${path} renders without redirecting to /auth`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should respond 2xx`).toBeLessThan(400);
      await expect(page).toHaveTitle(/BiggDate/i);
      await expect(page).not.toHaveURL(/\/auth/);
    });
  }

  test("sitemap.xml is reachable and references at least one marketing page", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/<urlset|<sitemapindex/);
    expect(body).toMatch(/\/how-it-works|\/faq|\/simulation/);
  });
});
