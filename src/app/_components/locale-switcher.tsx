"use client";

import { defaultLocale, type Locale } from "@/i18n/config";
import { swapLocaleInPathname } from "@/i18n/swap-locale-path";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
    locale: Locale;
    vietnameseLabel: string;
    englishLabel: string;
};

export function LocaleSwitcher({ locale, vietnameseLabel, englishLabel }: Props) {
    const pathname = usePathname() ?? `/${defaultLocale}`;
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const languageLabel = locale === "vi" ? vietnameseLabel : englishLabel;

    return (
        <div ref={menuRef}>
            <button
                type="button"
                className="rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm font-semibold
                tracking-wide transition-colors hover:bg-neutral-100 dark:border-slate-600
                dark:bg-slate-900 dark:hover:bg-slate-800"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {languageLabel}
            </button>
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 min-w-28 rounded-md border border-neutral-300
                    bg-white p-1 shadow-lg dark:border-slate-600 dark:bg-slate-900"
                >
                    <Link
                        href={swapLocaleInPathname(pathname, "vi")}
                        className="block w-full rounded px-3 py-1 text-left text-sm hover:bg-neutral-100
                        dark:hover:bg-slate-800"
                        onClick={() => setIsOpen(false)}
                    >
                        {vietnameseLabel}
                    </Link>
                    <Link
                        href={swapLocaleInPathname(pathname, "en")}
                        className="block w-full rounded px-3 py-1 text-left text-sm hover:bg-neutral-100
                        dark:hover:bg-slate-800"
                        onClick={() => setIsOpen(false)}
                    >
                        {englishLabel}
                    </Link>
                </div>
            )}
        </div>
    );
}
