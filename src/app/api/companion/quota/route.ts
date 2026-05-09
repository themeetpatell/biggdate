import { requireAuth } from "@/lib/require-auth";
import { requirePlan } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const gate = await requirePlan(auth.userId, "maahi_turn");
  
  return new Response(JSON.stringify(gate), {
    headers: { "Content-Type": "application/json" },
  });
}
