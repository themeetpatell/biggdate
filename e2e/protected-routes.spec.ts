import { test, expect } from "@playwright/test";

// Regression net for the auth boundary: protected pages must redirect to
// /auth, and sensitive POST endpoints must reject unauthenticated callers
// before doing any work. If any of these flips to a 2xx for an anonymous
// caller, that's a security regression — not a flake.

// /onboarding is intentionally public (see PUBLIC_PATHS in src/proxy.ts) — it
// renders before a user has a profile and handles auth state client-side.
const PROTECTED_PAGES = [
  "/dashboard",
  "/matches",
  "/messages",
  "/intros",
  "/profile",
  "/admin",
  "/settings/billing",
] as const;

test.describe("Protected pages redirect to /auth when unauthenticated", () => {
  for (const path of PROTECTED_PAGES) {
    test(`${path} redirects to /auth`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/auth/);
    });
  }
});

test.describe("Sensitive APIs reject unauthenticated callers", () => {
  test("DELETE /api/auth/delete → 401", async ({ request }) => {
    const res = await request.delete("/api/auth/delete");
    expect(res.status()).toBe(401);
  });

  test("POST /api/intros/request → 401", async ({ request }) => {
    const res = await request.post("/api/intros/request", {
      data: { targetUserId: "00000000-0000-0000-0000-000000000000" },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/safety/report → 401", async ({ request }) => {
    const res = await request.post("/api/safety/report", {
      data: { targetUserId: "00000000-0000-0000-0000-000000000000", reason: "spam" },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/billing/webhook without signature → 400 (or 503 when unconfigured)", async ({ request }) => {
    // Unsigned webhooks must never be processed. The server returns 400 in
    // configured environments (Stripe rejects via constructEvent) or 503 in
    // unconfigured ones. Either is acceptable — 2xx is not.
    const res = await request.post("/api/billing/webhook", {
      data: { fake: true },
    });
    expect([400, 503]).toContain(res.status());
  });

  test("POST /api/billing/redeem → 401 when unauthenticated", async ({ request }) => {
    const res = await request.post("/api/billing/redeem", {
      data: { code: "themeetpatel" },
    });
    // Either 401 (auth-gated) or 503 (early-access mode disabled). Never 2xx.
    expect([401, 503]).toContain(res.status());
  });

  test("POST /api/notifications/email without x-internal-secret → 403 (or 503 when unconfigured)", async ({ request }) => {
    const res = await request.post("/api/notifications/email", {
      data: { event: "welcome", toUserId: "00000000-0000-0000-0000-000000000000" },
    });
    expect([403, 503]).toContain(res.status());
  });
});

test.describe("Health endpoint", () => {
  test("GET /api/health returns ok|degraded with checks payload", async ({ request }) => {
    const res = await request.get("/api/health");
    // 200 when all dependencies pass; 503 when any dependency check failed.
    expect([200, 503]).toContain(res.status());
    const body = await res.json();
    expect(body.status).toMatch(/^(ok|degraded)$/);
    expect(body.checks).toEqual(
      expect.objectContaining({
        db: expect.stringMatching(/^(ok|fail|skip)$/),
        redis: expect.stringMatching(/^(ok|fail|skip)$/),
        stripe: expect.stringMatching(/^(ok|fail|skip)$/),
      }),
    );
  });
});
