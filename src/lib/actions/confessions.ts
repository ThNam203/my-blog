"use server";

import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { CONFESSION_BODY_MAX_LENGTH } from "@/lib/constants";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Confession } from "@/lib/supabase/types";

const MIN_LEN = 1;
const MAX_LEN = CONFESSION_BODY_MAX_LENGTH;

function dictForLocale(locale: string) {
    const loc: Locale = isValidLocale(locale) ? locale : "en";
    return getDictionary(loc);
}

export async function getConfessions(): Promise<Confession[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("confessions")
        .select("*")
        .order("created_at", { ascending: false });

    if (error || !data) {
        return [];
    }
    return data;
}

export async function submitConfession(
    body: string,
    locale: string,
    honeypot: string,
): Promise<{ error?: string }> {
    if (honeypot.trim()) {
        return {};
    }

    const loc: Locale = isValidLocale(locale) ? locale : "en";
    const dictionary = dictForLocale(loc);
    const trimmed = body.trim();

    if (trimmed.length < MIN_LEN || trimmed.length > MAX_LEN) {
        return {
            error: dictionary.errors.confessionBodyLength
                .replace("{min}", String(MIN_LEN))
                .replace("{max}", String(MAX_LEN)),
        };
    }

    const admin = createAdminClient();
    const { error } = await admin.from("confessions").insert({
        body: trimmed,
    });

    if (error) return { error: error.message };

    for (const l of locales) {
        revalidatePath(`/${l}/confessions`);
    }
    return {};
}
