import { Post } from "@/interfaces/post";
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");
const localizedPostsDirectory = (locale: Locale) => join(postsDirectory, locale);

function normalizeCategories(value: unknown): string[] {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value
            .filter((category): category is string => typeof category === "string")
            .map((category) => category.trim())
            .filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
        return [value.trim()];
    }

    return [];
}

function resolvePostsDirectory(locale: Locale) {
    const localeDir = localizedPostsDirectory(locale);
    if (fs.existsSync(localeDir)) {
        return localeDir;
    }
    return postsDirectory;
}

export function getPostSlugs(locale: string = defaultLocale) {
    if (!isValidLocale(locale)) {
        return [];
    }

    const targetDirectory = resolvePostsDirectory(locale);
    return fs.readdirSync(targetDirectory).filter((fileName) => fileName.endsWith(".md"));
}

export function getPostBySlug(slug: string, locale: string = defaultLocale) {
    if (!isValidLocale(locale)) {
        return null;
    }

    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = join(resolvePostsDirectory(locale), `${realSlug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        ...data,
        categories: normalizeCategories(data.categories),
        slug: realSlug,
        content,
    } as Post;
}

export function getAllPosts(locale: string = defaultLocale): Post[] {
    const slugs = getPostSlugs(locale);
    const posts = slugs
        .map((slug) => getPostBySlug(slug, locale))
        .filter((post): post is Post => post !== null)
        // sort posts by date in descending order
        .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
}

export function getAllCategories(locale: string = defaultLocale): string[] {
    const posts = getAllPosts(locale);
    const seen = new Set<string>();
    for (const post of posts) {
        for (const cat of post.categories) {
            seen.add(cat);
        }
    }
    return Array.from(seen).sort();
}

export function getPostsByCategory(category: string, locale: string = defaultLocale): Post[] {
    const normalized = category.toLowerCase();
    return getAllPosts(locale).filter((post) =>
        post.categories.some((c) => c.toLowerCase() === normalized),
    );
}
