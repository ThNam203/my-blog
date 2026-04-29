export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";

export const localePrefix = "always";

export function isValidLocale(value: string): value is Locale {
    return locales.includes(value as Locale);
}
