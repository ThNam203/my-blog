"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { submitConfession } from "@/lib/actions/confessions";
import { CONFESSION_BODY_MAX_LENGTH } from "@/lib/constants";

const MAX_LEN = CONFESSION_BODY_MAX_LENGTH;

type Props = {
    locale: string;
    placeholder: string;
    submitLabel: string;
    submittingLabel: string;
    successLabel: string;
    privacyNote: string;
};

export function ConfessionForm({
    locale,
    placeholder,
    submitLabel,
    submittingLabel,
    successLabel,
    privacyNote,
}: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [text, setText] = useState("");
    const honeypotRef = useRef<HTMLInputElement>(null);
    const counterId = useId();
    const length = text.length;

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const honeypot = honeypotRef.current?.value ?? "";
        if (!text.trim()) return;

        startTransition(async () => {
            const result = await submitConfession(text, locale, honeypot);
            if (result.error) {
                toast.error(result.error);
            } else {
                setText("");
                toast.success(successLabel);
                router.refresh();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <p className="text-sm text-black dark:text-neutral-200">{privacyNote}</p>
            <input
                ref={honeypotRef}
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                required
                minLength={1}
                maxLength={MAX_LEN}
                rows={6}
                aria-describedby={counterId}
                className="w-full resize-y rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-sm text-black outline-none placeholder:text-neutral-500 focus:border-neutral-900 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400"
            />
            <p
                id={counterId}
                className="text-right text-xs tabular-nums text-black dark:text-neutral-300"
            >
                {length} / {MAX_LEN}
            </p>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                >
                    {isPending ? submittingLabel : submitLabel}
                </button>
            </div>
        </form>
    );
}
