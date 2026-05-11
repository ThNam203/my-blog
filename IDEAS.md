# Feature ideas

A running list of features to consider, grouped by area and ordered roughly by
impact-vs-effort for a personal blog.

## Search

- **Accent-insensitive matching** for Vietnamese. Normalize both query and
  haystack with `String.normalize("NFD")` then strip combining marks before the
  `includes` check so `sai gon` matches `sài gòn`. Lives in
  `src/lib/search-posts.ts`.
- **Keyboard shortcuts** to open the dialog: `Cmd/Ctrl+K` anywhere, and `/`
  when no input is focused.
- **Recent searches** persisted in `localStorage`. Show them when the input is
  empty instead of the current "type to search" copy.
- **Match highlighting** in result rows. Wrap matched substrings in `<mark>`
  inside the title / excerpt / category strings.

## Reading experience on the post page

- **Reading time** estimate from a word-count heuristic, shown in the post
  header.
- **Scroll progress bar** pinned at the top of `[locale]/posts/[slug]`.
- **Table of contents** generated from `h2` / `h3` headings, sticky on
  desktop.
- **Code syntax highlighting** via `rehype-pretty-code` / `shiki` for when
  posts contain code blocks.
- **Image lightbox** / click-to-zoom for inline images.
- **Anchor links** on headings (hover reveals `#`).

## Discovery & SEO

- **Related posts** at the bottom of each article, picked by shared categories
  with a recency fallback.
- **RSS feed** at `/[locale]/rss.xml` so people can follow without an account.
- **`sitemap.xml`** and **`robots.txt`** route handlers (Next.js has built-in
  conventions).
- **Per-post OG image generator** with `next/og` (title + date over a template)
  instead of reusing the cover image.

## Authoring DX

- **Drafts**: `draft: true` in front matter, filtered out in production.
- **Front-matter validation** with a small schema (e.g. zod) inside
  `src/lib/api.ts` so missing or mistyped fields fail loudly at build time.
- **`scripts/new-post.ts`** that scaffolds a markdown file in both locales with
  today's date and a slug.

## Engagement

- **Comment editing** + **markdown support** + optimistic UI.
- **Email-on-new-comments / confessions** via a Supabase function or webhook.
- **Newsletter subscribe** (Buttondown / Resend audience) wired into the
  footer.

## Suggested first three

If picking only three to ship next:

1. Accent-insensitive search + `Cmd-K` + recent searches.
2. Reading time + table of contents.
3. RSS + sitemap.

Each is roughly one self-contained PR.
