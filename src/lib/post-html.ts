import { codeToHtml, type BundledLanguage } from "shiki";
import { stripDiacritics } from "@/lib/search-posts";

export type Heading = {
    id: string;
    text: string;
    level: 2 | 3;
};

export type ProcessedPost = {
    html: string;
    headings: Heading[];
};

export function slugify(value: string): string {
    return stripDiacritics(value)
        .toLowerCase()
        .replace(/<[^>]+>/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function decodeEntities(value: string): string {
    return value
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
}

function stripTags(value: string): string {
    return value.replace(/<[^>]+>/g, "");
}

const SHIKI_SUPPORTED: ReadonlySet<string> = new Set([
    "ts", "tsx", "js", "jsx", "json", "html", "css", "scss", "md", "mdx", "yaml", "yml",
    "bash", "sh", "shell", "zsh", "python", "py", "go", "rust", "rs", "java", "kotlin",
    "swift", "ruby", "rb", "php", "c", "cpp", "csharp", "cs", "sql", "graphql",
    "dockerfile", "diff", "toml", "ini", "xml", "vue", "svelte",
]);

type CodeBlockMatch = {
    placeholder: string;
    code: string;
    lang: string | null;
};

function decodeCodeEntities(value: string): string {
    return value
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

async function highlightCodeBlocks(html: string): Promise<string> {
    const blocks: CodeBlockMatch[] = [];
    const pattern = /<pre><code(?:\s+class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g;
    let index = 0;
    const placeholderHtml = html.replace(pattern, (_match, lang, inner) => {
        const placeholder = `SHIKI_BLOCK_${index}`;
        blocks.push({
            placeholder,
            code: decodeCodeEntities(inner),
            lang: typeof lang === "string" ? lang.toLowerCase() : null,
        });
        index++;
        return placeholder;
    });

    if (blocks.length === 0) return html;

    const highlighted = await Promise.all(
        blocks.map((block) => {
            const lang = block.lang && SHIKI_SUPPORTED.has(block.lang)
                ? (block.lang as BundledLanguage)
                : ("text" as BundledLanguage);
            return codeToHtml(block.code, {
                lang,
                themes: { light: "github-light", dark: "github-dark" },
                defaultColor: false,
            });
        }),
    );

    let result = placeholderHtml;
    blocks.forEach((block, i) => {
        result = result.replace(block.placeholder, highlighted[i]);
    });
    return result;
}

export async function processPostHtmlAsync(html: string): Promise<ProcessedPost> {
    const highlighted = await highlightCodeBlocks(html);
    return processPostHtml(highlighted);
}

export function processPostHtml(html: string): ProcessedPost {
    const headings: Heading[] = [];
    const seen = new Map<string, number>();

    const processed = html.replace(
        /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
        (_match, tag: string, attrs: string, inner: string) => {
            const level = tag.toLowerCase() === "h2" ? 2 : 3;
            const text = decodeEntities(stripTags(inner)).trim();
            const base = slugify(text) || `section-${headings.length + 1}`;
            const count = seen.get(base) ?? 0;
            const id = count === 0 ? base : `${base}-${count}`;
            seen.set(base, count + 1);
            headings.push({ id, text, level: level as 2 | 3 });
            const anchorLabel = decodeEntities(stripTags(inner)).replace(/"/g, "&quot;").trim();
            return `<${tag}${attrs} id="${id}"><a class="post-heading-anchor" href="#${id}" aria-label="${anchorLabel}">#</a>${inner}</${tag}>`;
        },
    );

    return { html: processed, headings };
}

const WORDS_PER_MINUTE = 200;

export function countWords(markdown: string): number {
    const cleaned = markdown
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`]*`/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/[#>*_~-]+/g, " ");
    const matches = cleaned.trim().match(/\S+/g);
    return matches ? matches.length : 0;
}

export function estimateReadingMinutes(markdown: string): number {
    const words = countWords(markdown);
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
