"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FooterQuote } from "@/i18n/dictionaries";

const AUTO_ADVANCE_MS = 30000;

function readStoredIndex(storageKey: string, len: number): number {
    if (len <= 0) {
        return 0;
    }
    try {
        const raw = localStorage.getItem(storageKey);
        if (raw === null) {
            return 0;
        }
        const n = Number.parseInt(raw, 10);
        if (!Number.isFinite(n) || n < 0) {
            return 0;
        }
        return Math.min(n, len - 1);
    } catch {
        return 0;
    }
}

type Props = {
    quotes: FooterQuote[];
    storageKey: string;
    prevAria: string;
    nextAria: string;
};

export function FooterQuotes({ quotes, storageKey, prevAria, nextAria }: Props) {
    const [index, setIndex] = useState(0);
    const [autoKey, setAutoKey] = useState(0);
    const storageReady = useRef(false);

    const len = quotes.length;

    useLayoutEffect(() => {
        setIndex(readStoredIndex(storageKey, len));
        storageReady.current = true;
    }, [storageKey, len]);

    useEffect(() => {
        if (!storageReady.current || len <= 0) {
            return;
        }
        try {
            localStorage.setItem(storageKey, String(index));
        } catch {
            /* private mode / quota */
        }
    }, [index, storageKey, len]);
    const goPrev = useCallback(() => {
        setIndex((i) => (i - 1 + len) % len);
        setAutoKey((k) => k + 1);
    }, [len]);

    const goNext = useCallback(() => {
        setIndex((i) => (i + 1) % len);
        setAutoKey((k) => k + 1);
    }, [len]);

    useEffect(() => {
        if (len <= 1) {
            return;
        }
        const id = window.setInterval(() => {
            setIndex((i) => (i + 1) % len);
        }, AUTO_ADVANCE_MS);
        return () => window.clearInterval(id);
    }, [len, autoKey]);

    if (len === 0) {
        return null;
    }

    const item = quotes[index];
    const quoteText = item?.text ?? "";
    const author = item?.author;

    const btnClass =
        "shrink-0 min-w-[2.75rem] min-h-[2.75rem] rounded-full border border-neutral-300 dark:border-slate-500 text-neutral-800 dark:text-slate-100 hover:bg-neutral-100 dark:hover:bg-slate-700 transition-colors text-xl font-semibold leading-none";

    return (
        <div className="mt-12 w-full max-w-3xl mx-auto" aria-live="polite">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 w-full">
                <blockquote className="order-1 sm:order-2 text-center text-lg md:text-xl text-neutral-700 dark:text-slate-200 font-medium leading-relaxed px-2 sm:flex-1 sm:min-w-0 flex flex-col items-center justify-center">
                    <span className="line-clamp-6 whitespace-pre-line">{quoteText}</span>
                    {author ? (
                        <footer className="mt-3 text-sm font-normal text-neutral-500 dark:text-slate-400">
                            — <cite className="not-italic">{author}</cite>
                        </footer>
                    ) : null}
                    {len > 1 ? (
                        <p className="mt-3 text-sm tabular-nums text-neutral-500 dark:text-slate-400 font-normal">
                            {index + 1} / {len}
                        </p>
                    ) : null}
                </blockquote>
                {len > 1 && (
                    <div className="flex flex-row items-center justify-center gap-4 order-2 sm:contents">
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label={prevAria}
                            className={`${btnClass} sm:order-1`}
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label={nextAria}
                            className={`${btnClass} sm:order-3`}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
