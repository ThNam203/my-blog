import { locales, type Locale } from "./config";

export function swapLocaleInPathname(pathname: string, targetLocale: Locale): string {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment && locales.includes(firstSegment as Locale)) {
        segments[0] = targetLocale;
        return `/${segments.join("/")}`;
    }

    if (segments.length === 0) {
        return `/${targetLocale}`;
    }

    return `/${targetLocale}/${segments.join("/")}`;
}
