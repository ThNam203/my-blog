"use client";

import { useState } from "react";

type Props = {
    placeholder: string;
    postLabel: string;
    postingLabel: string;
    cancelLabel: string;
    initialValue?: string;
    onSubmit: (body: string) => Promise<void> | void;
    onCancel?: () => void;
};

export function CommentForm({
    placeholder,
    postLabel,
    postingLabel,
    cancelLabel,
    initialValue = "",
    onSubmit,
    onCancel,
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState(initialValue);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const body = value.trim();
        if (!body) return;
        setIsSubmitting(true);
        try {
            await onSubmit(body);
            if (!initialValue) setValue("");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={placeholder}
                required
                maxLength={2000}
                rows={3}
                className="w-full resize-none rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
            />
            <div className="flex justify-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg px-4 py-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    >
                        {cancelLabel}
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                >
                    {isSubmitting ? postingLabel : postLabel}
                </button>
            </div>
        </form>
    );
}
