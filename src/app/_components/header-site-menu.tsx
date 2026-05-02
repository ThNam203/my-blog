"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthModal, type AuthModalTab } from "@/app/_components/comments/auth-modal";
import { signOut } from "@/lib/actions/auth";
import type { AuthModalLabels } from "@/i18n/dictionaries";
import { defaultLocale, type Locale } from "@/i18n/config";
import { swapLocaleInPathname } from "@/i18n/swap-locale-path";
import {
    THEME_MENU_OPTIONS,
    type ColorSchemePreference,
    useColorSchemePreference,
} from "@/app/_components/theme-switcher";

function DefaultAvatar() {
    return (
        <span
            className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                "border-neutral-300 bg-neutral-100 text-neutral-500",
                "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400",
            )}
            aria-hidden
        >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
        </span>
    );
}

function ChevronDown({ open }: { open: boolean }) {
    return (
        <svg
            className={cn(
                "h-4 w-4 shrink-0 text-neutral-600 transition-transform dark:text-slate-300",
                open && "rotate-180",
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}

type ThemeLabelMap = Record<ColorSchemePreference, string>;

type Props = {
    locale: Locale;
    isAuthenticated: boolean;
    avatarUrl: string | null;
    vietnameseLabel: string;
    englishLabel: string;
    languageSectionLabel: string;
    themeLabels: ThemeLabelMap;
    labels: {
        menuOpenAria: string;
        themeSection: string;
        signIn: string;
        signUp: string;
        signOut: string;
        profile: string;
    };
    authModal: AuthModalLabels;
};

export function HeaderSiteMenu({
    locale,
    isAuthenticated,
    avatarUrl,
    vietnameseLabel,
    englishLabel,
    languageSectionLabel,
    themeLabels,
    labels,
    authModal,
}: Props) {
    const router = useRouter();
    const pathname = usePathname() ?? `/${defaultLocale}`;
    const [menuOpen, setMenuOpen] = useState(false);
    const [authSession, setAuthSession] = useState<{ tab: AuthModalTab; id: number } | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const { mode, setMode, isMounted } = useColorSchemePreference();

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent): void => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        const handleEscape = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function openAuth(tab: AuthModalTab) {
        setMenuOpen(false);
        setAuthSession((prev) => ({ tab, id: (prev?.id ?? 0) + 1 }));
    }

    async function handleSignOut() {
        setMenuOpen(false);
        await signOut();
        router.refresh();
    }

    function selectTheme(next: ColorSchemePreference) {
        setMode(next);
        setMenuOpen(false);
    }

    const menuItemClass =
        "block w-full rounded-md px-3 py-2 text-left text-sm text-neutral-800 " +
        "hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-slate-800";

    const themeRowClass = (active: boolean) =>
        cn(menuItemClass, active && "bg-neutral-100 font-medium dark:bg-slate-800");

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                className={cn(
                    "flex items-center gap-1 rounded-full border border-neutral-300 bg-white py-1 pl-1 pr-2",
                    "outline-none ring-offset-2 transition-colors hover:bg-neutral-50",
                    "focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-slate-600",
                    "dark:bg-slate-900 dark:hover:bg-slate-800 dark:ring-offset-slate-950",
                    "dark:focus-visible:ring-slate-500",
                )}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label={labels.menuOpenAria}
                onClick={() => setMenuOpen((o) => !o)}
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt=""
                        width={32}
                        height={32}
                        className={cn(
                            "h-8 w-8 rounded-full border border-neutral-300 object-cover",
                            "dark:border-slate-600",
                        )}
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <DefaultAvatar />
                )}
                <ChevronDown open={menuOpen} />
            </button>

            {menuOpen && (
                <div
                    className={cn(
                        "absolute right-0 top-full z-50 mt-2 w-60 rounded-lg border border-neutral-300",
                        "bg-white py-2 shadow-lg dark:border-slate-600 dark:bg-slate-900",
                    )}
                    role="menu"
                >
                    <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        {languageSectionLabel}
                    </p>
                    <Link
                        href={swapLocaleInPathname(pathname, "vi")}
                        className={menuItemClass}
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                    >
                        {vietnameseLabel}
                    </Link>
                    <Link
                        href={swapLocaleInPathname(pathname, "en")}
                        className={menuItemClass}
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                    >
                        {englishLabel}
                    </Link>

                    <div className="my-2 border-t border-neutral-200 dark:border-slate-700" />

                    <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        {labels.themeSection}
                    </p>
                    {THEME_MENU_OPTIONS.map((themeMode) => (
                        <button
                            key={themeMode}
                            type="button"
                            role="menuitem"
                            className={themeRowClass(isMounted && mode === themeMode)}
                            onClick={() => selectTheme(themeMode)}
                        >
                            {themeLabels[themeMode]}
                        </button>
                    ))}

                    <div className="my-2 border-t border-neutral-200 dark:border-slate-700" />

                    {isAuthenticated ? (
                        <>
                            <Link
                                href={`/${locale}/profile`}
                                className={menuItemClass}
                                role="menuitem"
                                onClick={() => setMenuOpen(false)}
                            >
                                {labels.profile}
                            </Link>
                            <button
                                type="button"
                                role="menuitem"
                                className={menuItemClass}
                                onClick={() => void handleSignOut()}
                            >
                                {labels.signOut}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                role="menuitem"
                                className={menuItemClass}
                                onClick={() => openAuth("login")}
                            >
                                {labels.signIn}
                            </button>
                            <button
                                type="button"
                                role="menuitem"
                                className={menuItemClass}
                                onClick={() => openAuth("register")}
                            >
                                {labels.signUp}
                            </button>
                        </>
                    )}
                </div>
            )}

            {authSession && (
                <AuthModal
                    key={authSession.id}
                    initialTab={authSession.tab}
                    labels={authModal}
                    onClose={() => setAuthSession(null)}
                />
            )}
        </div>
    );
}
