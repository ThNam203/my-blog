"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, signInWithGoogle, signUp } from "@/lib/actions/auth";
import type { AuthModalLabels } from "@/i18n/dictionaries";

export type AuthModalTab = "login" | "register";

type Props = {
    onClose: () => void;
    initialTab?: AuthModalTab;
    labels: AuthModalLabels;
};

export function AuthModal({ onClose, initialTab = "login", labels }: Props) {
    const [tab, setTab] = useState<AuthModalTab>(initialTab);
    const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(
        null,
    );
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const dialogRef = useRef<HTMLDivElement>(null);

    function handleBackdropClick(e: React.MouseEvent) {
        if (e.target === e.currentTarget) onClose();
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFeedback(null);
        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        startTransition(async () => {
            if (tab === "login") {
                const result = await signIn(email, password);
                if (result.error) {
                    setFeedback({ kind: "error", text: result.error });
                } else {
                    router.refresh();
                    onClose();
                }
            } else {
                const displayName = (form.elements.namedItem("displayName") as HTMLInputElement)
                    .value;
                const result = await signUp(displayName, email, password);
                if (result.error) {
                    setFeedback({ kind: "error", text: result.error });
                } else {
                    setTab("login");
                    setFeedback({ kind: "success", text: labels.registerSuccess });
                }
            }
        });
    }

    function handleGoogleSignIn() {
        setFeedback(null);
        startTransition(async () => {
            const result = await signInWithGoogle();
            if (result.error) {
                setFeedback({ kind: "error", text: result.error });
                return;
            }
            if (!result.url) {
                setFeedback({ kind: "error", text: labels.googleStartError });
                return;
            }
            router.push(result.url);
        });
    }

    let submitLabel = labels.submitRegister;
    if (isPending) {
        submitLabel = labels.submitWait;
    } else if (tab === "login") {
        submitLabel = labels.submitLogin;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div
                ref={dialogRef}
                className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
            >
                <div className="mb-6 flex items-center justify-between">
                    <div className="rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                        <button
                            type="button"
                            onClick={() => {
                                setTab("login");
                                setFeedback(null);
                            }}
                            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${tab === "login" ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white" : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white"}`}
                        >
                            {labels.tabLogin}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTab("register");
                                setFeedback(null);
                            }}
                            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${tab === "register" ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white" : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white"}`}
                        >
                            {labels.tabRegister}
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        aria-label={labels.closeAria}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {tab === "register" && (
                        <input
                            name="displayName"
                            type="text"
                            placeholder={labels.placeholderDisplayName}
                            required
                            minLength={2}
                            maxLength={50}
                            className="rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                        />
                    )}
                    <input
                        name="email"
                        type="email"
                        placeholder={labels.placeholderEmail}
                        required
                        className="rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder={labels.placeholderPassword}
                        required
                        minLength={6}
                        className="rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                    />

                    {feedback && (
                        <p
                            className={`rounded-lg px-3 py-2 text-sm ${feedback.kind === "success" ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"}`}
                        >
                            {feedback.text}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                    >
                        {submitLabel}
                    </button>
                </form>

                <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                    <span className="text-xs uppercase tracking-wider text-neutral-400">
                        {labels.dividerOr}
                    </span>
                    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                    <span className="text-base">G</span>
                    {labels.googleCta}
                </button>
            </div>
        </div>
    );
}
