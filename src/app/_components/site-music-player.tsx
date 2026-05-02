"use client";

import cn from "classnames";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { MusicTrack } from "@/lib/music-tracks";

const COLLAPSED_KEY = "nam-blog-music-player-collapsed";
const MINIMIZED_KEY = "nam-blog-music-player-minimized";

export type SiteMusicPlayerLabels = {
    play: string;
    pause: string;
    expand: string;
    collapse: string;
    previous: string;
    next: string;
    minimize: string;
    restore: string;
};

type Props = {
    tracks: MusicTrack[];
    labels: SiteMusicPlayerLabels;
};

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }
    const s = Math.floor(seconds % 60);
    const m = Math.floor(seconds / 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SiteMusicPlayer({ tracks, labels }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const track = tracks[currentIndex];
    const hasPlaylist = tracks.length > 1;
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;

    useEffect(() => {
        if (localStorage.getItem(COLLAPSED_KEY) === "1") {
            setCollapsed(true);
        }
        if (localStorage.getItem(MINIMIZED_KEY) === "1") {
            setMinimized(true);
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
        localStorage.setItem(MINIMIZED_KEY, minimized ? "1" : "0");
        const main = document.getElementById("site-main");
        if (main) {
            if (minimized) {
                main.classList.remove("pb-28");
                main.classList.add("pb-6");
            } else {
                main.classList.add("pb-28");
                main.classList.remove("pb-6");
            }
        }
    }, [collapsed, minimized, hydrated]);

    useEffect(() => {
        if (!isPlaying) {
            return;
        }
        const el = audioRef.current;
        if (!el) {
            return;
        }
        void el.play().catch(() => setIsPlaying(false));
    }, [currentIndex, isPlaying]);

    const togglePlay = useCallback(() => {
        const el = audioRef.current;
        if (!el) {
            return;
        }
        if (el.paused) {
            void el
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
        } else {
            el.pause();
            setIsPlaying(false);
        }
    }, []);

    const goPrev = useCallback(() => {
        if (!hasPlaylist) {
            return;
        }
        setCurrentIndex((i) => (i <= 0 ? tracks.length - 1 : i - 1));
    }, [hasPlaylist, tracks.length]);

    const goNext = useCallback(() => {
        if (!hasPlaylist) {
            return;
        }
        setCurrentIndex((i) => (i >= tracks.length - 1 ? 0 : i + 1));
    }, [hasPlaylist, tracks.length]);

    const onEnded = useCallback(() => {
        if (hasPlaylist) {
            setCurrentIndex((i) => (i >= tracks.length - 1 ? 0 : i + 1));
        } else {
            setIsPlaying(false);
        }
    }, [hasPlaylist, tracks.length]);

    const onTimeUpdate = useCallback(() => {
        const el = audioRef.current;
        if (el) {
            setCurrentTime(el.currentTime);
        }
    }, []);

    const onLoadedMetadata = useCallback(() => {
        const el = audioRef.current;
        if (el) {
            setDuration(el.duration);
        }
    }, []);

    const onSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const el = audioRef.current;
        const value = Number(e.target.value);
        if (el && Number.isFinite(value)) {
            el.currentTime = value;
            setCurrentTime(value);
        }
    }, []);

    if (tracks.length === 0 || !track) {
        return null;
    }

    const artSize = collapsed ? "h-10 w-10" : "h-14 w-14 sm:h-16 sm:w-16";

    return (
        <>
            <audio
                ref={audioRef}
                src={track.src}
                preload="metadata"
                onEnded={onEnded}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            {minimized ? (
                <button
                    type="button"
                    onClick={() => setMinimized(false)}
                    aria-label={labels.restore}
                    title={labels.restore}
                    className={cn(
                        "fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center overflow-hidden",
                        "rounded-full border border-neutral-200 bg-neutral-100 shadow-lg",
                        "text-neutral-900 transition-transform hover:scale-105 active:scale-95",
                        "dark:border-slate-600 dark:bg-[#121212] dark:text-slate-100",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                        "focus-visible:outline-neutral-900 dark:focus-visible:outline-white",
                        isPlaying &&
                            "ring-2 ring-neutral-900 ring-offset-2 ring-offset-neutral-100 dark:ring-white dark:ring-offset-[#121212]",
                    )}
                >
                    {track.artworkUrl ? (
                        <Image
                            src={track.artworkUrl}
                            alt=""
                            width={112}
                            height={112}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div
                            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-400
                            to-neutral-600 dark:from-slate-600 dark:to-slate-800"
                            aria-hidden
                        >
                            <MusicGlyph className="h-7 w-7 text-white/90" />
                        </div>
                    )}
                </button>
            ) : (
                <div
                    className={cn(
                        "fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-neutral-100",
                        "text-neutral-900 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]",
                        "dark:border-slate-700 dark:bg-[#121212] dark:text-slate-100 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]",
                    )}
                >
                    <div
                        className={cn(
                            "mx-auto flex max-w-6xl items-center gap-3 px-3 sm:px-4",
                            collapsed ? "py-2" : "py-3",
                        )}
                    >
                        <div
                            className={cn(
                                "relative shrink-0 overflow-hidden rounded bg-neutral-300 dark:bg-slate-700",
                                artSize,
                            )}
                        >
                            {track.artworkUrl ? (
                                <Image
                                    src={track.artworkUrl}
                                    alt=""
                                    width={256}
                                    height={256}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div
                                    className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-400
                                    to-neutral-600 dark:from-slate-600 dark:to-slate-800"
                                    aria-hidden
                                >
                                    <MusicGlyph className="h-1/2 w-1/2 text-white/90" />
                                </div>
                            )}
                        </div>

                        <div
                            className={cn(
                                "min-w-0 flex-1",
                                collapsed && "max-w-[50%] sm:max-w-none",
                            )}
                        >
                            {!collapsed && (
                                <div className="mb-2 hidden min-w-0 sm:block">
                                    <p className="truncate text-sm font-semibold tracking-tight">
                                        {track.title}
                                    </p>
                                    <p className="truncate text-xs text-neutral-600 dark:text-slate-400">
                                        {track.artist}
                                    </p>
                                </div>
                            )}
                            {collapsed ? (
                                <p className="truncate text-sm font-medium">{track.title}</p>
                            ) : (
                                <div className="flex items-center gap-2 sm:gap-3">
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
                            )}
                            {!collapsed && (
                                <div className="mt-1 min-w-0 sm:hidden">
                                    <p className="truncate text-sm font-semibold">{track.title}</p>
                                    <p className="truncate text-xs text-neutral-600 dark:text-slate-400">
                                        {track.artist}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                            {hasPlaylist && (
                                <IconButton label={labels.previous} onClick={goPrev}>
                                    <SkipBackGlyph />
                                </IconButton>
                            )}
                            <IconButton
                                label={isPlaying ? labels.pause : labels.play}
                                onClick={togglePlay}
                            >
                                {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
                            </IconButton>
                            {hasPlaylist && (
                                <IconButton label={labels.next} onClick={goNext}>
                                    <SkipForwardGlyph />
                                </IconButton>
                            )}
                            <IconButton
                                label={collapsed ? labels.expand : labels.collapse}
                                onClick={() => setCollapsed((c) => !c)}
                            >
                                {collapsed ? <ChevronUpGlyph /> : <ChevronDownGlyph />}
                            </IconButton>
                            <IconButton label={labels.minimize} onClick={() => setMinimized(true)}>
                                <CloseGlyph />
                            </IconButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function IconButton({
    label,
    onClick,
    children,
}: {
    label: string;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 transition-colors",
                "hover:bg-neutral-200 dark:text-slate-100 dark:hover:bg-slate-800",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
                "dark:focus-visible:outline-white",
            )}
        >
            {children}
        </button>
    );
}

function PlayGlyph() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
        </svg>
    );
}

function PauseGlyph() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
    );
}

function SkipBackGlyph() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
        </svg>
    );
}

function SkipForwardGlyph() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
    );
}

function ChevronDownGlyph() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
        >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ChevronUpGlyph() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
        >
            <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CloseGlyph() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
        >
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function MusicGlyph({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
    );
}
