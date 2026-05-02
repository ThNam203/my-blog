"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { WEB_DEFAULT_URL } from "@/lib/constants";

export async function signUp(
    displayName: string,
    email: string,
    password: string,
): Promise<{ error?: string }> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
    });
    if (error) return { error: error.message };
    return {};
}

export async function signIn(email: string, password: string): Promise<{ error?: string }> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
}

export async function signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
}

export async function signInWithGoogle(): Promise<{ error?: string; url?: string }> {
    const supabase = await createClient();
    const headerStore = await headers();
    const origin = headerStore.get("origin") ?? WEB_DEFAULT_URL;
    const redirectTo = `${origin}/auth/callback?next=/`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo,
        },
    });

    if (error) return { error: error.message };
    return { url: data.url };
}
