"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateDisplayName } from "@/lib/actions/profile";

type Labels = {
    emailFieldLabel: string;
    displayNameLabel: string;
    emailHint: string;
    save: string;
    saving: string;
    saved: string;
};

type Props = {
    locale: string;
    initialDisplayName: string;
    email: string | null;
    labels: Labels;
};

export function ProfileEditForm({ locale, initialDisplayName, email, labels }: Props) {
    const router = useRouter();
    const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage(null);
        const form = e.currentTarget;
        const displayName = (form.elements.namedItem("displayName") as HTMLInputElement).value;

        startTransition(async () => {
            const result = await updateDisplayName(displayName, locale);
            if (result.error) {
                setMessage({ kind: "err", text: result.error });
            } else {
                setMessage({ kind: "ok", text: labels.saved });
                router.refresh();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
            {email && (
                <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-400">
                        {labels.emailFieldLabel}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{email}</p>
                    <p className="mt-1 text-xs text-neutral-400">{labels.emailHint}</p>
                </div>
            )}
            <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {labels.displayNameLabel}
                </span>
                <input
                    name="displayName"
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    defaultValue={initialDisplayName}
                    className="rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                />
            </label>

            {message && (
                <p
                    className={`rounded-lg px-3 py-2 text-sm ${message.kind === "ok" ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"}`}
                >
                    {message.text}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
            >
                {isPending ? labels.saving : labels.save}
            </button>
        </form>
    );
}
