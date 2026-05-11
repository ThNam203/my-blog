"use client";

import cn from "classnames";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { type Locale } from "@/i18n/config";
import { type SearchDialogLabels } from "@/i18n/dictionaries";
import {
    filterSlimPostsByQuery,
    type SlimPost,
} from "@/lib/search-posts";
import type { SearchIndexResponse } from "@/app/api/posts/search-index/route";
import DateFormatter from "./date-formatter";
import { PostCategories } from "./post-categories";

const DEBOUNCE_MS = 500;

type LoadState =
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "ready"; posts: SlimPost[] }
    | { kind: "error" };

type Props = {
    open: boolean;
    onClose: () => void;
    locale: Locale;
    labels: SearchDialogLabels;
};

export function SiteSearchDialog({ open, onClose, locale, labels }: Props) {
    const [loadState, setLoadState] = useState<LoadState>({ kind: "idle" });
    const [inputValue, setInputValue] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const loadStateRef = useRef<LoadState>(loadState);
    loadStateRef.current = loadState;
    const inFlightRef = useRef(false);

    useEffect(() => {
        if (!open) return;
        const current = loadStateRef.current;
        if (current.kind === "ready") return;
        if (inFlightRef.current) return;

        inFlightRef.current = true;
        setLoadState({ kind: "loading" });

        fetch(`/api/posts/search-index?locale=${encodeURIComponent(locale)}`, {
            headers: { Accept: "application/json" },
        })
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json() as Promise<SearchIndexResponse>;
            })
            .then((data) => {
                inFlightRef.current = false;
                setLoadState({ kind: "ready", posts: data.posts });
            })
            .catch(() => {
                inFlightRef.current = false;
                setLoadState({ kind: "error" });
            });
    }, [open, locale]);

    useEffect(() => {
        if (!open) return;
        const handle = window.setTimeout(() => setDebouncedQuery(inputValue), DEBOUNCE_MS);
        return () => window.clearTimeout(handle);
    }, [inputValue, open]);

    useEffect(() => {
        if (!open) return;
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const focusHandle = window.setTimeout(() => inputRef.current?.focus(), 0);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.clearTimeout(focusHandle);
        };
    }, [open]);

    useEffect(() => {
        if (open) return;
        setInputValue("");
        setDebouncedQuery("");
    }, [open]);

    const results = useMemo(() => {
        if (loadState.kind !== "ready") return [];
        return filterSlimPostsByQuery(loadState.posts, debouncedQuery);
    }, [loadState, debouncedQuery]);

    if (!open) return null;

    function handleBackdropClick(event: React.MouseEvent) {
        if (event.target === event.currentTarget) onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[10vh] backdrop-blur-sm"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label={labels.dialogTitle}
        >
            <div
                className={cn(
                    "flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border",
                    "border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900",
                    "max-h-[80vh]",
                )}
            >
                <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
                    <SearchGlyph className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />
                    <input
                        ref={inputRef}
                        type="search"
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        placeholder={labels.placeholder}
                        className={cn(
                            "flex-1 bg-transparent text-base outline-none",
                            "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
                        )}
                        aria-label={labels.dialogTitle}
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={labels.closeAria}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                        ✕
                    </button>
                </div>

                <p className="px-4 pt-3 text-xs text-neutral-500 dark:text-neutral-400">
                    {labels.scopeHint}
                </p>

                <SearchResultBody
                    loadState={loadState}
                    debouncedQuery={debouncedQuery}
                    results={results}
                    locale={locale}
                    labels={labels}
                    onSelect={onClose}
                />
            </div>
        </div>
    );
}

type ResultBodyProps = {
    loadState: LoadState;
    debouncedQuery: string;
    results: SlimPost[];
    locale: Locale;
    labels: SearchDialogLabels;
    onSelect: () => void;
};

function SearchResultBody({
    loadState,
    debouncedQuery,
    results,
    locale,
    labels,
    onSelect,
}: ResultBodyProps) {
    const trimmedQuery = debouncedQuery.trim();

    if (loadState.kind === "loading" || loadState.kind === "idle") {
        return <StatusMessage>{labels.loading}</StatusMessage>;
    }

    if (loadState.kind === "error") {
        return <StatusMessage tone="error">{labels.error}</StatusMessage>;
    }

    if (!trimmedQuery) {
        return <StatusMessage>{labels.typeToStart}</StatusMessage>;
    }

    if (results.length === 0) {
        return <StatusMessage>{labels.noResults}</StatusMessage>;
    }

    const countLabel = labels.resultsCount.replace("{count}", String(results.length));

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <p
                className="px-4 pt-2 pb-1 text-xs uppercase tracking-wide text-neutral-400"
                aria-live="polite"
            >
                {countLabel}
            </p>
            <ul
                className="flex-1 overflow-y-auto px-2 pb-3"
                onClickCapture={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.closest("a")) onSelect();
                }}
            >
                {results.map((post) => (
                    <li
                        key={post.slug}
                        className={cn(
                            "rounded-lg px-3 py-2 transition-colors",
                            "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                        )}
                    >
                        <Link
                            href={`/${locale}/posts/${post.slug}`}
                            className="block focus:outline-none"
                        >
                            <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                                {post.title}
                            </div>
                            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                <DateFormatter dateString={post.date} locale={locale} />
                            </div>
                            {post.excerpt && (
                                <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-300">
                                    {post.excerpt}
                                </p>
                            )}
                        </Link>
                        {post.categories.length > 0 && (
                            <div className="mt-2">
                                <PostCategories categories={post.categories} locale={locale} />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function StatusMessage({
    children,
    tone = "neutral",
}: {
    children: React.ReactNode;
    tone?: "neutral" | "error";
}) {
    return (
        <p
            className={cn(
                "px-4 py-6 text-sm",
                tone === "error"
                    ? "text-red-600 dark:text-red-400"
                    : "text-neutral-500 dark:text-neutral-400",
            )}
        >
            {children}
        </p>
    );
}

export function SearchGlyph({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
            />
        </svg>
    );
}
