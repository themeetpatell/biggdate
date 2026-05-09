import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { upsertProfile, getProfileByUserId, getMatchForUser } from "@/lib/repo";
import { sql } from "@/lib/db";
import { randomUUID } from "node:crypto";

export async function POST(req: Request) {
  try {
    const session = await getSessionFromCookies();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.userId;

    const { status, partnerMatchId } = await req.json();

    if (!['single', 'dating', 'seeing_someone', 'exclusive', 'engaged', 'married'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const profile = await getProfileByUserId(userId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    let partnerId = profile.partnerId || null;

    // If declaring a relationship with a specific match from BiggDate
    if (partnerMatchId && status !== 'single') {
      const match = await getMatchForUser(userId, partnerMatchId);
      if (match && match.matchedUserId) {
        partnerId = match.matchedUserId;
        
        // Check if couple record already exists
        const existingCouple = await sql`
          SELECT id FROM couples 
          WHERE (user_a_id = ${userId} AND user_b_id = ${partnerId})
             OR (user_a_id = ${partnerId} AND user_b_id = ${userId})
          LIMIT 1
        `;

        if (existingCouple.length === 0) {
          // Create couple record
          const id = `couple_${randomUUID()}`;
          // Make sure user_a_id is always the smaller UUID for consistency (optional but good practice)
          const [userA, userB] = [userId, partnerId].sort();
          
          await sql`
            INSERT INTO couples (id, user_a_id, user_b_id, status)
            VALUES (${id}, ${userA}, ${userB}, ${status === 'exclusive' || status === 'engaged' || status === 'married' ? status : 'seeing_each_other'})
          `;
        } else {
          // Update existing
          await sql`
            UPDATE couples 
            SET status = ${status === 'exclusive' || status === 'engaged' || status === 'married' ? status : 'seeing_each_other'},
                updated_at = NOW()
            WHERE id = ${existingCouple[0].id}
          `;
        }
        
        // Also update the partner's profile to reflect this (in a real app this might require a confirmation step from the partner)
        // But for "Couple mode" activation, we'll tentatively set it.
        await upsertProfile(partnerId, { 
          relationshipStatus: status,
          partnerId: userId
        });
      }
    }

    // If changing back to single, remove partner_id
    if (status === 'single') {
      partnerId = null;
    }

    await upsertProfile(userId, { 
      relationshipStatus: status,
      partnerId: partnerId
    });

    return NextResponse.json({ success: true, status, partnerId });
  } catch (error: any) {
    console.error("Commitment API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
