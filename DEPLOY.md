# Pre-deploy checklist

## Supabase

Run in SQL editor:

```sql
-- supabase/migrations/0001_comment_editing.sql
```

Adds `comments.updated_at` + UPDATE RLS policy.

Create two Database Webhooks (Dashboard → Database → Webhooks):

| Source              | Event  | Target URL                               | Header                          |
| ------------------- | ------ | ---------------------------------------- | ------------------------------- |
| `public.comments`   | INSERT | `${SITE_URL}/api/comments/notify`        | `x-webhook-secret: <secret>`    |
| `public.confessions`| INSERT | `${SITE_URL}/api/confessions/notify`     | `x-webhook-secret: <secret>`    |

## Resend

1. Create account.
2. Verify sender domain (DNS records). Until verified, `from` rejects.
3. Generate API key → `RESEND_API_KEY`.
4. Create Audience for newsletter → copy id → `RESEND_AUDIENCE_ID`.

## Env vars (Vercel project settings)

```
# Already in use
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ADMIN_EMAIL=you@example.com

# New — required
RESEND_API_KEY=re_xxx
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
COMMENT_WEBHOOK_SECRET=<long random string, matches webhook header>
COMMENT_NOTIFY_FROM=blog@your-verified-domain.com

# New — optional (fall back to ADMIN_EMAIL)
COMMENT_NOTIFY_TO=
CONFESSION_NOTIFY_TO=
```

Generate `COMMENT_WEBHOOK_SECRET`:

```
openssl rand -hex 32
```

## Verify post-deploy

- `GET /sitemap.xml` returns XML with all posts.
- `GET /robots.txt` returns rules + sitemap line.
- `GET /vi/rss.xml` + `/en/rss.xml` return RSS.
- `GET /vi/posts/<slug>/opengraph-image` returns 1200×630 PNG.
- Open a post → `Cmd-K` opens search → type accented query (`sai gon`) → results show with highlight.
- Comment on a post while signed in → optimistic insert, `(edited)` pill after edit, email arrives at `COMMENT_NOTIFY_TO`.
- Newsletter form submits → contact appears in Resend Audience.

## Not deployed by this commit

- Code syntax highlighting + image lightbox work without config.
- `npm run new-post -- "Title" -c category` runs locally only.

## Don'ts

- Don't commit any of the `RESEND_*` / `COMMENT_WEBHOOK_SECRET` to git.
- Don't deploy without sender domain verified — Resend returns 403 and comment webhooks 502.
- Don't point webhooks at a preview URL; they fire from prod data into whatever you target.
