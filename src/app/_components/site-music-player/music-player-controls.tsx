import cn from "classnames";
import type { SiteMusicPlayerLabels } from "./types";
import { IconButton } from "./icon-button";
import {
    PauseGlyph,
    PlayGlyph,
    SkipBackGlyph,
    SkipForwardGlyph,
} from "./glyphs";

type Props = {
    hasPlaylist: boolean;
    isPlaying: boolean;
    labels: SiteMusicPlayerLabels;
    goPrev: () => void;
    goNext: () => void;
    togglePlay: () => void;
    className?: string;
};

export function MusicPlayerControls({
    hasPlaylist,
    isPlaying,
    labels,
    goPrev,
    goNext,
    togglePlay,
    className,
}: Props) {
    return (
        <div className={cn("flex shrink-0 items-center gap-1 sm:gap-2", className)}>
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
        </div>
    );
}
