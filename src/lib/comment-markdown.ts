// Safe markdown subset renderer for comments: bold, italic, inline code,
// fenced code blocks, links, and newlines. Everything else is escaped.

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function sanitizeUrl(url: string): string | null {
    const trimmed = url.trim();
    if (/^(https?:|mailto:)/i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("/")) return trimmed;
    return null;
}

// Private-use code points cannot legally appear in HTML markup. Stripping any
// from the input then using them as placeholder delimiters guarantees no
// collision with the original body or with escapeHtml output.
const PH_OPEN = String.fromCharCode(0xe000);
const PH_CLOSE = String.fromCharCode(0xe001);
const STRIP_PH = new RegExp(`[${PH_OPEN}${PH_CLOSE}]`, "g");
const PH_PATTERN = new RegExp(`${PH_OPEN}(\\d+)${PH_CLOSE}`, "g");

export function renderCommentMarkdown(body: string): string {
    const placeholders: string[] = [];
    const stash = (html: string): string => {
        const token = `${PH_OPEN}${placeholders.length}${PH_CLOSE}`;
        placeholders.push(html);
        return token;
    };

    let working = body.replace(STRIP_PH, "");

    const FENCED = /```([a-z0-9_+-]*)?\n([\s\S]*?)```/gi;
    working = working.replace(FENCED, (_match, _lang, code: string) =>
        stash(`<pre><code>${escapeHtml(code.replace(/\n+$/, ""))}</code></pre>`),
    );

    const INLINE_CODE = /`([^`\n]+)`/g;
    working = working.replace(INLINE_CODE, (_match, code: string) =>
        stash(`<code>${escapeHtml(code)}</code>`),
    );

    const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    working = working.replace(LINK, (_match, text: string, href: string) => {
        const safe = sanitizeUrl(href);
        if (!safe) return escapeHtml(`[${text}](${href})`);
        const attrs = 'target="_blank" rel="noopener noreferrer nofollow"';
        return stash(`<a href="${escapeHtml(safe)}" ${attrs}>${escapeHtml(text)}</a>`);
    });

    working = escapeHtml(working);

    working = working.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    working = working.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");

    working = working.replace(/\n/g, "<br />");

    working = working.replace(PH_PATTERN, (_match, idx: string) => placeholders[Number(idx)] ?? "");

    return working;
}
