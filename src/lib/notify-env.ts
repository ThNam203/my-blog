/**
 * Shared env for Supabase Database Webhooks → /api/comments/notify and
 * /api/confessions/notify. Legacy names still work until you migrate .env.
 */
export function notifyWebhookSecret(): string | undefined {
    return process.env.NOTIFY_WEBHOOK_SECRET ?? process.env.COMMENT_WEBHOOK_SECRET;
}

/** Resend "from" for comment + confession notification emails. */
export function resendNotifyFrom(): string | undefined {
    return process.env.RESEND_NOTIFY_FROM ?? process.env.COMMENT_NOTIFY_FROM;
}
