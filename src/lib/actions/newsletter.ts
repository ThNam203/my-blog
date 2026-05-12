"use server";

import { z } from "zod";
import { getDictionaryForLocale } from "@/i18n/dictionaries";

const emailSchema = z.string().trim().email();

type Result = { ok: true } | { ok: false; error: string };

async function logResendError(action: string, response: Response) {
    const text = await response.text();
    console.error(`[newsletter] resend ${action} error`, response.status, text);
}

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
    const segmentId = process.env.RESEND_SEGMENT_ID;
    if (!apiKey || !segmentId) {
        throw new Error(
            "RESEND_API_KEY and RESEND_SEGMENT_ID must be set to use the newsletter form",
        );
    }

    const headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
    };

    try {
        const createResponse = await fetch("https://api.resend.com/contacts", {
            method: "POST",
            headers,
            body: JSON.stringify({
                email,
                unsubscribed: false,
                segments: [{ id: segmentId }],
            }),
        });

        if (createResponse.ok) {
            return { ok: true };
        }

        if (createResponse.status !== 409) {
            await logResendError("create contact", createResponse);
            return { ok: false, error: dictionary.ui.newsletterErrorGeneric };
        }

        const addToSegmentResponse = await fetch(
            `https://api.resend.com/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
            {
                method: "POST",
                headers,
            },
        );

        if (!addToSegmentResponse.ok && addToSegmentResponse.status !== 409) {
            await logResendError("add contact to segment", addToSegmentResponse);
            return { ok: false, error: dictionary.ui.newsletterErrorGeneric };
        }

        return { ok: true };
    } catch (error) {
        console.error("[newsletter] network error", error);
        return { ok: false, error: dictionary.ui.newsletterErrorGeneric };
    }
}
