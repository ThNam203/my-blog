"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { MyReactions, ReactionCounts, ReactionEmoji } from "@/lib/supabase/types";

const VALID_EMOJIS: ReactionEmoji[] = ["heart", "fire", "cry", "laugh"];

const EMPTY_COUNTS: ReactionCounts = { heart: 0, fire: 0, cry: 0, laugh: 0 };
const EMPTY_MINE: MyReactions = { heart: false, fire: false, cry: false, laugh: false };

export async function getReactions(
    postSlug: string,
    sessionId: string,
): Promise<{ counts: ReactionCounts; mine: MyReactions }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("post_reactions")
        .select("emoji, session_id")
        .eq("post_slug", postSlug);

    if (error || !data) return { counts: { ...EMPTY_COUNTS }, mine: { ...EMPTY_MINE } };

    const counts = { ...EMPTY_COUNTS };
    const mine = { ...EMPTY_MINE };

    for (const row of data) {
        const emoji = row.emoji as ReactionEmoji;
        if (!VALID_EMOJIS.includes(emoji)) continue;
        counts[emoji]++;
        if (row.session_id === sessionId) mine[emoji] = true;
    }

    return { counts, mine };
}

export async function toggleReaction(
    postSlug: string,
    emoji: ReactionEmoji,
    sessionId: string,
): Promise<{ counts: ReactionCounts; mine: MyReactions } | { error: string }> {
    if (!VALID_EMOJIS.includes(emoji)) return { error: "Invalid emoji" };
    if (!sessionId || sessionId.length > 64) return { error: "Invalid session" };

    const admin = createAdminClient();

    const { data: existing } = await admin
        .from("post_reactions")
        .select("id")
        .eq("post_slug", postSlug)
        .eq("emoji", emoji)
        .eq("session_id", sessionId)
        .maybeSingle();

    if (existing) {
        await admin.from("post_reactions").delete().eq("id", existing.id);
    } else {
        await admin
            .from("post_reactions")
            .insert({ post_slug: postSlug, emoji, session_id: sessionId });
    }

    return getReactions(postSlug, sessionId);
}
