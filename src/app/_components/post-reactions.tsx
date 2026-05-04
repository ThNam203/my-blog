"use client";

import { useEffect, useRef, useState } from "react";
import { getReactions, toggleReaction } from "@/lib/actions/reactions";
import type { MyReactions, ReactionCounts, ReactionEmoji } from "@/lib/supabase/types";

// Twemoji CDN
const TWEMOJI = "https://twemoji.maxcdn.com/v/14.0.2/svg";

const REACTIONS: { key: ReactionEmoji; src: string; label: string }[] = [
    { key: "heart", src: `${TWEMOJI}/2764.svg`, label: "Love" },
    { key: "fire", src: `${TWEMOJI}/1f525.svg`, label: "Fire" },
    { key: "cry", src: `${TWEMOJI}/1f622.svg`, label: "Sad" },
    { key: "laugh", src: `${TWEMOJI}/1f602.svg`, label: "Haha" },
];

const SESSION_KEY = "my-blog:sessionId";

function getOrCreateSessionId(): string {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(SESSION_KEY, id);
    }
    return id;
}

type Props = {
    postSlug: string;
    reactionLabel: string;
};

export function PostReactions({ postSlug, reactionLabel }: Props) {
    const [counts, setCounts] = useState<ReactionCounts>({ heart: 0, fire: 0, cry: 0, laugh: 0 });
    const [mine, setMine] = useState<MyReactions>({
        heart: false,
        fire: false,
        cry: false,
        laugh: false,
    });
    const [pending, setPending] = useState<ReactionEmoji | null>(null);
    const sessionId = useRef<string>("");

    useEffect(() => {
        sessionId.current = getOrCreateSessionId();
        getReactions(postSlug, sessionId.current).then(({ counts, mine }) => {
            setCounts(counts);
            setMine(mine);
        });
    }, [postSlug]);

    async function handleClick(emoji: ReactionEmoji) {
        if (pending) return;
        setPending(emoji);

        // Optimistic update
        const wasActive = mine[emoji];
        setCounts((c) => ({ ...c, [emoji]: c[emoji] + (wasActive ? -1 : 1) }));
        setMine((m) => ({ ...m, [emoji]: !wasActive }));

        const result = await toggleReaction(postSlug, emoji, sessionId.current);
        if ("error" in result) {
            // Revert on error
            setCounts((c) => ({ ...c, [emoji]: c[emoji] + (wasActive ? 1 : -1) }));
            setMine((m) => ({ ...m, [emoji]: wasActive }));
        } else {
            setCounts(result.counts);
            setMine(result.mine);
        }
        setPending(null);
    }

    return (
        <div className="flex flex-col items-center gap-3 my-10">
            <p className="text-sm text-neutral-500 dark:text-slate-400">{reactionLabel}</p>
            <div className="flex gap-3">
                {REACTIONS.map(({ key, src, label }) => {
                    const active = mine[key];
                    const count = counts[key];
                    return (
                        <button
                            key={key}
                            onClick={() => handleClick(key)}
                            disabled={pending !== null}
                            aria-label={label}
                            aria-pressed={active}
                            className={[
                                "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl border text-sm font-medium transition-all duration-150 select-none",
                                "disabled:cursor-not-allowed",
                                active
                                    ? "border-neutral-400 bg-neutral-100 dark:border-slate-400 dark:bg-slate-700 scale-105"
                                    : "border-neutral-200 bg-white dark:border-slate-600 dark:bg-slate-800 hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-slate-500 dark:hover:bg-slate-700",
                            ].join(" ")}
                        >
                            <img src={src} alt={label} width={24} height={24} className="w-6 h-6" />
                            <span
                                className={
                                    active
                                        ? "text-neutral-700 dark:text-slate-200"
                                        : "text-neutral-400 dark:text-slate-400"
                                }
                            >
                                {count > 0 ? count : ""}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
