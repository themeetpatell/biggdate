import type { SessionMemory } from "@/lib/types";
import {
  getSessionMemoryDb,
  upsertSessionMemory,
} from "@/lib/repo";
import { sql } from "@/lib/db";

/**
 * The canonical session_key under which all unified Maahi memory lives.
 * Historical rows lived under "companion" or per-session IDs; new code
 * always reads/writes here. A one-off backfill happens on first read.
 */
export const MAAHI_MEMORY_KEY = "maahi";

/**
 * Read Maahi's long-term memory for a user. If a legacy "companion" row
 * exists but no canonical row does, copy it over once so we converge to
 * a single source of truth without a full migration.
 */
export async function getMaahiMemory(userId: string): Promise<SessionMemory | null> {
  const canonical = await getSessionMemoryDb(userId, MAAHI_MEMORY_KEY);
  if (canonical) return canonical;

  const legacy = await getSessionMemoryDb(userId, "companion");
  if (legacy) {
    // Lazy backfill — write the legacy data to the canonical key, return it.
    await upsertSessionMemory(userId, MAAHI_MEMORY_KEY, legacy);
    return getSessionMemoryDb(userId, MAAHI_MEMORY_KEY);
  }

  return null;
}

/**
 * Write a memory patch. Uses an atomic increment for conversationCount
 * to avoid the read-then-write race that existed in the previous code.
 */
export async function writeMaahiMemoryPatch(
  userId: string,
  patch: Partial<SessionMemory>,
  options: { incrementConversation?: boolean } = {},
): Promise<void> {
  const finalPatch: Partial<SessionMemory> = { ...patch };

  if (options.incrementConversation) {
    // Atomic increment via SQL. We do it in a separate UPDATE to avoid
    // the read-modify-write race in the merge path.
    await sql`
      INSERT INTO session_memory (id, user_id, session_key, conversation_count)
      VALUES (
        ${"mem_seed_" + userId},
        ${userId},
        ${MAAHI_MEMORY_KEY},
        1
      )
      ON CONFLICT (user_id, session_key) DO UPDATE SET
        conversation_count = session_memory.conversation_count + 1,
        updated_at = NOW()
    `;
    // Don't double-count: drop conversationCount from the patch.
    delete finalPatch.conversationCount;
  }

  await upsertSessionMemory(userId, MAAHI_MEMORY_KEY, finalPatch);
}

/**
 * Whether the pattern engine should refresh on the next memory write.
 * Triggered every N conversations (default 12) — the value matches the
 * spirit of the prompt instruction "Every 10-20 conversations".
 */
export function shouldRefreshPatternEngine(memory: SessionMemory | null, every = 12): boolean {
  if (!memory) return false;
  if (!memory.conversationCount) return false;
  return memory.conversationCount % every === 0;
}
