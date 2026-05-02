import cn from "classnames";
import type { SiteMusicPlayerLabels } from "./types";
import { MinimizedProgressRing } from "./minimized-progress-ring";
import { MusicGlyph } from "./glyphs";

type Props = {
    labels: SiteMusicPlayerLabels;
    onExpand: () => void;
    progress: number;
    gradientId: string;
};

export function MinimizedPlayerFab({
    labels,
    onExpand,
    progress,
    gradientId,
}: Props) {
    return (
        <button
            type="button"
            onClick={onExpand}
            aria-label={labels.restore}
            title={labels.restore}
            className={cn(
                "fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center",
                "overflow-visible rounded-full border border-neutral-200 bg-neutral-100 shadow-lg",
                "text-neutral-900 transition-transform hover:scale-105 active:scale-95",
                "dark:border-slate-600 dark:bg-[#121212] dark:text-slate-100",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                "focus-visible:outline-neutral-900 dark:focus-visible:outline-white",
            )}
        >
            <MinimizedProgressRing gradientId={gradientId} progress={progress} />
            <div
                className="absolute inset-[5px] flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-neutral-400
                to-neutral-600 dark:from-slate-600 dark:to-slate-800"
                aria-hidden
            >
                <MusicGlyph className="h-7 w-7 text-white/90" />
            </div>
        </button>
    );
}
