import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/api";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, locales } from "@/i18n/config";
import { WEB_DEFAULT_URL, WEB_DEFAULT_AUTHOR } from "@/lib/constants";

const SITE_URL = WEB_DEFAULT_URL.replace(/\/$/, "");

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

type Params = {
    params: Promise<{ locale: string }>;
};

export async function GET(_request: Request, props: Params) {
    const { locale } = await props.params;
    if (!isValidLocale(locale)) {
        return new NextResponse("Not Found", { status: 404 });
    }

    const dictionary = getDictionary(locale);
    const posts = getAllPosts(locale);
    const feedUrl = `${SITE_URL}/${locale}/rss.xml`;
    const siteUrl = `${SITE_URL}/${locale}`;
    const lastBuildDate = new Date().toUTCString();

    const items = posts
        .map((post) => {
            const link = `${SITE_URL}/${locale}/posts/${post.slug}`;
            const pubDate = post.date ? new Date(post.date).toUTCString() : lastBuildDate;
            const categories = post.categories
                .map((category) => `<category>${escapeXml(category)}</category>`)
                .join("");
            const description = post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : "";
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(WEB_DEFAULT_AUTHOR)}</author>
      ${description}
      ${categories}
    </item>`;
        })
        .join("\n");

    const alternates = locales
        .filter((other) => other !== locale)
        .map(
            (other) =>
                `    <atom:link rel="alternate" hreflang="${other}" href="${SITE_URL}/${other}/rss.xml" />`,
        )
        .join("\n");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(dictionary.metadata.title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(dictionary.metadata.description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link rel="self" href="${escapeXml(feedUrl)}" type="application/rss+xml" />
${alternates}
${items}
  </channel>
</rss>`;

    return new NextResponse(body, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}
