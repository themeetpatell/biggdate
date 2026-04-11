import { Pool } from "pg";

type SqlRow = Record<string, unknown>;

let pool: Pool | undefined;

function getDatabaseUrl(): string | undefined {
  return process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
}

function shouldUseSsl(databaseUrl: string) {
  try {
    const { hostname } = new URL(databaseUrl);
    return hostname !== "localhost" && hostname !== "127.0.0.1";
  } catch {
    return true;
  }
}

function getPool() {
  if (!pool) {
    const databaseUrl = getDatabaseUrl();
    if (!databaseUrl) {
      throw new Error("SUPABASE_DB_URL or DATABASE_URL environment variable is required");
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: shouldUseSsl(databaseUrl) ? { rejectUnauthorized: true } : undefined,
      max: process.env.NODE_ENV === "production" ? 10 : 5,
      allowExitOnIdle: process.env.NODE_ENV !== "production",
    });
  }

  return pool;
}

function compileQuery(strings: TemplateStringsArray, values: unknown[]) {
  let text = "";

  for (let index = 0; index < strings.length; index += 1) {
    text += strings[index];
    if (index < values.length) {
      text += `$${index + 1}`;
    }
  }

  return { text, values };
}

export async function sql(strings: TemplateStringsArray, ...values: unknown[]) {
  const { text, values: params } = compileQuery(strings, values);
  const result = await getPool().query(text, params);
  return result.rows as SqlRow[];
}

export function hasDatabaseConfig() {
  return Boolean(getDatabaseUrl());
}

// Schema is managed by Supabase migrations in supabase/migrations/.
// Do not duplicate table definitions here.
