import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3100";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Auto-start Next.js before tests when running locally or in CI without a
  // pre-deployed URL. Set PLAYWRIGHT_BASE_URL to skip (e.g. against Vercel preview).
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run start -- -p 3100",
        url: "http://localhost:3100",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        env: {
          PORT: "3100",
          // The instrumentation hook fails fast on missing prod env vars to
          // catch misconfigured Vercel deploys. The E2E harness intentionally
          // runs without prod secrets, so opt out of that check here only.
          ALLOW_MISSING_ENV: "1",
        },
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
