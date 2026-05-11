"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let frame = 0;
        const compute = () => {
            frame = 0;
            const doc = document.documentElement;
            const scrollTop = window.scrollY || doc.scrollTop;
            const max = doc.scrollHeight - window.innerHeight;
            const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, scrollTop / max));
            setProgress(ratio);
        };
        const schedule = () => {
            if (frame !== 0) return;
            frame = window.requestAnimationFrame(compute);
        };

        compute();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            if (frame !== 0) window.cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div aria-hidden className="fixed left-0 top-0 z-40 h-0.5 w-full bg-transparent">
            <div
                className="h-full bg-neutral-900 dark:bg-neutral-100"
                style={{ width: `${progress * 100}%` }}
            />
        </div>
    );
}
