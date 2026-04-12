This is a Next.js app for BiggDate.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy env template:

```bash
cp .env.example .env.local
```

3. Configure AI provider in `.env.local`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

4. Configure Supabase in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_DB_URL=postgresql://postgres.<project_ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

`DATABASE_URL` is also supported as a fallback.

5. Configure auth email delivery in the Supabase dashboard.

Supabase Auth sends signup confirmation and password reset emails. If you connect Resend there directly, no extra app-side email env vars are required.

6. Apply the database schema to your Supabase project:

- Preferred: run the SQL in [supabase/migrations/202604110001_initial_schema.sql](/Users/themeetpatel/Startups/biggdate/supabase/migrations/202604110001_initial_schema.sql) with the Supabase CLI or SQL editor.
- Convenience fallback: if `SUPABASE_DB_URL` or `DATABASE_URL` is set, the app will bootstrap any missing tables, columns, and indexes on startup.

7. Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Notes

- The app now uses the standard `pg` driver, which works with Supabase Postgres directly.
- The canonical schema lives in [supabase/migrations/202604110001_initial_schema.sql](/Users/themeetpatel/Startups/biggdate/supabase/migrations/202604110001_initial_schema.sql).
- If no DB URL is set, the app boots and skips DB bootstrap.
