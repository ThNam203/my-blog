import type { MetadataRoute } from "next";
import { getAllCategories, getAllPosts } from "@/lib/api";
import { locales } from "@/i18n/config";
import { WEB_DEFAULT_URL } from "@/lib/constants";

const SITE_URL = WEB_DEFAULT_URL.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const entries: MetadataRoute.Sitemap = [];

    for (const locale of locales) {
        entries.push({
            url: `${SITE_URL}/${locale}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        });
        entries.push({
            url: `${SITE_URL}/${locale}/confessions`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.6,
        });

        for (const post of getAllPosts(locale)) {
            entries.push({
                url: `${SITE_URL}/${locale}/posts/${post.slug}`,
                lastModified: post.date ? new Date(post.date) : now,
                changeFrequency: "monthly",
                priority: 0.8,
            });
        }

        for (const category of getAllCategories(locale)) {
            entries.push({
                url: `${SITE_URL}/${locale}/categories/${encodeURIComponent(category)}`,
                lastModified: now,
                changeFrequency: "weekly",
                priority: 0.5,
            });
        }
    }

    return entries;
}
