"use server";

import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Comment } from "@/lib/supabase/types";

function dictForLocale(locale: string) {
    const loc: Locale = isValidLocale(locale) ? locale : "en";
    return getDictionary(loc);
}

export async function getComments(postSlug: string): Promise<Comment[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("comments")
        .select("*, profiles(display_name)")
        .eq("post_slug", postSlug)
        .order("created_at", { ascending: true });

    if (error) return [];
    return (data ?? []) as Comment[];
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

    if (!user) return { error: dictForLocale(locale).errors.notAuthenticated };

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

    if (!user) return { error: dictForLocale(locale).errors.notAuthenticated };

    const isAdmin = user.email === process.env.ADMIN_EMAIL;

    if (isAdmin) {
        // Admin bypasses RLS using service role client
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
