"use server";

import { getDictionaryForLocale } from "@/i18n/dictionaries";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Comment } from "@/lib/supabase/types";

export async function getComments(postSlug: string): Promise<Comment[]> {
    const supabase = await createClient();
    const { data: rows, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_slug", postSlug)
        .order("created_at", { ascending: true });

    if (error) return [];
    if (!rows?.length) return [];

    const userIds = [...new Set(rows.map((r) => r.user_id))];
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", userIds);

    const displayNameByUserId = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

    return rows.map((row) => ({
        ...row,
        profiles: (() => {
            const name = displayNameByUserId.get(row.user_id);
            return name != null ? { display_name: name } : null;
        })(),
    }));
}

export async function addComment(
    postSlug: string,
    body: string,
    parentId: string | null,
    locale: string,
): Promise<{ error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: getDictionaryForLocale(locale).errors.notAuthenticated };

    // If replying to a reply, find the top-level parent to keep threading at 2 levels
    let resolvedParentId = parentId;
    if (parentId) {
        const { data: parent } = await supabase
            .from("comments")
            .select("parent_id")
            .eq("id", parentId)
            .single();
        if (parent?.parent_id) {
            resolvedParentId = parent.parent_id;
        }
    }

    const { error } = await supabase.from("comments").insert({
        post_slug: postSlug,
        user_id: user.id,
        parent_id: resolvedParentId,
        body: body.trim(),
    });

    if (error) return { error: error.message };

    revalidatePath(`/${locale}/posts/${postSlug}`);
    return {};
}

export async function deleteComment(
    commentId: string,
    postSlug: string,
    locale: string,
): Promise<{ error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: getDictionaryForLocale(locale).errors.notAuthenticated };

    const isAdmin = !!process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL;

    if (isAdmin) {
        // Admin bypasses RLS using the server-only secret key.
        const admin = createAdminClient();
        const { error } = await admin.from("comments").delete().eq("id", commentId);
        if (error) return { error: error.message };
    } else {
        // Regular users can only delete their own comments (enforced by RLS too)
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId)
            .eq("user_id", user.id);
        if (error) return { error: error.message };
    }

    revalidatePath(`/${locale}/posts/${postSlug}`);
    return {};
}
