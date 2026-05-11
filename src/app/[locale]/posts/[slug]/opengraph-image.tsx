import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/api";
import { isValidLocale } from "@/i18n/config";
import { WEB_DEFAULT_AUTHOR } from "@/lib/constants";

export const runtime = "nodejs";
export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = {
    params: Promise<{ slug: string; locale: string }>;
};

export default async function OgImage(props: Params) {
    const { slug, locale } = await props.params;
    if (!isValidLocale(locale)) notFound();
    const post = getPostBySlug(slug, locale);
    if (!post) notFound();

    const title = post.title;
    const dateStr = new Date(post.date).toLocaleDateString(
        locale === "vi" ? "vi-VN" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
    );
    const categories = post.categories.slice(0, 3).join(" · ");

    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
                    padding: 72,
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)",
                    color: "#f8fafc",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                }}
            >
                <div style={{ display: "flex", fontSize: 28, opacity: 0.7 }}>
                    {WEB_DEFAULT_AUTHOR}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {categories && (
                        <div style={{ fontSize: 28, color: "#a5b4fc" }}>{categories}</div>
                    )}
                    <div
                        style={{
                            fontSize: 76,
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: "-0.025em",
                        }}
                    >
                        {title}
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 24,
                        opacity: 0.6,
                    }}
                >
                    <span>{dateStr}</span>
                    <span>{locale.toUpperCase()}</span>
                </div>
            </div>
        ),
        size,
    );
}
