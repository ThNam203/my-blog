import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "./types";

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
        requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options),
                        );
                    } catch {
                        return;
                    }
                },
            },
        },
    );
}

export function createAdminClient() {
    return createSupabaseClient<Database>(
        requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
        requireEnv("SUPABASE_SECRET_KEY"),
        { auth: { autoRefreshToken: false, persistSession: false } },
    );
}
