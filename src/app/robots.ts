import type { MetadataRoute } from "next";
import { WEB_DEFAULT_URL } from "@/lib/constants";

const SITE_URL = WEB_DEFAULT_URL.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
