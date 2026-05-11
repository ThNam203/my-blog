"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import markdownStyles from "./markdown-styles.module.css";

type Props = {
    content: string;
};

type LightboxImage = {
    src: string;
    alt: string;
};

export function PostBody({ content }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<LightboxImage | null>(null);

    useEffect(() => {
        const root = containerRef.current;
        if (!root) return;
        const images = root.querySelectorAll<HTMLImageElement>("img");
        const handlers: Array<{ el: HTMLImageElement; handler: (e: MouseEvent) => void }> = [];
        images.forEach((img) => {
            const handler = (event: MouseEvent) => {
                event.preventDefault();
                setActive({ src: img.currentSrc || img.src, alt: img.alt });
            };
            img.addEventListener("click", handler);
            handlers.push({ el: img, handler });
        });
        return () => {
            handlers.forEach(({ el, handler }) => el.removeEventListener("click", handler));
        };
    }, [content]);

    const close = useCallback(() => setActive(null), []);

    useEffect(() => {
        if (!active) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };
        document.addEventListener("keydown", handleKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [active, close]);

    return (
        <div className="max-w-2xl mx-auto">
            <div
                ref={containerRef}
                className={markdownStyles["markdown"]}
                dangerouslySetInnerHTML={{ __html: content }}
            />
            {active && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={active.alt || "Image preview"}
                    onClick={close}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                >
                    <img
                        src={active.src}
                        alt={active.alt}
                        className="max-h-full max-w-full object-contain"
                        onClick={(event) => event.stopPropagation()}
                    />
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close"
                        className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/20"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}
