import { WEB_DEFAULT_AUTHOR } from "@/lib/constants";

export type MusicTrack = {
    /** Public URL under `public/` (e.g. `.mp4`, `.wav`, `.m4a`) */
    src: string;
    title: string;
    artist: string;
    /** Optional square image in `public/` */
    artworkUrl?: string;
};

/**
 * Built-in demo uses short synthetic tones in `public/music/`.
 * Replace or extend with your own files (including `.mp4`).
 */
export const MUSIC_TRACKS: MusicTrack[] = [
    {
        src: "/music/demo.wav",
        title: "Demo — A4 tone",
        artist: WEB_DEFAULT_AUTHOR,
        artworkUrl: "/assets/blog/me/my_first_avatar.jpg",
    },
    {
        src: "/music/demo-2.wav",
        title: "Demo — C5 tone",
        artist: WEB_DEFAULT_AUTHOR,
        artworkUrl: "/assets/blog/me/my_first_avatar.jpg",
    },
];
