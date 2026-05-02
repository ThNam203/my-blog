import cn from "classnames";
import type { ChangeEvent } from "react";
import type { MusicTrack } from "@/lib/music-tracks";
import type { SiteMusicPlayerLabels } from "./types";
import { formatTime } from "./format-time";
import { CloseGlyph, MusicGlyph } from "./glyphs";
import { IconButton } from "./icon-button";
import { MusicPlayerControls } from "./music-player-controls";

type Props = {
    track: MusicTrack;
    hasPlaylist: boolean;
    isPlaying: boolean;
    labels: SiteMusicPlayerLabels;
    currentTime: number;
    safeDuration: number;
    onSeek: (e: ChangeEvent<HTMLInputElement>) => void;
    onMinimize: () => void;
    goPrev: () => void;
    goNext: () => void;
    togglePlay: () => void;
};

export function ExpandedPlayerBar({
    track,
    hasPlaylist,
    isPlaying,
    labels,
    currentTime,
    safeDuration,
    onSeek,
    onMinimize,
    goPrev,
    goNext,
    togglePlay,
}: Props) {
    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-neutral-100",
                "text-neutral-900 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]",
                "dark:border-slate-700 dark:bg-[#121212] dark:text-slate-100 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]",
            )}
        >
            <div
                className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-x-2 gap-y-2 px-3 py-2 sm:gap-x-3 sm:px-4"
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-neutral-300 dark:bg-slate-700">
                        <div
                            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-400
                            to-neutral-600 dark:from-slate-600 dark:to-slate-800"
                            aria-hidden
                        >
                            <MusicGlyph className="h-1/2 w-1/2 text-white/90" />
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tracking-tight">
                            {track.title}
                        </p>
                        <p className="truncate text-xs text-neutral-600 dark:text-slate-400">
                            {track.artist}
                        </p>
                    </div>
                </div>
                <MusicPlayerControls
                    className="justify-self-center"
                    hasPlaylist={hasPlaylist}
                    isPlaying={isPlaying}
                    labels={labels}
                    goPrev={goPrev}
                    goNext={goNext}
                    togglePlay={togglePlay}
                />
                <div className="flex justify-self-end">
                    <IconButton label={labels.minimize} onClick={onMinimize}>
                        <CloseGlyph />
                    </IconButton>
                </div>
                <div className="col-span-3 flex items-center gap-2 sm:gap-3">
                    <span className="w-10 shrink-0 tabular-nums text-xs text-neutral-500 dark:text-slate-500">
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min={0}
                        max={safeDuration || 1}
                        step="any"
                        value={
                            safeDuration ? Math.min(currentTime, safeDuration) : 0
                        }
                        onChange={onSeek}
                        disabled={!safeDuration}
                        className={cn(
                            "music-player-range h-1 flex-1 cursor-pointer appearance-none rounded-full",
                            "bg-neutral-300 dark:bg-slate-600",
                            "accent-neutral-900 dark:accent-white",
                        )}
                        aria-label={track.title}
                    />
                    <span className="w-10 shrink-0 text-right tabular-nums text-xs text-neutral-500 dark:text-slate-500">
                        {formatTime(safeDuration)}
                    </span>
                </div>
            </div>
        </div>
    );
}
