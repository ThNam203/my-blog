"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn, signInWithGoogle, signUp } from "@/lib/actions/auth";

type Tab = "login" | "register";

type Props = {
    onClose: () => void;
};

export function AuthModal({ onClose }: Props) {
    const [tab, setTab] = useState<Tab>("login");
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const dialogRef = useRef<HTMLDivElement>(null);

    function handleBackdropClick(e: React.MouseEvent) {
        if (e.target === e.currentTarget) onClose();
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("");
        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        startTransition(async () => {
            if (tab === "login") {
                const result = await signIn(email, password);
                if (result.error) {
                    setMessage(result.error);
                } else {
                    router.refresh();
                    onClose();
                }
            } else {
                const displayName = (form.elements.namedItem("displayName") as HTMLInputElement).value;
                const result = await signUp(displayName, email, password);
                if (result.error) {
                    setMessage(result.error);
                } else {
                    setMessage("");
                    // Show success state — Supabase sends a confirmation email by default
                    // (can be disabled in Supabase dashboard → Auth → Settings)
                    setTab("login");
                    setMessage("Account created! Check your email to confirm, then log in.");
                }
            }
        });
    }

    function handleGoogleSignIn() {
        setMessage("");
        startTransition(async () => {
            const result = await signInWithGoogle();
            if (result.error) {
                setMessage(result.error);
                return;
            }
            if (!result.url) {
                setMessage("Could not start Google sign in. Please try again.");
                return;
            }
            router.push(result.url);
        });
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
                                setMessage("");
                            }}
                            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${tab === "login" ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white" : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white"}`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTab("register");
                                setMessage("");
                            }}
                            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${tab === "register" ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white" : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-white"}`}
                        >
                            Register
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {tab === "register" && (
                        <input
                            name="displayName"
                            type="text"
                            placeholder="Display name"
                            required
                            minLength={2}
                            maxLength={50}
                            className="rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                        />
                    )}
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        minLength={6}
                        className="rounded-xl border border-neutral-300 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-neutral-500 dark:border-neutral-600 dark:focus:border-neutral-400"
                    />

                    {message && (
                        <p className={`rounded-lg px-3 py-2 text-sm ${message.startsWith("Account created") ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="mt-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                    >
                        {isPending ? "Please wait..." : tab === "login" ? "Login" : "Create account"}
                    </button>
                </form>

                <div className="my-4 flex items-center gap-3">
                    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                    <span className="text-xs uppercase tracking-wider text-neutral-400">or</span>
                    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isPending}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                    <span className="text-base">G</span>
                    Continue with Google
                </button>
            </div>
        </div>
    );
}
