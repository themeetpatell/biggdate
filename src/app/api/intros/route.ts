import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getIntrosForUser } from "@/lib/repo";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const intros = await getIntrosForUser(auth.userId);
  return NextResponse.json(
    intros.map((intro) => {
      const row = intro as Record<string, unknown>;
      const senderAnswered = Boolean(row.sender_answered ?? row.senderAnswered);
      const receiverAnswered = Boolean(row.receiver_answered ?? row.receiverAnswered);

      return {
        id: String(row.id ?? ""),
        matchId: String(row.match_id ?? row.matchId ?? ""),
        matchName: String(row.match_name ?? row.matchName ?? ""),
        matchedUserId: (row.matched_user_id ?? row.matchedUserId ?? null) as string | null,
        soulKnockQuestion: (row.soul_knock_question ?? row.soulKnockQuestion ?? null) as string | null,
        senderAnswered,
        receiverAnswered,
        createdAt: String(row.created_at ?? row.createdAt ?? ""),
        status: receiverAnswered ? "answered" : "pending",
      };
    }),
  );
}
