"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { toast } from "react-toastify";
import { addComment } from "@/lib/actions/comments";

type Props = {
    postSlug: string;
    locale: string;
    parentId?: string | null;
    placeholder: string;
    postLabel: string;
    postingLabel: string;
    postedSuccessLabel: string;
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
    postedSuccessLabel,
    cancelLabel,
    onSuccess,
}: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const body = textareaRef.current?.value.trim() ?? "";
        if (!body) return;

        startTransition(async () => {
            const result = await addComment(postSlug, body, parentId, locale);
            if (result.error) {
                toast.error(result.error);
            } else {
                if (textareaRef.current) textareaRef.current.value = "";
                toast.success(postedSuccessLabel);
                router.refresh();
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
