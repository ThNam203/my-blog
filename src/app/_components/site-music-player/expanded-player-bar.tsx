import cn from "classnames";
import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type CSSProperties,
    type ChangeEvent,
} from "react";
import type { MusicTrack } from "@/lib/music-tracks";
import type { SiteMusicPlayerLabels } from "./types";
import { formatTime } from "./format-time";
import { CloseGlyph, MusicGlyph, QueueListGlyph } from "./glyphs";
import { IconButton } from "./icon-button";
import { MusicPlayerControls } from "./music-player-controls";
import { PlayingWave } from "./playing-wave";

type Props = {
    tracks: MusicTrack[];
    currentIndex: number;
    track: MusicTrack;
    hasPlaylist: boolean;
    isPlaying: boolean;
    labels: SiteMusicPlayerLabels;
    currentTime: number;
    safeDuration: number;
    onSeek: (e: ChangeEvent<HTMLInputElement>) => void;
    onMinimize: () => void;
    onSelectTrack: (index: number) => void;
    goPrev: () => void;
    goNext: () => void;
    togglePlay: () => void;
};

export function ExpandedPlayerBar({
    tracks,
    currentIndex,
    track,
    hasPlaylist,
    isPlaying,
    labels,
    currentTime,
    safeDuration,
    onSeek,
    onMinimize,
    onSelectTrack,
    goPrev,
    goNext,
    togglePlay,
}: Props) {
    const [playlistOpen, setPlaylistOpen] = useState(false);
    const playlistWrapRef = useRef<HTMLDivElement | null>(null);
    const listTitleId = useId();
    const progressPercent = safeDuration
        ? Math.min(100, Math.max(0, (currentTime / safeDuration) * 100))
        : 0;
    const scrubberStyle = {
        "--music-progress": `${progressPercent}%`,
    } as CSSProperties;

    const closePlaylist = useCallback(() => setPlaylistOpen(false), []);

    useEffect(() => {
        if (!playlistOpen) {
            return;
        }
        const onPointerDown = (e: PointerEvent) => {
            if (
                playlistWrapRef.current &&
                !playlistWrapRef.current.contains(e.target as Node)
            ) {
                setPlaylistOpen(false);
            }
        };
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [playlistOpen]);

    useEffect(() => {
        if (!playlistOpen) {
            return;
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setPlaylistOpen(false);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [playlistOpen]);

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
                    <div className="min-w-0 flex-1">
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
                <div
                    className="relative flex justify-self-end"
                    ref={playlistWrapRef}
                >
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        <IconButton
                            label={labels.showPlaylist}
                            ariaExpanded={playlistOpen}
                            onClick={() => setPlaylistOpen((o) => !o)}
                        >
                            <QueueListGlyph />
                        </IconButton>
                        <IconButton label={labels.minimize} onClick={onMinimize}>
                            <CloseGlyph />
                        </IconButton>
                    </div>
                    {playlistOpen && (
                        <div
                            className={cn(
                                "absolute bottom-full right-0 z-[60] mb-2 w-[min(100vw-1.5rem,20rem)]",
                                "rounded-lg border border-neutral-200 bg-neutral-50 py-2 shadow-lg",
                                "dark:border-slate-600 dark:bg-slate-900",
                            )}
                            role="dialog"
                            aria-labelledby={listTitleId}
                        >
                            <h2
                                id={listTitleId}
                                className="border-b border-neutral-200 px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-slate-700 dark:text-slate-400"
                            >
                                {labels.playlistHeading}
                            </h2>
                            <ul
                                className="max-h-64 overflow-y-auto py-1"
                                role="listbox"
                                aria-label={labels.playlistHeading}
                            >
                                {tracks.map((t, index) => {
                                    const isCurrent = index === currentIndex;
                                    return (
                                        <li key={`${t.src}-${index}`} role="none">
                                            <button
                                                type="button"
                                                role="option"
                                                aria-selected={isCurrent}
                                                className={cn(
                                                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors",
                                                    isCurrent
                                                        ? "bg-neutral-200/80 dark:bg-slate-800"
                                                        : "hover:bg-neutral-200/50 dark:hover:bg-slate-800/60",
                                                )}
                                                onClick={() => {
                                                    onSelectTrack(index);
                                                    closePlaylist();
                                                }}
                                            >
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate font-medium">
                                                        {t.title}
                                                    </span>
                                                    <span className="block truncate text-xs text-neutral-600 dark:text-slate-400">
                                                        {t.artist}
                                                    </span>
                                                </span>
                                                {isCurrent ? (
                                                    <span className="sr-only">
                                                        {labels.nowPlaying}
                                                    </span>
                                                ) : null}
                                                <PlayingWave
                                                    visible={isCurrent}
                                                    animating={
                                                        isCurrent && isPlaying
                                                    }
                                                />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
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
                        style={scrubberStyle}
                        className={cn(
                            "music-player-range h-1 flex-1 cursor-pointer appearance-none rounded-full",
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
