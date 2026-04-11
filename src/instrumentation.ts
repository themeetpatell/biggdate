export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { hasDatabaseConfig, migrate } = await import("./lib/db");
    if (!hasDatabaseConfig()) {
      console.warn("[db] Skipping migration: set SUPABASE_DB_URL (or DATABASE_URL) to enable DB migrations.");
      return;
    }
    await migrate();
  }
}
