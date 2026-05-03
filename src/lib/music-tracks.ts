export type MusicTrack = {
    /** Public URL under `public/` (e.g. `.mp4`, `.wav`, `.m4a`) */
    src: string;
    title: string;
    artist: string;
};

/**
 * Built-in demo uses short synthetic tones in `public/music/`.
 * Replace or extend with your own files (including `.mp4`).
 */
export const MUSIC_TRACKS: MusicTrack[] = [
    {
        src: "/music/nang_am_trong_tim.mp3",
        title: "Nắng ấm trong tim",
        artist: "DuongG, Dadeon",
    },
    {
        src: "/music/to_mau.mp3",
        title: "Tô màu",
        artist: "XIN",
    },
    {
        src: "/music/rang_khon.mp3",
        title: "Răng khôn",
        artist: "Phí Phương Anh, RIN9",
    },    
    {
        src: "/music/nhung_dieu_nho_nhoi.mp3",
        title: "Những điều nhỏ nhoi",
        artist: "Ruby Dong Melodies of Soul",
    },
];
