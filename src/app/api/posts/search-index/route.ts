import { NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "@/i18n/config";
import { getAllPosts } from "@/lib/api";
import { toSlimPost, type SlimPost } from "@/lib/search-posts";

export type SearchIndexResponse = {
    locale: string;
    posts: SlimPost[];
};

export function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const requestedLocale = searchParams.get("locale") ?? defaultLocale;
    const locale = isValidLocale(requestedLocale) ? requestedLocale : defaultLocale;

    const posts = getAllPosts(locale).map(toSlimPost);

    const body: SearchIndexResponse = { locale, posts };
    return NextResponse.json(body);
}
