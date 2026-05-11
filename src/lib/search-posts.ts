import { type Post, type PostAddress } from "@/interfaces/post";

export type SlimPost = {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    categories: string[];
    addresses: PostAddress[];
};

export function toSlimPost(post: Post): SlimPost {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        categories: post.categories,
        addresses: post.addresses ?? [],
    };
}

const COMBINING_MARKS = /[̀-ͯ]/g;

export function stripDiacritics(value: string): string {
    return value
        .normalize("NFD")
        .replace(COMBINING_MARKS, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

export function foldForSearch(value: string): string {
    return stripDiacritics(value).toLowerCase();
}

function addressToHaystackParts(address: PostAddress): string[] {
    const parts = [address.name, address.address];
    if (address.link) parts.push(address.link);
    if (address.addressLink) parts.push(address.addressLink);
    return parts;
}

export function buildHaystack(post: SlimPost): string {
    const parts: string[] = [post.title, post.excerpt, post.date, ...post.categories];
    for (const address of post.addresses) {
        parts.push(...addressToHaystackParts(address));
    }
    return foldForSearch(parts.filter(Boolean).join("  "));
}

export function normalizeQuery(query: string): string {
    return foldForSearch(query.trim());
}

export function matchesQuery(haystack: string, normalizedQuery: string): boolean {
    if (!normalizedQuery) return false;
    return haystack.includes(normalizedQuery);
}

export function filterSlimPostsByQuery(posts: SlimPost[], query: string): SlimPost[] {
    const normalized = normalizeQuery(query);
    if (!normalized) return [];
    return posts.filter((post) => matchesQuery(buildHaystack(post), normalized));
}

export type MatchRange = { start: number; end: number };

export function findAccentInsensitiveMatch(
    original: string,
    query: string,
): MatchRange | null {
    const foldedQuery = foldForSearch(query);
    if (!foldedQuery) return null;
    if (!original) return null;

    const length = original.length;
    for (let start = 0; start < length; start++) {
        let i = start;
        let j = 0;
        while (i < length && j < foldedQuery.length) {
            const ch = foldForSearch(original[i]);
            if (ch.length === 0) {
                i++;
                continue;
            }
            if (ch.length === 1) {
                if (ch === foldedQuery[j]) {
                    i++;
                    j++;
                } else {
                    break;
                }
            } else {
                if (foldedQuery.startsWith(ch, j)) {
                    i++;
                    j += ch.length;
                } else {
                    break;
                }
            }
        }
        if (j === foldedQuery.length) {
            return { start, end: i };
        }
    }
    return null;
}
