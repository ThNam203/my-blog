"use client";

import cn from "classnames";
import { useEffect, useState } from "react";
import type { Heading } from "@/lib/post-html";

type Props = {
    headings: Heading[];
    label: string;
};

export function TableOfContents({ headings, label }: Props) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (headings.length === 0) return;
        const elements = headings
            .map((heading) => document.getElementById(heading.id))
            .filter((el): el is HTMLElement => el !== null);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: "0px 0px -70% 0px", threshold: 0.1 },
        );

        for (const el of elements) observer.observe(el);
        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav
            aria-label={label}
            className={cn(
                "sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto",
                "border-l border-neutral-200 dark:border-neutral-700 pl-4",
            )}
        >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {label}
            </p>
            <ul className="space-y-1 text-sm">
                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        className={cn(heading.level === 3 && "pl-3")}
                    >
                        <a
                            href={`#${heading.id}`}
                            className={cn(
                                "block py-0.5 transition-colors",
                                activeId === heading.id
                                    ? "text-neutral-900 dark:text-neutral-100 font-medium"
                                    : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
                            )}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
