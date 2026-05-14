/**
 * Creates a stable E2E test account in Supabase.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/create-e2e-user.ts
 *
 * Then add the printed credentials to:
 *   - .env.local:                E2E_TEST_EMAIL, E2E_TEST_PASSWORD
 *   - GitHub Actions secrets:    E2E_TEST_EMAIL, E2E_TEST_PASSWORD
 *   - GitHub Actions variable:   PLAYWRIGHT_BASE_URL (your Vercel staging URL)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  process.exit(1);
}

const E2E_EMAIL = "e2e-runner@test.biggdate.app";
const E2E_PASSWORD = `E2E-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  const { data: existing } = await admin.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === E2E_EMAIL);

  if (found) {
    const { error } = await admin.auth.admin.updateUserById(found.id, { password: E2E_PASSWORD });
    if (error) throw error;
    console.log("Updated existing E2E user password.");
  } else {
    const { error } = await admin.auth.admin.createUser({
      email: E2E_EMAIL,
      password: E2E_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "E2E Runner", username: "e2erunner" },
    });
    if (error) throw error;
    console.log("Created new E2E user.");
  }

  console.log("\n--- Copy these to your secrets ---");
  console.log(`E2E_TEST_EMAIL=${E2E_EMAIL}`);
  console.log(`E2E_TEST_PASSWORD=${E2E_PASSWORD}`);
  console.log("\nGitHub: Settings → Secrets → E2E_TEST_EMAIL + E2E_TEST_PASSWORD");
  console.log("GitHub: Settings → Variables → PLAYWRIGHT_BASE_URL=https://your-staging.vercel.app");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
