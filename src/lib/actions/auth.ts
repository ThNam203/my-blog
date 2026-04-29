"use server";

import { createClient } from "@/lib/supabase/server";

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

export async function signIn(
    email: string,
    password: string,
): Promise<{ error?: string }> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
}

export async function signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
}
