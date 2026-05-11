import { NextResponse } from "next/server";
import { WEB_DEFAULT_URL } from "@/lib/constants";
import { notifyWebhookSecret, resendNotifyFrom } from "@/lib/notify-env";

type ConfessionRow = {
    id: string;
    body: string;
    created_at: string;
};

type SupabaseWebhookPayload = {
    type?: "INSERT" | "UPDATE" | "DELETE";
    table?: string;
    record?: ConfessionRow;
};

const SITE_URL = WEB_DEFAULT_URL.replace(/\/$/, "");

export async function POST(request: Request) {
    const secret = notifyWebhookSecret();
    if (!secret) {
        return NextResponse.json({ error: "webhook secret not configured" }, { status: 500 });
    }
    const provided =
        request.headers.get("x-webhook-secret") ??
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (provided !== secret) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.ADMIN_EMAIL;
    const from = resendNotifyFrom();

    if (!apiKey || !to || !from) {
        return NextResponse.json(
            {
                error: "RESEND_API_KEY, RESEND_NOTIFY_FROM, and ADMIN_EMAIL must be set",
            },
            { status: 500 },
        );
    }

    let payload: SupabaseWebhookPayload;
    try {
        payload = (await request.json()) as SupabaseWebhookPayload;
    } catch {
        return NextResponse.json({ error: "bad payload" }, { status: 400 });
    }

    if (payload.type !== "INSERT" || payload.table !== "confessions" || !payload.record) {
        return NextResponse.json({ ignored: true });
    }

    const subject = "New anonymous confession";
    const body = payload.record.body;
    const link = `${SITE_URL}/vi/confessions`;

    const html = `
        <p><strong>${subject}</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit;">${body
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</pre>
        <p><a href="${link}">${link}</a></p>
    `;

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to: [to], subject, html }),
    });

    if (!response.ok) {
        return NextResponse.json({ error: "resend failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
}
