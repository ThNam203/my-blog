import { NextResponse } from "next/server";
import { WEB_DEFAULT_URL } from "@/lib/constants";

type CommentRow = {
    id: string;
    post_slug: string;
    user_id: string;
    parent_id: string | null;
    body: string;
    created_at: string;
};

type SupabaseWebhookPayload = {
    type?: "INSERT" | "UPDATE" | "DELETE";
    table?: string;
    record?: CommentRow;
};

const SITE_URL = WEB_DEFAULT_URL.replace(/\/$/, "");

function unauthorized() {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
    const secret = process.env.COMMENT_WEBHOOK_SECRET;
    if (!secret) {
        return NextResponse.json({ error: "webhook secret not configured" }, { status: 500 });
    }

    const provided =
        request.headers.get("x-webhook-secret") ??
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (provided !== secret) {
        return unauthorized();
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.COMMENT_NOTIFY_TO ?? process.env.ADMIN_EMAIL;
    const from = process.env.COMMENT_NOTIFY_FROM;

    if (!apiKey || !to || !from) {
        return NextResponse.json(
            { error: "RESEND_API_KEY, COMMENT_NOTIFY_FROM, and COMMENT_NOTIFY_TO (or ADMIN_EMAIL) must be set" },
            { status: 500 },
        );
    }

    let payload: SupabaseWebhookPayload;
    try {
        payload = (await request.json()) as SupabaseWebhookPayload;
    } catch {
        return NextResponse.json({ error: "bad payload" }, { status: 400 });
    }

    if (payload.type !== "INSERT" || payload.table !== "comments" || !payload.record) {
        return NextResponse.json({ ignored: true });
    }

    const { post_slug, body, parent_id } = payload.record;
    const subject = parent_id
        ? `New reply on ${post_slug}`
        : `New comment on ${post_slug}`;
    const postUrl = `${SITE_URL}/vi/posts/${post_slug}`;

    const html = `
        <p><strong>${subject}</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(body)}</pre>
        <p><a href="${postUrl}">${postUrl}</a></p>
    `;

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ from, to: [to], subject, html }),
        });
        if (!response.ok) {
            const text = await response.text();
             
            console.error("[comment-notify] resend error", response.status, text);
            return NextResponse.json({ error: "resend failed" }, { status: 502 });
        }
    } catch (error) {
         
        console.error("[comment-notify] network error", error);
        return NextResponse.json({ error: "network" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
