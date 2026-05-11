"use server";

import { getDictionaryForLocale } from "@/i18n/dictionaries";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Comment } from "@/lib/supabase/types";

export async function getComments(postSlug: string): Promise<Comment[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("comments")
        .select("*, profiles(display_name)")
        .eq("post_slug", postSlug)
        .order("created_at", { ascending: true });

    if (error || !data?.length) return [];
    return data as unknown as Comment[];
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

export async function editComment(
    commentId: string,
    body: string,
    postSlug: string,
    locale: string,
): Promise<{ error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: getDictionaryForLocale(locale).errors.notAuthenticated };

    const trimmed = body.trim();
    if (!trimmed) return { error: "empty" };

    const isAdmin = !!process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL;
    const client = isAdmin ? createAdminClient() : supabase;
    const query = client
        .from("comments")
        .update({ body: trimmed, updated_at: new Date().toISOString() })
        .eq("id", commentId);
    const { error } = isAdmin ? await query : await query.eq("user_id", user.id);

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
