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
    return parts.filter(Boolean).join(" \u0001 ").toLowerCase();
}

export function normalizeQuery(query: string): string {
    return query.trim().toLowerCase();
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
