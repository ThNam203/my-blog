"use client";

import cn from "classnames";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

type Props = {
    locale: string;
    heading: string;
    description: string;
    placeholder: string;
    submitLabel: string;
    submittingLabel: string;
    successLabel: string;
    genericErrorLabel: string;
};

export function NewsletterForm({
    locale,
    heading,
    description,
    placeholder,
    submitLabel,
    submittingLabel,
    successLabel,
    genericErrorLabel,
}: Props) {
    const [email, setEmail] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmed = email.trim();
        if (!trimmed) return;
        startTransition(async () => {
            try {
                const result = await subscribeToNewsletter(trimmed, locale);
                if (result.ok) {
                    toast.success(successLabel);
                    setEmail("");
                } else {
                    toast.error(result.error);
                }
            } catch {
                toast.error(genericErrorLabel);
            }
        });
    }

    return (
        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/40">
            <h3 className="mb-1 text-lg font-semibold">{heading}</h3>
            <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
                {description}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={placeholder}
                    disabled={isPending}
                    className={cn(
                        "flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm",
                        "outline-none focus:border-neutral-500 dark:border-neutral-600 dark:bg-neutral-900",
                        "disabled:opacity-60",
                    )}
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className={cn(
                        "rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white",
                        "transition-opacity hover:opacity-80 disabled:opacity-50",
                        "dark:bg-white dark:text-neutral-900",
                    )}
                >
                    {isPending ? submittingLabel : submitLabel}
                </button>
            </form>
        </section>
    );
}
