"use server";

import { revalidatePath } from "next/cache";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";

const MIN_LEN = 2;
const MAX_LEN = 50;

function dictForLocale(locale: string) {
    const loc: Locale = isValidLocale(locale) ? locale : "en";
    return getDictionary(loc);
}

export async function updateDisplayName(
    displayName: string,
    locale: string,
): Promise<{ error?: string }> {
    const d = dictForLocale(locale);
    const trimmed = displayName.trim();
    if (trimmed.length < MIN_LEN || trimmed.length > MAX_LEN) {
        return {
            error: d.errors.displayNameLength
                .replace("{min}", String(MIN_LEN))
                .replace("{max}", String(MAX_LEN)),
        };
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: d.errors.notAuthenticated };

    const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, display_name: trimmed }, { onConflict: "id" });

    if (upsertError) return { error: upsertError.message };

    await supabase.auth.updateUser({
        data: { display_name: trimmed },
    });

    revalidatePath(`/${locale}/profile`);
    revalidatePath(`/${locale}`, "layout");
    return {};
}
