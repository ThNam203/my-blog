"use server";

import { z } from "zod";
import { getDictionaryForLocale } from "@/i18n/dictionaries";

const emailSchema = z.string().trim().email();

type Result = { ok: true } | { ok: false; error: string };

export async function subscribeToNewsletter(
    rawEmail: string,
    locale: string,
): Promise<Result> {
    const dictionary = getDictionaryForLocale(locale);
    const parsed = emailSchema.safeParse(rawEmail);
    if (!parsed.success) {
        return { ok: false, error: dictionary.ui.newsletterErrorInvalidEmail };
    }
    const email = parsed.data;

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!apiKey || !audienceId) {
        throw new Error(
            "RESEND_API_KEY and RESEND_AUDIENCE_ID must be set to use the newsletter form",
        );
    }

    try {
        const response = await fetch(
            `https://api.resend.com/audiences/${audienceId}/contacts`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, unsubscribed: false }),
            },
        );

        if (!response.ok && response.status !== 409) {
            const text = await response.text();
             
            console.error("[newsletter] resend error", response.status, text);
            return { ok: false, error: dictionary.ui.newsletterErrorGeneric };
        }
        return { ok: true };
    } catch (error) {
         
        console.error("[newsletter] network error", error);
        return { ok: false, error: dictionary.ui.newsletterErrorGeneric };
    }
}
