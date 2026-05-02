"use client";

import { useRef, useState, useTransition } from "react";
import { addComment } from "@/lib/actions/comments";

type Props = {
    postSlug: string;
    locale: string;
    parentId?: string | null;
    placeholder: string;
    postLabel: string;
    postingLabel: string;
    cancelLabel: string;
    onSuccess?: () => void;
};

export function CommentForm({
    postSlug,
    locale,
    parentId = null,
    placeholder,
    postLabel,
    postingLabel,
    cancelLabel,
    onSuccess,
}: Props) {
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const body = textareaRef.current?.value.trim() ?? "";
        if (!body) return;
        setError("");

        startTransition(async () => {
            const result = await addComment(postSlug, body, parentId, locale);
            if (result.error) {
                setError(result.error);
            } else {
                if (textareaRef.current) textareaRef.current.value = "";
                onSuccess?.();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
                ref={textareaRef}
                placeholder={placeholder}
                required
                maxLength={2000}
                rows={3}
                className="w-full resize-none rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
                {onSuccess && (
                    <button
                        type="button"
                        onClick={onSuccess}
                        className="rounded-lg px-4 py-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    >
                        {cancelLabel}
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                >
                    {isPending ? postingLabel : postLabel}
                </button>
            </div>
        </form>
    );
}
